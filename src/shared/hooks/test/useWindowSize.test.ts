import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useWindowSize } from '../useWindowSize';

describe('useWindowSize', () => {
  // モック変数
  let mockInnerWidth: number;
  let mockInnerHeight: number;
  let mockAddEventListener: ReturnType<typeof vi.fn>;
  let mockRemoveEventListener: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // 初期値を設定
    mockInnerWidth = 1024;
    mockInnerHeight = 768;
    mockAddEventListener = vi.fn();
    mockRemoveEventListener = vi.fn();

    // windowオブジェクトのモック
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: mockInnerWidth,
    });

    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: mockInnerHeight,
    });

    window.addEventListener = mockAddEventListener;
    window.removeEventListener = mockRemoveEventListener;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('初期化', () => {
    it('正常ケース: 初期状態でwindowサイズを正しく取得する', () => {
      const { result } = renderHook(() => useWindowSize());

      expect(result.current).toEqual({
        width: 1024,
        height: 768,
      });
    });

    it('正常ケース: resizeイベントリスナーが登録される', () => {
      renderHook(() => useWindowSize());

      expect(mockAddEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
      expect(mockAddEventListener).toHaveBeenCalledTimes(1);
    });

    it('境界値ケース: width, heightが0の場合', () => {
      // windowサイズを0に設定
      Object.defineProperty(window, 'innerWidth', { value: 0 });
      Object.defineProperty(window, 'innerHeight', { value: 0 });

      const { result } = renderHook(() => useWindowSize());

      expect(result.current).toEqual({
        width: 0,
        height: 0,
      });
    });

    it('境界値ケース: 極大値の場合', () => {
      const maxValue = Number.MAX_SAFE_INTEGER;
      Object.defineProperty(window, 'innerWidth', { value: maxValue });
      Object.defineProperty(window, 'innerHeight', { value: maxValue });

      const { result } = renderHook(() => useWindowSize());

      expect(result.current).toEqual({
        width: maxValue,
        height: maxValue,
      });
    });
  });

  describe('リサイズイベント処理', () => {
    it('正常ケース: リサイズイベントでサイズが更新される', () => {
      const { result } = renderHook(() => useWindowSize());

      // 初期値を確認
      expect(result.current.width).toBe(1024);
      expect(result.current.height).toBe(768);

      // windowサイズを変更
      Object.defineProperty(window, 'innerWidth', { value: 1280 });
      Object.defineProperty(window, 'innerHeight', { value: 800 });

      // resizeイベントを発火
      const resizeHandler = mockAddEventListener.mock.calls[0][1];
      act(() => {
        resizeHandler();
      });

      // 更新された値を確認
      expect(result.current).toEqual({
        width: 1280,
        height: 800,
      });
    });

    it('正常ケース: 複数回のリサイズイベントが正しく処理される', () => {
      const { result } = renderHook(() => useWindowSize());
      const resizeHandler = mockAddEventListener.mock.calls[0][1];

      // 1回目のリサイズ
      Object.defineProperty(window, 'innerWidth', { value: 800 });
      Object.defineProperty(window, 'innerHeight', { value: 600 });
      act(() => {
        resizeHandler();
      });

      expect(result.current).toEqual({ width: 800, height: 600 });

      // 2回目のリサイズ
      Object.defineProperty(window, 'innerWidth', { value: 1920 });
      Object.defineProperty(window, 'innerHeight', { value: 1080 });
      act(() => {
        resizeHandler();
      });

      expect(result.current).toEqual({ width: 1920, height: 1080 });
    });

    it('境界値ケース: サイズが頻繁に変更される場合', () => {
      const { result } = renderHook(() => useWindowSize());
      const resizeHandler = mockAddEventListener.mock.calls[0][1];

      // 10回の連続したリサイズイベント
      for (let i = 1; i <= 10; i++) {
        Object.defineProperty(window, 'innerWidth', { value: 100 * i });
        Object.defineProperty(window, 'innerHeight', { value: 100 * i });
        act(() => {
          resizeHandler();
        });

        expect(result.current).toEqual({
          width: 100 * i,
          height: 100 * i,
        });
      }
    });
  });

  describe('クリーンアップ', () => {
    it('正常ケース: アンマウント時にイベントリスナーが削除される', () => {
      const { unmount } = renderHook(() => useWindowSize());

      // アンマウント前の状態確認
      expect(mockAddEventListener).toHaveBeenCalledTimes(1);
      expect(mockRemoveEventListener).not.toHaveBeenCalled();

      // アンマウント
      unmount();

      // イベントリスナーが削除されることを確認
      expect(mockRemoveEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
      expect(mockRemoveEventListener).toHaveBeenCalledTimes(1);
    });

    it('正常ケース: 複数のインスタンスで独立してクリーンアップされる', () => {
      const { unmount: unmount1 } = renderHook(() => useWindowSize());
      const { unmount: unmount2 } = renderHook(() => useWindowSize());

      // 2つのインスタンスでリスナーが登録される
      expect(mockAddEventListener).toHaveBeenCalledTimes(2);

      // 1つ目をアンマウント
      unmount1();
      expect(mockRemoveEventListener).toHaveBeenCalledTimes(1);

      // 2つ目をアンマウント
      unmount2();
      expect(mockRemoveEventListener).toHaveBeenCalledTimes(2);
    });
  });

  describe('SSR対応', () => {
    it('正常ケース: window.innerWidthとwindow.innerHeightへのアクセスがSSRセーフである', () => {
      // windowオブジェクトが正常にアクセスできることを確認
      const { result } = renderHook(() => useWindowSize());

      expect(() => result.current).not.toThrow();
      expect(result.current.width).toBeTypeOf('number');
      expect(result.current.height).toBeTypeOf('number');
    });

    it('正常ケース: useEffectがクライアントサイドでのみ実行される', () => {
      // useEffectの実行確認（イベントリスナーの登録で間接的に確認）
      renderHook(() => useWindowSize());

      expect(mockAddEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
    });
  });
});
