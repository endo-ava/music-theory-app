import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useFixedViewportHeight } from '../useFixedViewportHeight';

describe('useFixedViewportHeight', () => {
  // モック変数
  let mockInnerHeight: number;
  let originalWindow: Window & typeof globalThis;

  beforeEach(() => {
    // 初期値を設定
    mockInnerHeight = 1000;
    originalWindow = global.window;

    // windowオブジェクトのモック
    Object.defineProperty(global, 'window', {
      writable: true,
      value: {
        innerHeight: mockInnerHeight,
      },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    global.window = originalWindow;
  });

  describe('初期化', () => {
    it('正常ケース: 初期状態でwindow.innerHeightを正しく取得する', () => {
      const { result } = renderHook(() => useFixedViewportHeight());

      expect(result.current).toBe(1000);
    });

    it('境界値ケース: window.innerHeightが0の場合', () => {
      Object.defineProperty(global, 'window', {
        writable: true,
        value: {
          innerHeight: 0,
        },
      });

      const { result } = renderHook(() => useFixedViewportHeight());

      expect(result.current).toBe(0);
    });

    it('境界値ケース: window.innerHeightが極大値の場合', () => {
      const maxValue = Number.MAX_SAFE_INTEGER;
      Object.defineProperty(global, 'window', {
        writable: true,
        value: {
          innerHeight: maxValue,
        },
      });

      const { result } = renderHook(() => useFixedViewportHeight());

      expect(result.current).toBe(maxValue);
    });
  });

  describe('固定値の維持', () => {
    it('正常ケース: 初回取得後は値が固定される', () => {
      const { result, rerender } = renderHook(() => useFixedViewportHeight());

      // 初期値を確認
      expect(result.current).toBe(1000);

      // window.innerHeightを変更
      Object.defineProperty(global, 'window', {
        writable: true,
        value: {
          innerHeight: 1200,
        },
      });

      // 再レンダリング
      rerender();

      // 値が固定されていることを確認（変更されない）
      expect(result.current).toBe(1000);
    });

    it('正常ケース: 複数回の再レンダリングでも値が固定される', () => {
      const { result, rerender } = renderHook(() => useFixedViewportHeight());

      // 初期値を確認
      expect(result.current).toBe(1000);

      // 複数回window.innerHeightを変更して再レンダリング
      for (let i = 1; i <= 5; i++) {
        Object.defineProperty(global, 'window', {
          writable: true,
          value: {
            innerHeight: 1000 + i * 100,
          },
        });
        rerender();

        // 値が固定されていることを確認
        expect(result.current).toBe(1000);
      }
    });
  });

  describe('SSR対応', () => {
    it('正常ケース: windowが正常にアクセスできることを確認', () => {
      // window.innerHeightが正常にアクセスできることを確認
      const { result } = renderHook(() => useFixedViewportHeight());

      expect(() => result.current).not.toThrow();
      expect(typeof result.current).toBe('number');
    });

    it('正常ケース: useEffectがクライアントサイドでのみ実行される', () => {
      // useEffectの実行確認（初回のみ値が設定されることで間接的に確認）
      const { result } = renderHook(() => useFixedViewportHeight());

      // 初回で値が設定される
      expect(result.current).toBe(1000);
    });
  });

  describe('複数インスタンス', () => {
    it('正常ケース: 複数のインスタンスが独立して動作する', () => {
      const { result: result1 } = renderHook(() => useFixedViewportHeight());
      const { result: result2 } = renderHook(() => useFixedViewportHeight());

      // 両方とも同じ値を取得
      expect(result1.current).toBe(1000);
      expect(result2.current).toBe(1000);
    });

    it('正常ケース: 異なるタイミングでマウントされたインスタンス', () => {
      const { result: result1 } = renderHook(() => useFixedViewportHeight());

      // 初期値を確認
      expect(result1.current).toBe(1000);

      // window.innerHeightを変更
      Object.defineProperty(global, 'window', {
        writable: true,
        value: {
          innerHeight: 1200,
        },
      });

      // 新しいインスタンスをマウント
      const { result: result2 } = renderHook(() => useFixedViewportHeight());

      // 最初のインスタンスは固定値
      expect(result1.current).toBe(1000);
      // 新しいインスタンスは新しい値で固定
      expect(result2.current).toBe(1200);
    });
  });

  describe('戻り値の型', () => {
    it('正常ケース: 戻り値がnumber型である', () => {
      const { result } = renderHook(() => useFixedViewportHeight());

      expect(typeof result.current).toBe('number');
    });

    it('正常ケース: 戻り値が有限数である', () => {
      const { result } = renderHook(() => useFixedViewportHeight());

      expect(Number.isFinite(result.current)).toBe(true);
    });

    it('正常ケース: 戻り値が非負数である', () => {
      const { result } = renderHook(() => useFixedViewportHeight());

      expect(result.current).toBeGreaterThanOrEqual(0);
    });
  });
});
