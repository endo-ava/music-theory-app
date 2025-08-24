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
      major: vi.fn().mockReturnValue({
        toneNotations: ['C4', 'E4', 'G4'],
      }),
      minor: vi.fn().mockReturnValue({
        toneNotations: ['C4', 'Eb4', 'G4'],
      }),
    },
  };
});

vi.mock('@/domain', () => ({
  AudioEngine: {
    play: vi.fn().mockResolvedValue(undefined),
    setVolume: vi.fn(),
    setArpeggioSpeed: vi.fn(),
  },
  PitchClass: {
    fromCircleOfFifths: vi.fn().mockReturnValue({
      index: 0,
    }),
  },
  Note: vi.fn().mockImplementation((pitchClass, octave) => ({
    pitchClass,
    octave,
  })),
  Chord: {
    major: vi.fn().mockReturnValue({
      toneNotations: ['C4', 'E4', 'G4'],
    }),
    minor: vi.fn().mockReturnValue({
      toneNotations: ['C4', 'Eb4', 'G4'],
    }),
  },
  Interval: {
    MinorThird: {
      semitones: 3,
    },
  },
  Scale: vi.fn(),
  ScalePattern: vi.fn(),
}));

describe('useAudio', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('基本機能', () => {
    it('正常ケース: フックが正しい関数群を返す', () => {
      const { result } = renderHook(() => useAudio());

      expect(result.current).toHaveProperty('playChordAtPosition');
      expect(result.current).toHaveProperty('playScaleAtPosition');
      expect(result.current).toHaveProperty('setVolume');
      expect(result.current).toHaveProperty('setArpeggioSpeed');

      expect(typeof result.current.playChordAtPosition).toBe('function');
      expect(typeof result.current.playScaleAtPosition).toBe('function');
      expect(typeof result.current.setVolume).toBe('function');
      expect(typeof result.current.setArpeggioSpeed).toBe('function');
    });

    it('正常ケース: 複数回レンダリングでも安定したインスタンスを返す', () => {
      const { result, rerender } = renderHook(() => useAudio());

      const firstRender = result.current;
      rerender();
      const secondRender = result.current;

      // 関数の参照が安定している（useCallbackが効いている）
      expect(firstRender.playChordAtPosition).toBe(secondRender.playChordAtPosition);
      expect(firstRender.playScaleAtPosition).toBe(secondRender.playScaleAtPosition);
      expect(firstRender.setVolume).toBe(secondRender.setVolume);
      expect(firstRender.setArpeggioSpeed).toBe(secondRender.setArpeggioSpeed);
    });
  });

  describe('playChordAtPosition', () => {
    it('正常ケース: 五度圏ポジションからメジャーコードを再生', async () => {
      const { AudioEngine } = await import('@/domain');
      const { result } = renderHook(() => useAudio());

      await act(async () => {
        await result.current.playChordAtPosition(0, true);
      });

      expect(AudioEngine.play).toHaveBeenCalledTimes(1);
    });

    it('正常ケース: 五度圏ポジションからマイナーコードを再生', async () => {
      const { AudioEngine } = await import('@/domain');
      const { result } = renderHook(() => useAudio());

      await act(async () => {
        await result.current.playChordAtPosition(0, false);
      });

      expect(AudioEngine.play).toHaveBeenCalledTimes(1);
    });

    it('正常ケース: 異なる五度圏ポジションでの再生', async () => {
      const { AudioEngine } = await import('@/domain');
      const { result } = renderHook(() => useAudio());

      const positions = [0, 1, 2];

      for (const position of positions) {
        await act(async () => {
          await result.current.playChordAtPosition(position, true);
        });
      }

      expect(AudioEngine.play).toHaveBeenCalledTimes(positions.length);
    });

    it('異常ケース: コード生成でエラーが発生した場合のハンドリング', async () => {
      const { Chord } = await import('@/domain');
      const { result } = renderHook(() => useAudio());
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // Chord.majorがエラーをスロー
      vi.mocked(Chord.major).mockImplementationOnce(() => {
        throw new Error('Chord creation failed');
      });

      await act(async () => {
        await result.current.playChordAtPosition(0, true);
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to play chord at position 0, isMajor:true:',
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });

    it('異常ケース: 音響再生でエラーが発生した場合のハンドリング', async () => {
      const { AudioEngine } = await import('@/domain');
      const { result } = renderHook(() => useAudio());
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // AudioEngine.playがエラーをスロー
      vi.mocked(AudioEngine.play).mockRejectedValueOnce(new Error('Audio playback failed'));

      await act(async () => {
        await result.current.playChordAtPosition(0, true);
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to play chord at position 0, isMajor:true:',
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
        await result.current.playChordAtPosition(1, true);
        await result.current.playChordAtPosition(2, false);
      });

      // 設定が正しく反映され、音楽が再生される
      expect(AudioEngine.setVolume).toHaveBeenCalledWith(-3);
      expect(AudioEngine.setArpeggioSpeed).toHaveBeenCalledWith(150);
      expect(AudioEngine.play).toHaveBeenCalledTimes(2);
    });
  });
});
