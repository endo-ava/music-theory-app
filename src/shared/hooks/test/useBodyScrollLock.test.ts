import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useBodyScrollLock } from '../useBodyScrollLock';

describe('useBodyScrollLock', () => {
  // DOM環境のモック変数
  let mockBody: {
    style: {
      overflow: string;
      position: string;
      top: string;
      width: string;
    };
  };
  let mockScrollTo: ReturnType<typeof vi.fn>;
  let originalScrollY: number;

  beforeEach(() => {
    // body要素のモック
    mockBody = {
      style: {
        overflow: '',
        position: '',
        top: '',
        width: '',
      },
    };

    // windowのモック
    mockScrollTo = vi.fn();
    originalScrollY = 100;

    // グローバルプロパティの設定
    Object.defineProperty(global, 'document', {
      value: {
        body: mockBody,
      },
      configurable: true,
    });

    Object.defineProperty(global, 'window', {
      value: {
        scrollY: originalScrollY,
        scrollTo: mockScrollTo,
      },
      configurable: true,
      writable: true,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe.skip('locked = true の場合', () => {
    it('正常ケース: bodyのスタイルが正しく設定される', () => {
      renderHook(() => useBodyScrollLock(true));

      expect(mockBody.style.overflow).toBe('hidden');
      expect(mockBody.style.position).toBe('fixed');
      expect(mockBody.style.top).toBe('-100px');
      expect(mockBody.style.width).toBe('100%');
    });

    it('正常ケース: クリーンアップ時に元の状態に復元される', () => {
      // 初期スタイルを設定
      mockBody.style.overflow = 'auto';
      mockBody.style.position = 'relative';

      const { unmount } = renderHook(() => useBodyScrollLock(true));

      // ロック時のスタイル確認
      expect(mockBody.style.overflow).toBe('hidden');
      expect(mockBody.style.position).toBe('fixed');

      // クリーンアップ実行
      unmount();

      // 元のスタイルが復元される
      expect(mockBody.style.overflow).toBe('auto');
      expect(mockBody.style.position).toBe('relative');
      expect(mockScrollTo).toHaveBeenCalledWith(0, 100);
    });

    it('境界値ケース: scrollY = 0 の場合', () => {
      Object.defineProperty(global.window, 'scrollY', { value: 0, configurable: true });

      renderHook(() => useBodyScrollLock(true));

      expect(mockBody.style.top).toBe('-0px');
    });

    it('正常ケース: 異なるscrollY値でも正しく動作する', () => {
      Object.defineProperty(global.window, 'scrollY', { value: 250, configurable: true });

      renderHook(() => useBodyScrollLock(true));

      expect(mockBody.style.top).toBe('-250px');
    });
  });

  describe.skip('locked = false の場合', () => {
    it('正常ケース: bodyのスタイルが変更されない', () => {
      const originalOverflow = 'auto';
      mockBody.style.overflow = originalOverflow;

      renderHook(() => useBodyScrollLock(false));

      expect(mockBody.style.overflow).toBe(originalOverflow);
    });

    it('正常ケース: scrollToが呼ばれない', () => {
      const { unmount } = renderHook(() => useBodyScrollLock(false));

      unmount();

      expect(mockScrollTo).not.toHaveBeenCalled();
    });

    it('正常ケース: 他のスタイルプロパティも変更されない', () => {
      mockBody.style.position = 'static';
      mockBody.style.top = '10px';
      mockBody.style.width = '50%';

      renderHook(() => useBodyScrollLock(false));

      expect(mockBody.style.position).toBe('static');
      expect(mockBody.style.top).toBe('10px');
      expect(mockBody.style.width).toBe('50%');
    });
  });

  describe.skip('状態変更', () => {
    it('正常ケース: locked が true → false に変更された場合', () => {
      const { rerender, unmount } = renderHook(({ locked }) => useBodyScrollLock(locked), {
        initialProps: { locked: true },
      });

      // 初期状態でロックが適用される
      expect(mockBody.style.overflow).toBe('hidden');

      // locked を false に変更
      rerender({ locked: false });

      // ロックが解除される
      expect(mockBody.style.overflow).toBe('');

      unmount();
    });

    it('正常ケース: locked が false → true に変更された場合', () => {
      const { rerender } = renderHook(({ locked }) => useBodyScrollLock(locked), {
        initialProps: { locked: false },
      });

      // 初期状態では何も変更されない
      expect(mockBody.style.overflow).toBe('');

      // locked を true に変更
      rerender({ locked: true });

      // ロックが適用される
      expect(mockBody.style.overflow).toBe('hidden');
      expect(mockBody.style.position).toBe('fixed');
    });

    it('正常ケース: locked が複数回切り替わる場合', () => {
      const { rerender } = renderHook(({ locked }) => useBodyScrollLock(locked), {
        initialProps: { locked: false },
      });

      expect(mockBody.style.overflow).toBe('');

      rerender({ locked: true });
      expect(mockBody.style.overflow).toBe('hidden');

      rerender({ locked: false });
      expect(mockBody.style.overflow).toBe('');

      rerender({ locked: true });
      expect(mockBody.style.overflow).toBe('hidden');
    });
  });

  describe.skip('エッジケース', () => {
    it('正常ケース: 初期スタイルが空文字列の場合', () => {
      mockBody.style.overflow = '';
      mockBody.style.position = '';

      const { unmount } = renderHook(() => useBodyScrollLock(true));

      expect(mockBody.style.overflow).toBe('hidden');

      unmount();

      expect(mockBody.style.overflow).toBe('');
      expect(mockBody.style.position).toBe('');
    });

    it('正常ケース: スクロール位置が負の値の場合（通常発生しない）', () => {
      Object.defineProperty(global.window, 'scrollY', { value: -10, configurable: true });

      renderHook(() => useBodyScrollLock(true));

      expect(mockBody.style.top).toBe('--10px');
    });
  });
});
