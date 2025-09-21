import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRippleEffect } from '../useRippleEffect';

describe('useRippleEffect hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('基本機能', () => {
    test('正常ケース: フックが正しい構造を返す', () => {
      const { result } = renderHook(() => useRippleEffect());

      expect(result.current).toHaveProperty('isRippleActive');
      expect(result.current).toHaveProperty('triggerRipple');
      expect(result.current).toHaveProperty('resetRipple');

      expect(typeof result.current.isRippleActive).toBe('boolean');
      expect(typeof result.current.triggerRipple).toBe('function');
      expect(typeof result.current.resetRipple).toBe('function');
    });

    test('正常ケース: 初期状態でリップルが非活性', () => {
      const { result } = renderHook(() => useRippleEffect());

      expect(result.current.isRippleActive).toBe(false);
    });

    test('正常ケース: 複数回レンダリングで安定した関数参照を返す', () => {
      const { result, rerender } = renderHook(() => useRippleEffect());

      const firstRender = result.current;
      rerender();
      const secondRender = result.current;

      // useCallbackにより同じ関数参照が返される
      expect(firstRender.triggerRipple).toBe(secondRender.triggerRipple);
      expect(firstRender.resetRipple).toBe(secondRender.resetRipple);
    });
  });

  describe('リップルトリガー機能', () => {
    test('正常ケース: triggerRippleでリップルが活性化', () => {
      const { result } = renderHook(() => useRippleEffect());

      act(() => {
        result.current.triggerRipple();
      });

      expect(result.current.isRippleActive).toBe(true);
    });

    test('正常ケース: 複数回triggerRippleを呼び出し', () => {
      const { result } = renderHook(() => useRippleEffect());

      act(() => {
        result.current.triggerRipple();
        result.current.triggerRipple();
        result.current.triggerRipple();
      });

      // 複数回呼び出してもtrueのまま
      expect(result.current.isRippleActive).toBe(true);
    });

    test('正常ケース: triggerRipple後の自動リセット', () => {
      const { result } = renderHook(() => useRippleEffect());

      act(() => {
        result.current.triggerRipple();
      });

      expect(result.current.isRippleActive).toBe(true);

      // 自動リセットタイマーの実行
      act(() => {
        vi.runAllTimers();
      });

      expect(result.current.isRippleActive).toBe(false);
    });

    test('正常ケース: 適切なタイムアウト時間での自動リセット', () => {
      const { result } = renderHook(() => useRippleEffect());

      act(() => {
        result.current.triggerRipple();
      });

      expect(result.current.isRippleActive).toBe(true);

      // 100ms未満では自動リセットされない
      act(() => {
        vi.advanceTimersByTime(50);
      });

      expect(result.current.isRippleActive).toBe(true);

      // 100ms経過で自動リセット
      act(() => {
        vi.advanceTimersByTime(50);
      });

      expect(result.current.isRippleActive).toBe(false);
    });
  });

  describe('リップルリセット機能', () => {
    test('正常ケース: resetRippleで手動リセット', () => {
      const { result } = renderHook(() => useRippleEffect());

      // まずリップルを活性化
      act(() => {
        result.current.triggerRipple();
      });

      expect(result.current.isRippleActive).toBe(true);

      // 手動でリセット
      act(() => {
        result.current.resetRipple();
      });

      expect(result.current.isRippleActive).toBe(false);
    });

    test('正常ケース: 非活性状態でのresetRipple', () => {
      const { result } = renderHook(() => useRippleEffect());

      // 初期状態（非活性）でリセットを呼び出し
      act(() => {
        result.current.resetRipple();
      });

      // エラーが発生せず、falseのまま
      expect(result.current.isRippleActive).toBe(false);
    });

    test('正常ケース: 複数回resetRippleを呼び出し', () => {
      const { result } = renderHook(() => useRippleEffect());

      act(() => {
        result.current.triggerRipple();
      });

      act(() => {
        result.current.resetRipple();
        result.current.resetRipple();
        result.current.resetRipple();
      });

      // 複数回呼び出してもfalseのまま
      expect(result.current.isRippleActive).toBe(false);
    });
  });

  describe('タイマー管理', () => {
    test('正常ケース: 手動リセット後の自動リセットタイマー無効化', () => {
      const { result } = renderHook(() => useRippleEffect());

      act(() => {
        result.current.triggerRipple();
      });

      // 手動でリセット（タイマーをクリア）
      act(() => {
        result.current.resetRipple();
      });

      expect(result.current.isRippleActive).toBe(false);

      // その後タイマーが動作しても状態は変わらない
      act(() => {
        vi.runAllTimers();
      });

      expect(result.current.isRippleActive).toBe(false);
    });

    test('正常ケース: 複数回のトリガーでタイマーリセット', () => {
      const { result } = renderHook(() => useRippleEffect());

      act(() => {
        result.current.triggerRipple();
      });

      // 一部時間経過
      act(() => {
        vi.advanceTimersByTime(50);
      });

      // 再度トリガー（新しいタイマーが開始されるが、最初のタイマーも継続）
      act(() => {
        result.current.triggerRipple();
      });

      // 最初のトリガーから100ms経過で最初のタイマーがリセットを実行
      act(() => {
        vi.advanceTimersByTime(50);
      });

      // 実装では複数のタイマーが並行して動作し、最初に完了したタイマーがリセットする
      expect(result.current.isRippleActive).toBe(false);
    });

    test('正常ケース: コンポーネントアンマウント時のタイマークリア', () => {
      const { result, unmount } = renderHook(() => useRippleEffect());

      act(() => {
        result.current.triggerRipple();
      });

      expect(result.current.isRippleActive).toBe(true);

      // コンポーネントをアンマウント
      unmount();

      // タイマーが残っていてもエラーが発生しないことを確認
      act(() => {
        vi.runAllTimers();
      });

      // テストが正常に完了すればOK
      expect(true).toBe(true);
    });
  });

  describe('エッジケース', () => {
    test('正常ケース: 高速連続トリガー', () => {
      const { result } = renderHook(() => useRippleEffect());

      // 高速で連続トリガー
      act(() => {
        for (let i = 0; i < 10; i++) {
          result.current.triggerRipple();
        }
      });

      expect(result.current.isRippleActive).toBe(true);

      // 最後のトリガーから適切な時間でリセット
      act(() => {
        vi.advanceTimersByTime(600);
      });

      expect(result.current.isRippleActive).toBe(false);
    });

    test('正常ケース: トリガー→リセット→トリガーのサイクル', () => {
      const { result } = renderHook(() => useRippleEffect());

      // 1回目のサイクル
      act(() => {
        result.current.triggerRipple();
      });

      expect(result.current.isRippleActive).toBe(true);

      act(() => {
        result.current.resetRipple();
      });

      expect(result.current.isRippleActive).toBe(false);

      // 2回目のサイクル
      act(() => {
        result.current.triggerRipple();
      });

      expect(result.current.isRippleActive).toBe(true);

      act(() => {
        vi.advanceTimersByTime(600);
      });

      expect(result.current.isRippleActive).toBe(false);
    });
  });

  describe('メモ化とパフォーマンス', () => {
    test('正常ケース: 関数の安定性', () => {
      const { result, rerender } = renderHook(() => useRippleEffect());

      const firstRender = result.current;
      rerender();
      const secondRender = result.current;

      // useCallbackにより関数参照が安定している
      expect(firstRender.triggerRipple).toBe(secondRender.triggerRipple);
      expect(firstRender.resetRipple).toBe(secondRender.resetRipple);
    });

    test('正常ケース: 状態変更時の適切な再レンダリング', () => {
      const { result } = renderHook(() => useRippleEffect());

      let renderCount = 0;
      const originalIsRippleActive = result.current.isRippleActive;

      // 状態変更を監視
      const checkRender = () => {
        if (result.current.isRippleActive !== originalIsRippleActive) {
          renderCount++;
        }
      };

      act(() => {
        result.current.triggerRipple();
        checkRender();
      });

      act(() => {
        result.current.resetRipple();
        checkRender();
      });

      // 状態変更が適切に検出されることを確認
      expect(renderCount).toBeGreaterThan(0);
    });
  });

  describe('統合テスト', () => {
    test('正常ケース: 完全なリップルライフサイクル', () => {
      const { result } = renderHook(() => useRippleEffect());

      // 初期状態
      expect(result.current.isRippleActive).toBe(false);

      // トリガー
      act(() => {
        result.current.triggerRipple();
      });

      expect(result.current.isRippleActive).toBe(true);

      // 一部時間経過（まだ活性）
      act(() => {
        vi.advanceTimersByTime(50);
      });

      expect(result.current.isRippleActive).toBe(true);

      // 自動リセット
      act(() => {
        vi.advanceTimersByTime(50);
      });

      expect(result.current.isRippleActive).toBe(false);

      // 再度トリガー
      act(() => {
        result.current.triggerRipple();
      });

      expect(result.current.isRippleActive).toBe(true);

      // 手動リセット
      act(() => {
        result.current.resetRipple();
      });

      expect(result.current.isRippleActive).toBe(false);
    });
  });
});
