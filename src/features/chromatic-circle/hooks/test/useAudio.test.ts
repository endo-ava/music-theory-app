import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAudio } from '../useAudio';
import { AudioEngine } from '@/domain/services/AudioEngine';
import type { ChromaticSegmentDTO } from '@/domain/services/ChromaticCircle';

// AudioEngineをモック化
vi.mock('@/domain/services/AudioEngine', () => ({
  AudioEngine: {
    play: vi.fn(),
    cleanup: vi.fn(),
  },
}));

describe('useAudio', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // console.errorをモック化
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('playPitchClass', () => {
    test('正常ケース: position 0 (C) のピッチクラスを再生する', async () => {
      const { result } = renderHook(() => useAudio());

      const segment: ChromaticSegmentDTO = {
        position: 0,
        pitchClassName: 'C',
      };

      await act(async () => {
        await result.current.playPitchClass(segment);
      });

      expect(AudioEngine.play).toHaveBeenCalledTimes(1);
      expect(AudioEngine.play).toHaveBeenCalledWith(
        expect.objectContaining({
          _pitchClass: expect.objectContaining({ index: 0 }),
          _octave: 4,
        })
      );
    });

    test('正常ケース: position 1 (C#/D♭) のピッチクラスを再生する', async () => {
      const { result } = renderHook(() => useAudio());

      const segment: ChromaticSegmentDTO = {
        position: 1,
        pitchClassName: 'C#/D♭',
      };

      await act(async () => {
        await result.current.playPitchClass(segment);
      });

      expect(AudioEngine.play).toHaveBeenCalledWith(
        expect.objectContaining({
          _pitchClass: expect.objectContaining({ index: 1 }),
        })
      );
    });

    test('正常ケース: position 7 (G) のピッチクラスを再生する', async () => {
      const { result } = renderHook(() => useAudio());

      const segment: ChromaticSegmentDTO = {
        position: 7,
        pitchClassName: 'G',
      };

      await act(async () => {
        await result.current.playPitchClass(segment);
      });

      expect(AudioEngine.play).toHaveBeenCalledWith(
        expect.objectContaining({
          _pitchClass: expect.objectContaining({ index: 7 }),
        })
      );
    });

    test('正常ケース: position 11 (B) のピッチクラスを再生する', async () => {
      const { result } = renderHook(() => useAudio());

      const segment: ChromaticSegmentDTO = {
        position: 11,
        pitchClassName: 'B',
      };

      await act(async () => {
        await result.current.playPitchClass(segment);
      });

      expect(AudioEngine.play).toHaveBeenCalledWith(
        expect.objectContaining({
          _pitchClass: expect.objectContaining({ index: 11 }),
        })
      );
    });

    test('正常ケース: デフォルトオクターブが4である', async () => {
      const { result } = renderHook(() => useAudio());

      const segment: ChromaticSegmentDTO = {
        position: 5,
        pitchClassName: 'F',
      };

      await act(async () => {
        await result.current.playPitchClass(segment);
      });

      expect(AudioEngine.play).toHaveBeenCalledWith(
        expect.objectContaining({
          _octave: 4,
        })
      );
    });

    test('異常ケース: AudioEngineエラー時にエラーログが出力される', async () => {
      const { result } = renderHook(() => useAudio());
      const testError = new Error('Audio playback failed');

      vi.mocked(AudioEngine.play).mockRejectedValueOnce(testError);

      const segment: ChromaticSegmentDTO = {
        position: 0,
        pitchClassName: 'C',
      };

      await act(async () => {
        await result.current.playPitchClass(segment);
      });

      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('Failed to play pitch class at position 0'),
        testError
      );
    });

    test('異常ケース: 複数のエラーが独立して処理される', async () => {
      const { result } = renderHook(() => useAudio());

      vi.mocked(AudioEngine.play).mockRejectedValue(new Error('Error 1'));

      const segment1: ChromaticSegmentDTO = { position: 0, pitchClassName: 'C' };
      const segment2: ChromaticSegmentDTO = { position: 1, pitchClassName: 'C♯/D♭' };

      await act(async () => {
        await result.current.playPitchClass(segment1);
        await result.current.playPitchClass(segment2);
      });

      expect(console.error).toHaveBeenCalledTimes(2);
    });
  });

  describe('playPitchClassの安定性', () => {
    test('playPitchClassは再レンダリングでも同じ参照を保つ', () => {
      const { result, rerender } = renderHook(() => useAudio());

      const firstPlayPitchClass = result.current.playPitchClass;

      rerender();

      expect(result.current.playPitchClass).toBe(firstPlayPitchClass);
    });
  });

  describe('クリーンアップ処理', () => {
    test('アンマウント時にAudioEngine.cleanupが呼ばれる', () => {
      const { unmount } = renderHook(() => useAudio());

      unmount();

      expect(AudioEngine.cleanup).toHaveBeenCalledTimes(1);
    });

    test('複数回アンマウントしても正しく動作する', () => {
      const { unmount: unmount1 } = renderHook(() => useAudio());
      const { unmount: unmount2 } = renderHook(() => useAudio());

      unmount1();
      unmount2();

      expect(AudioEngine.cleanup).toHaveBeenCalledTimes(2);
    });
  });

  describe('境界値ケース', () => {
    test('position 0 でエラーが発生しない', async () => {
      const { result } = renderHook(() => useAudio());

      const segment: ChromaticSegmentDTO = { position: 0, pitchClassName: 'C' };

      await expect(
        act(async () => {
          await result.current.playPitchClass(segment);
        })
      ).resolves.not.toThrow();
    });

    test('position 11 でエラーが発生しない', async () => {
      const { result } = renderHook(() => useAudio());

      const segment: ChromaticSegmentDTO = { position: 11, pitchClassName: 'B' };

      await expect(
        act(async () => {
          await result.current.playPitchClass(segment);
        })
      ).resolves.not.toThrow();
    });
  });
});
