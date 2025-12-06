/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useChordProgression } from '../useChordProgression';

// モック
vi.mock('@/stores/circleOfFifthsStore');
vi.mock('@/stores/animationStore');
vi.mock('@/features/circle-of-fifths/hooks/useAudio');
// Keyクラスはモックせず、実際のドメインロジックを使用する

// モックインポート
import { useCircleOfFifthsStore } from '@/stores/circleOfFifthsStore';
import { useAnimationStore } from '@/stores/animationStore';
import { useAudio } from '@/features/circle-of-fifths/hooks/useAudio';

describe('useChordProgression', () => {
  // モック関数
  const mockSetSelectedKey = vi.fn();
  const mockStartAnimation = vi.fn();
  const mockPlayChordAtPosition = vi.fn();

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
  });

  describe('五度進行（メジャーキー）', () => {
    it('Cメジャーキー（fifthsIndex=0）で五度進行を実行すると、Fメジャー（fifthsIndex=11）に進む', async () => {
      // C Major (0) -> Subdominant Key -> F Major (11)
      vi.mocked(useCircleOfFifthsStore).mockReturnValue({
        selectedKey: { fifthsIndex: 0, isMajor: true },
        setSelectedKey: mockSetSelectedKey,
      } as any);

      const { result } = renderHook(() => useChordProgression());

      act(() => {
        result.current.playFifthProgression();
      });

      // T+0ms: 起点のコードを再生 (C Major -> pos 0)
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
      // 解決先: F Major -> pos 11
      expect(mockPlayChordAtPosition).toHaveBeenCalledWith(11, true);
      expect(mockSetSelectedKey).toHaveBeenCalledWith(
        expect.objectContaining({ fifthsIndex: 11, isMajor: true })
      );
    });

    it('Gメジャーキー（fifthsIndex=1）で五度進行を実行すると、Cメジャー（fifthsIndex=0）に進む', async () => {
      // G Major (1) -> Subdominant Key -> C Major (0)
      vi.mocked(useCircleOfFifthsStore).mockReturnValue({
        selectedKey: { fifthsIndex: 1, isMajor: true },
        setSelectedKey: mockSetSelectedKey,
      } as any);

      const { result } = renderHook(() => useChordProgression());

      await act(async () => {
        result.current.playFifthProgression();
        vi.advanceTimersByTime(800);
        await vi.runAllTimersAsync();
      });

      expect(mockStartAnimation).toHaveBeenCalledWith(
        expect.objectContaining({
          from: 1,
          to: 0,
        })
      );
      expect(mockSetSelectedKey).toHaveBeenCalledWith(
        expect.objectContaining({ fifthsIndex: 0, isMajor: true })
      );
    });
  });

  describe('五度進行（マイナーキー）', () => {
    it('Aマイナーキー（fifthsIndex=3）で五度進行を実行すると、Dマイナー（fifthsIndex=2）に進む', async () => {
      // A Minor: fifthsIndex=3 (A)
      // 平行調メジャー: C Major (0) -> 視覚位置 0
      // Subdominant Key: D Minor (A -> D)
      // D Minor: fifthsIndex=2 (D)
      // D Minorの平行調メジャー: F Major (11) -> 視覚位置 11

      vi.mocked(useCircleOfFifthsStore).mockReturnValue({
        selectedKey: { fifthsIndex: 3, isMajor: false }, // Am
        setSelectedKey: mockSetSelectedKey,
      } as any);

      const { result } = renderHook(() => useChordProgression());

      await act(async () => {
        result.current.playFifthProgression();
        vi.advanceTimersByTime(800);
        await vi.runAllTimersAsync();
      });

      // アニメーション: 0 -> 11 (C -> F の位置)
      expect(mockStartAnimation).toHaveBeenCalledWith({
        type: 'fifth',
        from: 0,
        to: 11,
        isMajor: false,
        duration: 2000,
      });

      // 解決先: D Minor (fifthsIndex=2)
      expect(mockSetSelectedKey).toHaveBeenCalledWith(
        expect.objectContaining({ fifthsIndex: 2, isMajor: false })
      );
    });

    it('Eマイナーキー（fifthsIndex=4）で五度進行を実行すると、Aマイナー（fifthsIndex=3）に進む', async () => {
      // E Minor: fifthsIndex=4 (E)
      // 平行調メジャー: G Major (1) -> 視覚位置 1
      // Subdominant Key: A Minor (E -> A)
      // A Minor: fifthsIndex=3 (A)
      // A Minorの平行調メジャー: C Major (0) -> 視覚位置 0

      vi.mocked(useCircleOfFifthsStore).mockReturnValue({
        selectedKey: { fifthsIndex: 4, isMajor: false }, // Em
        setSelectedKey: mockSetSelectedKey,
      } as any);

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
    });
  });

  describe('裏コード進行', () => {
    it('Cメジャーキー（fifthsIndex=0）で裏コードを実行すると、F#メジャー（fifthsIndex=6）に進む', async () => {
      // C Major (0) -> Tritone -> F# Major (6)
      vi.mocked(useCircleOfFifthsStore).mockReturnValue({
        selectedKey: { fifthsIndex: 0, isMajor: true },
        setSelectedKey: mockSetSelectedKey,
      } as any);

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

      expect(mockSetSelectedKey).toHaveBeenCalledWith(
        expect.objectContaining({ fifthsIndex: 6, isMajor: true })
      );
    });

    it('マイナーキーでも裏コード進行が正しく動作する', async () => {
      // A Minor (3) -> Tritone -> Eb Minor (9)
      // Am視覚位置: 0 (C)
      // Ebm (Eb=9) の平行調メジャー: Gb (6) -> 視覚位置 6

      vi.mocked(useCircleOfFifthsStore).mockReturnValue({
        selectedKey: { fifthsIndex: 3, isMajor: false }, // Am
        setSelectedKey: mockSetSelectedKey,
      } as any);

      const { result } = renderHook(() => useChordProgression());

      await act(async () => {
        result.current.playTritoneSubstitution();
        vi.advanceTimersByTime(800);
        await vi.runAllTimersAsync();
      });

      expect(mockStartAnimation).toHaveBeenCalledWith({
        type: 'tritone',
        from: 0, // Cの位置
        to: 6, // Gb/F#の位置
        isMajor: false,
        duration: 2000,
      });

      expect(mockSetSelectedKey).toHaveBeenCalledWith(
        expect.objectContaining({ fifthsIndex: 9, isMajor: false })
      );
    });
  });
});
