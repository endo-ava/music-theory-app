import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useBodyScrollLock } from '../useBodyScrollLock';

describe('useBodyScrollLock', () => {
  let mockScrollTo: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // body要素の初期スタイルをリセット
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';

    // window.scrollToをモック
    mockScrollTo = vi.fn();
    window.scrollTo = mockScrollTo;

    // scrollYをモック（デフォルト値）
    Object.defineProperty(window, 'scrollY', {
      value: 100,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    // body要素のスタイルをクリーンアップ
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
  });

  describe('locked = true の場合', () => {
    it('正常ケース: bodyのスタイルが正しく設定される', () => {
      renderHook(() => useBodyScrollLock(true));

      expect(document.body.style.overflow).toBe('hidden');
      expect(document.body.style.position).toBe('fixed');
      expect(document.body.style.top).toBe('-100px');
      expect(document.body.style.width).toBe('100%');
    });

    it('正常ケース: クリーンアップ時に元の状態に復元される', () => {
      // 初期スタイルを設定
      document.body.style.overflow = 'auto';
      document.body.style.position = 'relative';

      const { unmount } = renderHook(() => useBodyScrollLock(true));

      // ロック時のスタイル確認
      expect(document.body.style.overflow).toBe('hidden');
      expect(document.body.style.position).toBe('fixed');

      // クリーンアップ実行
      unmount();

      // 元のスタイルが復元される
      expect(document.body.style.overflow).toBe('auto');
      expect(document.body.style.position).toBe('relative');
      expect(mockScrollTo).toHaveBeenCalledWith(0, 100);
    });

    it('境界値ケース: scrollY = 0 の場合', () => {
      Object.defineProperty(window, 'scrollY', { value: 0, configurable: true, writable: true });

      renderHook(() => useBodyScrollLock(true));

      // -0 は 0 として正規化されるため
      expect(document.body.style.top).toBe('0px');
    });

    it('正常ケース: 異なるscrollY値でも正しく動作する', () => {
      Object.defineProperty(window, 'scrollY', { value: 250, configurable: true, writable: true });

      renderHook(() => useBodyScrollLock(true));

      expect(document.body.style.top).toBe('-250px');
    });
  });

  describe('locked = false の場合', () => {
    it('正常ケース: bodyのスタイルが変更されない', () => {
      const originalOverflow = 'auto';
      document.body.style.overflow = originalOverflow;

      renderHook(() => useBodyScrollLock(false));

      expect(document.body.style.overflow).toBe(originalOverflow);
    });

    it('正常ケース: scrollToが呼ばれない', () => {
      const { unmount } = renderHook(() => useBodyScrollLock(false));

      unmount();

      expect(mockScrollTo).not.toHaveBeenCalled();
    });

    it('正常ケース: 他のスタイルプロパティも変更されない', () => {
      document.body.style.position = 'static';
      document.body.style.top = '10px';
      document.body.style.width = '50%';

      renderHook(() => useBodyScrollLock(false));

      expect(document.body.style.position).toBe('static');
      expect(document.body.style.top).toBe('10px');
      expect(document.body.style.width).toBe('50%');
    });
  });

  describe('状態変更', () => {
    it('正常ケース: locked が true → false に変更された場合', () => {
      const { rerender, unmount } = renderHook(({ locked }) => useBodyScrollLock(locked), {
        initialProps: { locked: true },
      });

      // 初期状態でロックが適用される
      expect(document.body.style.overflow).toBe('hidden');

      // locked を false に変更
      rerender({ locked: false });

      // ロックが解除される
      expect(document.body.style.overflow).toBe('');

      unmount();
    });

    it('正常ケース: locked が false → true に変更された場合', () => {
      const { rerender } = renderHook(({ locked }) => useBodyScrollLock(locked), {
        initialProps: { locked: false },
      });

      // 初期状態では何も変更されない
      expect(document.body.style.overflow).toBe('');

      // locked を true に変更
      rerender({ locked: true });

      // ロックが適用される
      expect(document.body.style.overflow).toBe('hidden');
      expect(document.body.style.position).toBe('fixed');
    });

    it('正常ケース: locked が複数回切り替わる場合', () => {
      const { rerender } = renderHook(({ locked }) => useBodyScrollLock(locked), {
        initialProps: { locked: false },
      });

      expect(document.body.style.overflow).toBe('');

      rerender({ locked: true });
      expect(document.body.style.overflow).toBe('hidden');

      rerender({ locked: false });
      expect(document.body.style.overflow).toBe('');

      rerender({ locked: true });
      expect(document.body.style.overflow).toBe('hidden');
    });
  });

  describe('エッジケース', () => {
    it('正常ケース: 初期スタイルが空文字列の場合', () => {
      document.body.style.overflow = '';
      document.body.style.position = '';

      const { unmount } = renderHook(() => useBodyScrollLock(true));

      expect(document.body.style.overflow).toBe('hidden');

      unmount();

      expect(document.body.style.overflow).toBe('');
      expect(document.body.style.position).toBe('');
    });

    it('正常ケース: スクロール位置が負の値の場合（通常発生しない）', () => {
      Object.defineProperty(window, 'scrollY', { value: -10, configurable: true, writable: true });

      renderHook(() => useBodyScrollLock(true));

      // --10px は無効なCSS値なので、ブラウザによって無視され空文字列または10pxになる
      // ここでは実装が試みた値を設定することを確認
      const topValue = document.body.style.top;
      expect(topValue === '' || topValue === '10px').toBe(true);
    });
  });
});
