/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useChordProgression } from '../useChordProgression';

// モック
vi.mock('@/stores/circleOfFifthsStore');
vi.mock('@/stores/animationStore');
vi.mock('@/features/circle-of-fifths/hooks/useAudio');
vi.mock('@/domain/key');

// モックインポート
import { useCircleOfFifthsStore } from '@/stores/circleOfFifthsStore';
import { useAnimationStore } from '@/stores/animationStore';
import { useAudio } from '@/features/circle-of-fifths/hooks/useAudio';
import { Key } from '@/domain/key';

describe('useChordProgression', () => {
  // モック関数
  const mockSetSelectedKey = vi.fn();
  const mockStartAnimation = vi.fn();
  const mockPlayChordAtPosition = vi.fn();
  const mockFromCircleOfFifths = vi.fn();
  const mockToJSON = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();

    // デフォルトのモック実装
    vi.mocked(useCircleOfFifthsStore).mockReturnValue({
      selectedKey: { fifthsIndex: 0, isMajor: true },
      setSelectedKey: mockSetSelectedKey,
    } as any);

    vi.mocked(useAnimationStore).mockReturnValue({
      startAnimation: mockStartAnimation,
    } as any);

    vi.mocked(useAudio).mockReturnValue({
      playChordAtPosition: mockPlayChordAtPosition,
    } as any);

    mockFromCircleOfFifths.mockReturnValue({
      toJSON: mockToJSON,
    });
    vi.mocked(Key.fromCircleOfFifths).mockImplementation(mockFromCircleOfFifths);
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  describe('基本機能', () => {
    it('playFifthProgressionとplayTritoneSubstitutionの2つの関数を返す', () => {
      const { result } = renderHook(() => useChordProgression());

      expect(result.current).toHaveProperty('playFifthProgression');
      expect(result.current).toHaveProperty('playTritoneSubstitution');
      expect(typeof result.current.playFifthProgression).toBe('function');
      expect(typeof result.current.playTritoneSubstitution).toBe('function');
    });

    it('selectedKeyがnullの場合、何も実行しない', () => {
      vi.mocked(useCircleOfFifthsStore).mockReturnValue({
        selectedKey: null,
        setSelectedKey: mockSetSelectedKey,
      } as any);

      const { result } = renderHook(() => useChordProgression());

      act(() => {
        result.current.playFifthProgression();
      });

      expect(mockPlayChordAtPosition).not.toHaveBeenCalled();
      expect(mockStartAnimation).not.toHaveBeenCalled();
    });

    it('返される関数は再レンダー時に同一の参照を保つ', () => {
      const { result, rerender } = renderHook(() => useChordProgression());

      const firstRender = {
        playFifthProgression: result.current.playFifthProgression,
        playTritoneSubstitution: result.current.playTritoneSubstitution,
      };

      rerender();

      expect(result.current.playFifthProgression).toBe(firstRender.playFifthProgression);
      expect(result.current.playTritoneSubstitution).toBe(firstRender.playTritoneSubstitution);
    });

    it('依存配列が正しく設定されている（selectedKeyが変更されたら新しい関数が生成される）', () => {
      const { result, rerender } = renderHook(() => useChordProgression());

      const firstRender = result.current.playFifthProgression;

      // selectedKeyを変更
      vi.mocked(useCircleOfFifthsStore).mockReturnValue({
        selectedKey: { fifthsIndex: 5, isMajor: false },
        setSelectedKey: mockSetSelectedKey,
      } as any);

      rerender();

      // 新しい関数が生成されるはず（依存配列にselectedKeyが含まれているため）
      expect(result.current.playFifthProgression).not.toBe(firstRender);
    });
  });

  describe('五度進行（メジャーキー）', () => {
    it('Cメジャーキー（fifthsIndex=0）で五度進行を実行すると、Fメジャー（position=11）に進む', async () => {
      vi.mocked(useCircleOfFifthsStore).mockReturnValue({
        selectedKey: { fifthsIndex: 0, isMajor: true },
        setSelectedKey: mockSetSelectedKey,
      } as any);

      mockToJSON.mockReturnValue({ fifthsIndex: 11, isMajor: true });

      const { result } = renderHook(() => useChordProgression());

      act(() => {
        result.current.playFifthProgression();
      });

      // T+0ms: 起点のコードを再生
      expect(mockPlayChordAtPosition).toHaveBeenCalledWith(0, true);

      // T+200ms: アニメーション開始
      act(() => {
        vi.advanceTimersByTime(200);
      });
      expect(mockStartAnimation).toHaveBeenCalledWith({
        type: 'fifth',
        from: 0,
        to: 11,
        isMajor: true,
        duration: 2000,
      });

      // T+800ms: 解決先のコードを再生
      await act(async () => {
        vi.advanceTimersByTime(600);
        await vi.runAllTimersAsync();
      });
      expect(mockPlayChordAtPosition).toHaveBeenCalledWith(11, true);
      expect(mockFromCircleOfFifths).toHaveBeenCalledWith(11, true);
      expect(mockSetSelectedKey).toHaveBeenCalledWith({ fifthsIndex: 11, isMajor: true });
    });

    it('Gメジャーキー（fifthsIndex=7）で五度進行を実行すると、Cメジャー（position=6）に進む', async () => {
      vi.mocked(useCircleOfFifthsStore).mockReturnValue({
        selectedKey: { fifthsIndex: 7, isMajor: true },
        setSelectedKey: mockSetSelectedKey,
      } as any);

      mockToJSON.mockReturnValue({ fifthsIndex: 6, isMajor: true });

      const { result } = renderHook(() => useChordProgression());

      await act(async () => {
        result.current.playFifthProgression();
        vi.advanceTimersByTime(800);
        await vi.runAllTimersAsync();
      });

      expect(mockStartAnimation).toHaveBeenCalledWith({
        type: 'fifth',
        from: 7,
        to: 6,
        isMajor: true,
        duration: 2000,
      });
      expect(mockFromCircleOfFifths).toHaveBeenCalledWith(6, true);
    });

    it('F#メジャーキー（fifthsIndex=6）で五度進行を実行すると、Bメジャー（position=5）に進む', () => {
      vi.mocked(useCircleOfFifthsStore).mockReturnValue({
        selectedKey: { fifthsIndex: 6, isMajor: true },
        setSelectedKey: mockSetSelectedKey,
      } as any);

      mockToJSON.mockReturnValue({ fifthsIndex: 5, isMajor: true });

      const { result } = renderHook(() => useChordProgression());

      act(() => {
        result.current.playFifthProgression();
        vi.advanceTimersByTime(800);
      });

      expect(mockStartAnimation).toHaveBeenCalledWith({
        type: 'fifth',
        from: 6,
        to: 5,
        isMajor: true,
        duration: 2000,
      });
    });

    it('Dbメジャーキー（fifthsIndex=1）からの五度進行はGbメジャー（position=0）に進む', () => {
      vi.mocked(useCircleOfFifthsStore).mockReturnValue({
        selectedKey: { fifthsIndex: 1, isMajor: true },
        setSelectedKey: mockSetSelectedKey,
      } as any);

      mockToJSON.mockReturnValue({ fifthsIndex: 0, isMajor: true });

      const { result } = renderHook(() => useChordProgression());

      act(() => {
        result.current.playFifthProgression();
        vi.advanceTimersByTime(800);
      });

      expect(mockStartAnimation).toHaveBeenCalledWith({
        type: 'fifth',
        from: 1,
        to: 0,
        isMajor: true,
        duration: 2000,
      });
    });

    it('Abメジャーキー（fifthsIndex=11）からの五度進行はDbメジャー（position=10）に進む', () => {
      vi.mocked(useCircleOfFifthsStore).mockReturnValue({
        selectedKey: { fifthsIndex: 11, isMajor: true },
        setSelectedKey: mockSetSelectedKey,
      } as any);

      mockToJSON.mockReturnValue({ fifthsIndex: 10, isMajor: true });

      const { result } = renderHook(() => useChordProgression());

      act(() => {
        result.current.playFifthProgression();
        vi.advanceTimersByTime(800);
      });

      expect(mockStartAnimation).toHaveBeenCalledWith({
        type: 'fifth',
        from: 11,
        to: 10,
        isMajor: true,
        duration: 2000,
      });
    });
  });

  describe('五度進行（マイナーキー）', () => {
    it('Aマイナーキー（fifthsIndex=9）で五度進行を実行すると、視覚的位置6から5に進む', async () => {
      // Aマイナー: fifthsIndex=9, 視覚的位置は (9 + (-3) + 12) % 12 = 6 (Cメジャーの位置)
      vi.mocked(useCircleOfFifthsStore).mockReturnValue({
        selectedKey: { fifthsIndex: 9, isMajor: false },
        setSelectedKey: mockSetSelectedKey,
      } as any);

      mockToJSON.mockReturnValue({ fifthsIndex: 8, isMajor: false });

      const { result } = renderHook(() => useChordProgression());

      await act(async () => {
        result.current.playFifthProgression();
        vi.advanceTimersByTime(800);
        await vi.runAllTimersAsync();
      });

      expect(mockStartAnimation).toHaveBeenCalledWith({
        type: 'fifth',
        from: 6, // Cメジャーの位置
        to: 5, // Fメジャーの位置（Dマイナーが表示される）
        isMajor: false,
        duration: 2000,
      });

      // 視覚的位置5 -> fifthsIndex = (5 - (-3) + 12) % 12 = 8 (Dマイナー)
      expect(mockFromCircleOfFifths).toHaveBeenCalledWith(8, false);
    });

    it('Eマイナーキー（fifthsIndex=4）で五度進行を実行すると、Aマイナー（fifthsIndex=3）に進む', async () => {
      // Eマイナー: fifthsIndex=4, 視覚的位置は (4 + (-3) + 12) % 12 = 1
      vi.mocked(useCircleOfFifthsStore).mockReturnValue({
        selectedKey: { fifthsIndex: 4, isMajor: false },
        setSelectedKey: mockSetSelectedKey,
      } as any);

      mockToJSON.mockReturnValue({ fifthsIndex: 3, isMajor: false });

      const { result } = renderHook(() => useChordProgression());

      await act(async () => {
        result.current.playFifthProgression();
        vi.advanceTimersByTime(800);
        await vi.runAllTimersAsync();
      });

      expect(mockStartAnimation).toHaveBeenCalledWith({
        type: 'fifth',
        from: 1,
        to: 0,
        isMajor: false,
        duration: 2000,
      });

      // 視覚的位置0 -> fifthsIndex = (0 - (-3) + 12) % 12 = 3
      expect(mockFromCircleOfFifths).toHaveBeenCalledWith(3, false);
    });

    it('マイナーキーでも視覚的位置が正しく計算される', () => {
      // Dマイナー: fifthsIndex=2, 視覚的位置は (2 + (-3) + 12) % 12 = 11
      vi.mocked(useCircleOfFifthsStore).mockReturnValue({
        selectedKey: { fifthsIndex: 2, isMajor: false },
        setSelectedKey: mockSetSelectedKey,
      } as any);

      mockToJSON.mockReturnValue({ fifthsIndex: 1, isMajor: false });

      const { result } = renderHook(() => useChordProgression());

      act(() => {
        result.current.playFifthProgression();
      });

      // 起点のコードを視覚的位置11で再生
      expect(mockPlayChordAtPosition).toHaveBeenCalledWith(11, false);
    });
  });

  describe('裏コード進行', () => {
    it('Cメジャーキー（fifthsIndex=0）で裏コードを実行すると、F#メジャー（position=6）に進む', async () => {
      vi.mocked(useCircleOfFifthsStore).mockReturnValue({
        selectedKey: { fifthsIndex: 0, isMajor: true },
        setSelectedKey: mockSetSelectedKey,
      } as any);

      mockToJSON.mockReturnValue({ fifthsIndex: 6, isMajor: true });

      const { result } = renderHook(() => useChordProgression());

      await act(async () => {
        result.current.playTritoneSubstitution();
        vi.advanceTimersByTime(800);
        await vi.runAllTimersAsync();
      });

      expect(mockStartAnimation).toHaveBeenCalledWith({
        type: 'tritone',
        from: 0,
        to: 6,
        isMajor: true,
        duration: 2000,
      });
      expect(mockFromCircleOfFifths).toHaveBeenCalledWith(6, true);
    });

    it('Gメジャーキー（fifthsIndex=7）で裏コードを実行すると、Dbメジャー（position=1）に進む', () => {
      vi.mocked(useCircleOfFifthsStore).mockReturnValue({
        selectedKey: { fifthsIndex: 7, isMajor: true },
        setSelectedKey: mockSetSelectedKey,
      } as any);

      mockToJSON.mockReturnValue({ fifthsIndex: 1, isMajor: true });

      const { result } = renderHook(() => useChordProgression());

      act(() => {
        result.current.playTritoneSubstitution();
        vi.advanceTimersByTime(800);
      });

      expect(mockStartAnimation).toHaveBeenCalledWith({
        type: 'tritone',
        from: 7,
        to: 1,
        isMajor: true,
        duration: 2000,
      });
    });

    it('マイナーキーでも裏コード進行が正しく動作する', async () => {
      // Aマイナー: fifthsIndex=9, 視覚的位置6
      vi.mocked(useCircleOfFifthsStore).mockReturnValue({
        selectedKey: { fifthsIndex: 9, isMajor: false },
        setSelectedKey: mockSetSelectedKey,
      } as any);

      mockToJSON.mockReturnValue({ fifthsIndex: 3, isMajor: false });

      const { result } = renderHook(() => useChordProgression());

      await act(async () => {
        result.current.playTritoneSubstitution();
        vi.advanceTimersByTime(800);
        await vi.runAllTimersAsync();
      });

      // 視覚的位置: 6 + 6 = 12 % 12 = 0
      expect(mockStartAnimation).toHaveBeenCalledWith({
        type: 'tritone',
        from: 6,
        to: 0,
        isMajor: false,
        duration: 2000,
      });

      // 視覚的位置0 -> fifthsIndex = (0 - (-3) + 12) % 12 = 3
      expect(mockFromCircleOfFifths).toHaveBeenCalledWith(3, false);
    });
  });

  describe('タイミング制御', () => {
    it('T+0ms, T+200ms, T+800msで正確にイベントが発火する', async () => {
      vi.mocked(useCircleOfFifthsStore).mockReturnValue({
        selectedKey: { fifthsIndex: 0, isMajor: true },
        setSelectedKey: mockSetSelectedKey,
      } as any);

      mockToJSON.mockReturnValue({ fifthsIndex: 11, isMajor: true });

      const { result } = renderHook(() => useChordProgression());

      act(() => {
        result.current.playFifthProgression();
      });

      // T+0ms: 起点のコードを再生
      expect(mockPlayChordAtPosition).toHaveBeenCalledTimes(1);
      expect(mockStartAnimation).not.toHaveBeenCalled();
      expect(mockSetSelectedKey).not.toHaveBeenCalled();

      // T+199ms: まだアニメーション開始していない
      act(() => {
        vi.advanceTimersByTime(199);
      });
      expect(mockStartAnimation).not.toHaveBeenCalled();

      // T+200ms: アニメーション開始
      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(mockStartAnimation).toHaveBeenCalledTimes(1);
      expect(mockPlayChordAtPosition).toHaveBeenCalledTimes(1);

      // T+799ms: まだ解決先のコードを再生していない
      act(() => {
        vi.advanceTimersByTime(599);
      });
      expect(mockPlayChordAtPosition).toHaveBeenCalledTimes(1);

      // T+800ms: 解決先のコードを再生
      await act(async () => {
        vi.advanceTimersByTime(1);
        await vi.runAllTimersAsync();
      });
      expect(mockPlayChordAtPosition).toHaveBeenCalledTimes(2);
      expect(mockSetSelectedKey).toHaveBeenCalledTimes(1);
    });

    it('複数回連続で実行しても、それぞれ独立してタイマーが動作する', () => {
      vi.mocked(useCircleOfFifthsStore).mockReturnValue({
        selectedKey: { fifthsIndex: 0, isMajor: true },
        setSelectedKey: mockSetSelectedKey,
      } as any);

      const { result } = renderHook(() => useChordProgression());

      act(() => {
        result.current.playFifthProgression();
      });

      act(() => {
        vi.advanceTimersByTime(100);
      });

      act(() => {
        result.current.playFifthProgression();
      });

      // 1回目の実行: T+0msで1回、2回目の実行: T+100msで1回 = 合計2回
      expect(mockPlayChordAtPosition).toHaveBeenCalledTimes(2);

      // 1回目: T+200ms、2回目: T+300ms でアニメーション開始
      act(() => {
        vi.advanceTimersByTime(200);
      });
      expect(mockStartAnimation).toHaveBeenCalledTimes(2);
    });

    it('playChordAtPositionが非同期でも正しく動作する', async () => {
      vi.mocked(useCircleOfFifthsStore).mockReturnValue({
        selectedKey: { fifthsIndex: 0, isMajor: true },
        setSelectedKey: mockSetSelectedKey,
      } as any);

      mockPlayChordAtPosition.mockImplementation(() => {
        return new Promise(resolve => setTimeout(resolve, 50));
      });

      const { result } = renderHook(() => useChordProgression());

      act(() => {
        result.current.playFifthProgression();
        vi.advanceTimersByTime(800);
      });

      // awaitしているので、setSelectedKeyが呼ばれる前にpromiseが解決される必要がある
      await act(async () => {
        vi.advanceTimersByTime(50);
      });

      expect(mockSetSelectedKey).toHaveBeenCalled();
    });
  });

  describe('エッジケース', () => {
    it('selectedKeyがundefinedの場合、何も実行しない', () => {
      vi.mocked(useCircleOfFifthsStore).mockReturnValue({
        selectedKey: undefined as any,
        setSelectedKey: mockSetSelectedKey,
      } as any);

      const { result } = renderHook(() => useChordProgression());

      act(() => {
        result.current.playFifthProgression();
      });

      expect(mockPlayChordAtPosition).not.toHaveBeenCalled();
    });

    it('position=0からの五度進行でラップアラウンドが正しく動作する', () => {
      // position 0 -> -1 -> (position + offset + 12) % 12 = 11
      vi.mocked(useCircleOfFifthsStore).mockReturnValue({
        selectedKey: { fifthsIndex: 0, isMajor: true },
        setSelectedKey: mockSetSelectedKey,
      } as any);

      const { result } = renderHook(() => useChordProgression());

      act(() => {
        result.current.playFifthProgression();
        vi.advanceTimersByTime(800);
      });

      expect(mockStartAnimation).toHaveBeenCalledWith(
        expect.objectContaining({
          from: 0,
          to: 11,
        })
      );
    });

    it('裏コード進行で境界を超える場合も正しく動作する', () => {
      // position 7 + 6 = 13 % 12 = 1
      vi.mocked(useCircleOfFifthsStore).mockReturnValue({
        selectedKey: { fifthsIndex: 7, isMajor: true },
        setSelectedKey: mockSetSelectedKey,
      } as any);

      const { result } = renderHook(() => useChordProgression());

      act(() => {
        result.current.playTritoneSubstitution();
        vi.advanceTimersByTime(800);
      });

      expect(mockStartAnimation).toHaveBeenCalledWith(
        expect.objectContaining({
          from: 7,
          to: 1,
        })
      );
    });

    it.skip('Key.fromCircleOfFifthsが例外を投げた場合、エラーが伝播する', async () => {
      vi.mocked(useCircleOfFifthsStore).mockReturnValue({
        selectedKey: { fifthsIndex: 0, isMajor: true },
        setSelectedKey: mockSetSelectedKey,
      } as any);

      mockFromCircleOfFifths.mockImplementation(() => {
        throw new Error('Invalid fifths index');
      });

      const { result } = renderHook(() => useChordProgression());

      act(() => {
        result.current.playFifthProgression();
        vi.advanceTimersByTime(200);
      });

      // 800msでエラーが発生する
      await expect(async () => {
        await act(async () => {
          vi.advanceTimersByTime(600);
          await vi.runAllTimersAsync();
        });
      }).rejects.toThrow('Invalid fifths index');
    });
  });

  describe('関数安定性とメモ化', () => {
    it('依存が変わらない限り、playFifthProgressionは同じ参照を保つ', () => {
      const { result, rerender } = renderHook(() => useChordProgression());

      const firstRender = result.current.playFifthProgression;

      rerender();

      expect(result.current.playFifthProgression).toBe(firstRender);
    });

    it('setSelectedKeyやstartAnimationが変更されても、useCallbackの依存配列により適切に再生成される', () => {
      const mockSetSelectedKey2 = vi.fn();
      const { result, rerender } = renderHook(() => useChordProgression());

      const firstRender = result.current.playFifthProgression;

      // setSelectedKeyを変更
      vi.mocked(useCircleOfFifthsStore).mockReturnValue({
        selectedKey: { fifthsIndex: 0, isMajor: true },
        setSelectedKey: mockSetSelectedKey2,
      } as any);

      rerender();

      // 依存が変わったので、新しい関数が生成される
      expect(result.current.playFifthProgression).not.toBe(firstRender);
    });
  });
});
