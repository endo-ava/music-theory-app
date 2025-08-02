/**
 * useAudio カスタムフックのユニットテスト
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAudio } from '../useAudio';

// ドメインサービスのモック
vi.mock('@/domain/chord', () => {
  const mockChord = {
    name: 'C',
    rootNote: { toString: 'C4' },
    constituentNotes: [{ toString: 'C4' }, { toString: 'E4' }, { toString: 'G4' }],
    toneNotations: ['C4', 'E4', 'G4'],
  };

  return {
    Chord: {
      fromCircleOfFifths: vi.fn().mockReturnValue(mockChord),
      relativeMinorFromCircleOfFifths: vi.fn().mockReturnValue({
        ...mockChord,
        name: 'Am',
        rootNote: { toString: 'A4' },
        toneNotations: ['A4', 'C4', 'E4'],
      }),
    },
  };
});

vi.mock('@/domain', () => ({
  AudioEngine: {
    playChord: vi.fn().mockResolvedValue(undefined),
    setVolume: vi.fn(),
    setArpeggioSpeed: vi.fn(),
  },
}));

describe('useAudio', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('基本機能', () => {
    it('正常ケース: フックが正しい関数群を返す', () => {
      const { result } = renderHook(() => useAudio());

      expect(result.current).toHaveProperty('playMajorChordAtPosition');
      expect(result.current).toHaveProperty('playMinorChordAtPosition');
      expect(result.current).toHaveProperty('setVolume');
      expect(result.current).toHaveProperty('setArpeggioSpeed');

      expect(typeof result.current.playMajorChordAtPosition).toBe('function');
      expect(typeof result.current.playMinorChordAtPosition).toBe('function');
      expect(typeof result.current.setVolume).toBe('function');
      expect(typeof result.current.setArpeggioSpeed).toBe('function');
    });

    it('正常ケース: 複数回レンダリングでも安定したインスタンスを返す', () => {
      const { result, rerender } = renderHook(() => useAudio());

      const firstRender = result.current;
      rerender();
      const secondRender = result.current;

      // 関数の参照が安定している（useCallbackが効いている）
      expect(firstRender.playMajorChordAtPosition).toBe(secondRender.playMajorChordAtPosition);
      expect(firstRender.playMinorChordAtPosition).toBe(secondRender.playMinorChordAtPosition);
      expect(firstRender.setVolume).toBe(secondRender.setVolume);
      expect(firstRender.setArpeggioSpeed).toBe(secondRender.setArpeggioSpeed);
    });
  });

  describe('playMajorChordAtPosition', () => {
    it('正常ケース: 五度圏ポジションからメジャーコードを再生', async () => {
      const { Chord } = await import('@/domain/chord');
      const { AudioEngine } = await import('@/domain');
      const { result } = renderHook(() => useAudio());

      await act(async () => {
        await result.current.playMajorChordAtPosition(0);
      });

      expect(Chord.fromCircleOfFifths).toHaveBeenCalledWith(0);
      expect(AudioEngine.playChord).toHaveBeenCalledTimes(1);
    });

    it('正常ケース: 異なる五度圏ポジションでの再生', async () => {
      const { Chord } = await import('@/domain/chord');
      const { AudioEngine } = await import('@/domain');
      const { result } = renderHook(() => useAudio());

      const positions = [0, 1, 2];

      for (const position of positions) {
        await act(async () => {
          await result.current.playMajorChordAtPosition(position);
        });
      }

      // 各ポジションでfromCircleOfFifthsが呼ばれる
      positions.forEach(position => {
        expect(Chord.fromCircleOfFifths).toHaveBeenCalledWith(position);
      });

      expect(AudioEngine.playChord).toHaveBeenCalledTimes(positions.length);
    });

    it('異常ケース: コード生成でエラーが発生した場合のハンドリング', async () => {
      const { Chord } = await import('@/domain/chord');
      const { result } = renderHook(() => useAudio());
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // Chord.fromCircleOfFifthsがエラーをスロー
      vi.mocked(Chord.fromCircleOfFifths).mockImplementationOnce(() => {
        throw new Error('Chord creation failed');
      });

      await act(async () => {
        await result.current.playMajorChordAtPosition(0);
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to play major chord at position 0:',
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });

    it('異常ケース: 音響再生でエラーが発生した場合のハンドリング', async () => {
      const { AudioEngine } = await import('@/domain');
      const { result } = renderHook(() => useAudio());
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // AudioEngine.playChordがエラーをスロー
      vi.mocked(AudioEngine.playChord).mockRejectedValueOnce(new Error('Audio playback failed'));

      await act(async () => {
        await result.current.playMajorChordAtPosition(0);
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to play major chord at position 0:',
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe('playMinorChordAtPosition', () => {
    it('正常ケース: 五度圏ポジションからマイナーコードを再生', async () => {
      const { Chord } = await import('@/domain/chord');
      const { AudioEngine } = await import('@/domain');
      const { result } = renderHook(() => useAudio());

      await act(async () => {
        await result.current.playMinorChordAtPosition(0);
      });

      expect(Chord.relativeMinorFromCircleOfFifths).toHaveBeenCalledWith(0);
      expect(AudioEngine.playChord).toHaveBeenCalledTimes(1);
    });

    it('正常ケース: 複数のマイナーコード再生', async () => {
      const { Chord } = await import('@/domain/chord');
      const { AudioEngine } = await import('@/domain');
      const { result } = renderHook(() => useAudio());

      const positions = [0, 3, 7];

      for (const position of positions) {
        await act(async () => {
          await result.current.playMinorChordAtPosition(position);
        });
      }

      // 各ポジションでrelativeMinorFromCircleOfFifthsが呼ばれる
      positions.forEach(position => {
        expect(Chord.relativeMinorFromCircleOfFifths).toHaveBeenCalledWith(position);
      });

      expect(AudioEngine.playChord).toHaveBeenCalledTimes(positions.length);
    });

    it('異常ケース: マイナーコード再生時のエラーハンドリング', async () => {
      const { AudioEngine } = await import('@/domain');
      const { result } = renderHook(() => useAudio());
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // AudioEngine.playChordがエラーをスロー
      vi.mocked(AudioEngine.playChord).mockRejectedValueOnce(new Error('Audio playback failed'));

      await act(async () => {
        await result.current.playMinorChordAtPosition(0);
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to play minor chord at position 0:',
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe('setVolume', () => {
    it('正常ケース: 音量設定がAudioEngineに伝達される', async () => {
      const { AudioEngine } = await import('@/domain');
      const { result } = renderHook(() => useAudio());

      act(() => {
        result.current.setVolume(-5);
      });

      expect(AudioEngine.setVolume).toHaveBeenCalledWith(-5);
    });

    it('正常ケース: 複数回の音量設定', async () => {
      const { AudioEngine } = await import('@/domain');
      const { result } = renderHook(() => useAudio());

      const volumes = [-10, -5, 0];

      volumes.forEach(volume => {
        act(() => {
          result.current.setVolume(volume);
        });
      });

      volumes.forEach((volume, index) => {
        expect(AudioEngine.setVolume).toHaveBeenNthCalledWith(index + 1, volume);
      });
    });
  });

  describe('setArpeggioSpeed', () => {
    it('正常ケース: アルペジオ速度設定がAudioEngineに伝達される', async () => {
      const { AudioEngine } = await import('@/domain');
      const { result } = renderHook(() => useAudio());

      act(() => {
        result.current.setArpeggioSpeed(100);
      });

      expect(AudioEngine.setArpeggioSpeed).toHaveBeenCalledWith(100);
    });

    it('正常ケース: 複数回のアルペジオ速度設定', async () => {
      const { AudioEngine } = await import('@/domain');
      const { result } = renderHook(() => useAudio());

      const speeds = [50, 100, 200];

      speeds.forEach(speed => {
        act(() => {
          result.current.setArpeggioSpeed(speed);
        });
      });

      speeds.forEach((speed, index) => {
        expect(AudioEngine.setArpeggioSpeed).toHaveBeenNthCalledWith(index + 1, speed);
      });
    });
  });

  describe('統合テスト', () => {
    it('正常ケース: 設定変更と和音再生の組み合わせ', async () => {
      const { AudioEngine } = await import('@/domain');
      const { result } = renderHook(() => useAudio());

      // 音量とアルペジオ速度を設定
      act(() => {
        result.current.setVolume(-3);
        result.current.setArpeggioSpeed(150);
      });

      // コードを再生
      await act(async () => {
        await result.current.playMajorChordAtPosition(1);
        await result.current.playMinorChordAtPosition(2);
      });

      // 設定が正しく反映され、音楽が再生される
      expect(AudioEngine.setVolume).toHaveBeenCalledWith(-3);
      expect(AudioEngine.setArpeggioSpeed).toHaveBeenCalledWith(150);
      expect(AudioEngine.playChord).toHaveBeenCalledTimes(2);
    });
  });
});
