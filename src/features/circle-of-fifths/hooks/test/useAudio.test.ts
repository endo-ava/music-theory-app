/**
 * useAudio カスタムフックのユニットテスト
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAudio } from '../useAudio';
import type { FifthsIndex } from '@/domain';

// ドメインサービスのモック
vi.mock('@/domain', () => {
  const mockChord = {
    name: 'C',
    type: 'major',
    toneNotations: ['C4', 'E4', 'G4'],
  };

  const mockChordBuilder = {
    buildMajorTriadFromPosition: vi.fn().mockReturnValue(mockChord),
    buildMinorTriadFromPosition: vi
      .fn()
      .mockReturnValue({ ...mockChord, name: 'Cm', type: 'minor' }),
  };

  return {
    ChordBuilder: vi.fn().mockImplementation(() => mockChordBuilder),
    AudioEngine: {
      playChord: vi.fn().mockResolvedValue(undefined),
      setVolume: vi.fn(),
      setArpeggioSpeed: vi.fn(),
    },
    FifthsIndex: {},
  };
});

describe('useAudio', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockDomain: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    mockDomain = await vi.importMock('@/domain');
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
      const { result } = renderHook(() => useAudio());
      const fifthsIndex: FifthsIndex = 0; // C major

      await act(async () => {
        await result.current.playMajorChordAtPosition(fifthsIndex);
      });

      // ChordBuilderがメジャートライアドを構築
      expect(mockDomain.ChordBuilder).toHaveBeenCalled();
      const chordBuilderInstance = mockDomain.ChordBuilder.mock.results[0].value;
      expect(chordBuilderInstance.buildMajorTriadFromPosition).toHaveBeenCalledWith(0);

      // AudioEngineで和音を再生
      expect(mockDomain.AudioEngine.playChord).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'C',
          type: 'major',
        })
      );
    });

    it('正常ケース: 異なる五度圏ポジションでの再生', async () => {
      const { result } = renderHook(() => useAudio());
      const testPositions: FifthsIndex[] = [0, 1, 2, 3, 4, 5];

      for (const position of testPositions) {
        await act(async () => {
          await result.current.playMajorChordAtPosition(position);
        });
      }

      const chordBuilderInstance = mockDomain.ChordBuilder.mock.results[0].value;

      // 各ポジションでbuildMajorTriadFromPositionが呼ばれる
      testPositions.forEach((position, index) => {
        expect(chordBuilderInstance.buildMajorTriadFromPosition).toHaveBeenNthCalledWith(
          index + 1,
          position
        );
      });

      // 各回でAudioEngine.playChordが呼ばれる
      expect(mockDomain.AudioEngine.playChord).toHaveBeenCalledTimes(testPositions.length);
    });

    it('異常ケース: 和音構築でエラーが発生した場合のハンドリング', async () => {
      const { result } = renderHook(() => useAudio());
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // ChordBuilderがエラーをスロー
      const chordBuilderInstance = mockDomain.ChordBuilder.mock.results[0].value;
      chordBuilderInstance.buildMajorTriadFromPosition.mockImplementationOnce(() => {
        throw new Error('Chord building failed');
      });

      await act(async () => {
        await result.current.playMajorChordAtPosition(0);
      });

      // エラーがログに出力される
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to play chord:', expect.any(Error));

      // AudioEngine.playChordは呼ばれない
      expect(mockDomain.AudioEngine.playChord).not.toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it('異常ケース: 音響再生でエラーが発生した場合のハンドリング', async () => {
      const { result } = renderHook(() => useAudio());
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // AudioEngine.playChordがエラーをスロー
      mockDomain.AudioEngine.playChord.mockRejectedValueOnce(new Error('Audio playback failed'));

      await act(async () => {
        await result.current.playMajorChordAtPosition(0);
      });

      // エラーがログに出力される
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to play chord:', expect.any(Error));

      consoleErrorSpy.mockRestore();
    });
  });

  describe('playMinorChordAtPosition', () => {
    it('正常ケース: 五度圏ポジションからマイナーコードを再生', async () => {
      const { result } = renderHook(() => useAudio());
      const fifthsIndex: FifthsIndex = 3; // A minor

      await act(async () => {
        await result.current.playMinorChordAtPosition(fifthsIndex);
      });

      // ChordBuilderがマイナートライアドを構築
      const chordBuilderInstance = mockDomain.ChordBuilder.mock.results[0].value;
      expect(chordBuilderInstance.buildMinorTriadFromPosition).toHaveBeenCalledWith(3);

      // AudioEngineで和音を再生
      expect(mockDomain.AudioEngine.playChord).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Cm',
          type: 'minor',
        })
      );
    });

    it('正常ケース: 複数のマイナーコード再生', async () => {
      const { result } = renderHook(() => useAudio());
      const testPositions: FifthsIndex[] = [3, 4, 5]; // Am, Em, Bm

      for (const position of testPositions) {
        await act(async () => {
          await result.current.playMinorChordAtPosition(position);
        });
      }

      const chordBuilderInstance = mockDomain.ChordBuilder.mock.results[0].value;

      // 各ポジションでbuildMinorTriadFromPositionが呼ばれる
      testPositions.forEach((position, index) => {
        expect(chordBuilderInstance.buildMinorTriadFromPosition).toHaveBeenNthCalledWith(
          index + 1,
          position
        );
      });
    });

    it('異常ケース: マイナーコード再生時のエラーハンドリング', async () => {
      const { result } = renderHook(() => useAudio());
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // AudioEngine.playChordがエラーをスロー
      mockDomain.AudioEngine.playChord.mockRejectedValueOnce(new Error('Audio error'));

      await act(async () => {
        await result.current.playMinorChordAtPosition(3);
      });

      // エラーがログに出力される
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to play chord:', expect.any(Error));

      consoleErrorSpy.mockRestore();
    });
  });

  describe('setVolume', () => {
    it('正常ケース: 音量設定がAudioEngineに伝達される', () => {
      const { result } = renderHook(() => useAudio());

      act(() => {
        result.current.setVolume(-5);
      });

      expect(mockDomain.AudioEngine.setVolume).toHaveBeenCalledWith(-5);
    });

    it('正常ケース: 複数回の音量設定', () => {
      const { result } = renderHook(() => useAudio());
      const volumes = [-10, -5, 0, 5];

      volumes.forEach(volume => {
        act(() => {
          result.current.setVolume(volume);
        });
      });

      volumes.forEach((volume, index) => {
        expect(mockDomain.AudioEngine.setVolume).toHaveBeenNthCalledWith(index + 1, volume);
      });
    });

    it('正常ケース: setVolume関数の参照安定性', () => {
      const { result, rerender } = renderHook(() => useAudio());

      const firstSetVolume = result.current.setVolume;
      rerender();
      const secondSetVolume = result.current.setVolume;

      expect(firstSetVolume).toBe(secondSetVolume);
    });
  });

  describe('setArpeggioSpeed', () => {
    it('正常ケース: アルペジオ速度設定がAudioEngineに伝達される', () => {
      const { result } = renderHook(() => useAudio());

      act(() => {
        result.current.setArpeggioSpeed(150);
      });

      expect(mockDomain.AudioEngine.setArpeggioSpeed).toHaveBeenCalledWith(150);
    });

    it('正常ケース: 複数回のアルペジオ速度設定', () => {
      const { result } = renderHook(() => useAudio());
      const speeds = [50, 100, 200, 300];

      speeds.forEach(speed => {
        act(() => {
          result.current.setArpeggioSpeed(speed);
        });
      });

      speeds.forEach((speed, index) => {
        expect(mockDomain.AudioEngine.setArpeggioSpeed).toHaveBeenNthCalledWith(index + 1, speed);
      });
    });

    it('正常ケース: setArpeggioSpeed関数の参照安定性', () => {
      const { result, rerender } = renderHook(() => useAudio());

      const firstSetArpeggioSpeed = result.current.setArpeggioSpeed;
      rerender();
      const secondSetArpeggioSpeed = result.current.setArpeggioSpeed;

      expect(firstSetArpeggioSpeed).toBe(secondSetArpeggioSpeed);
    });
  });

  describe('統合テスト', () => {
    it('正常ケース: 設定変更と和音再生の組み合わせ', async () => {
      const { result } = renderHook(() => useAudio());

      // 設定を変更
      act(() => {
        result.current.setVolume(-8);
        result.current.setArpeggioSpeed(120);
      });

      // 和音を再生
      await act(async () => {
        await result.current.playMajorChordAtPosition(0);
        await result.current.playMinorChordAtPosition(3);
      });

      // 設定が正しく伝達される
      expect(mockDomain.AudioEngine.setVolume).toHaveBeenCalledWith(-8);
      expect(mockDomain.AudioEngine.setArpeggioSpeed).toHaveBeenCalledWith(120);

      // 和音が正しく再生される
      expect(mockDomain.AudioEngine.playChord).toHaveBeenCalledTimes(2);
    });

    it('正常ケース: ChordBuilderインスタンスの再利用', async () => {
      const { result } = renderHook(() => useAudio());

      // 複数回の和音再生
      await act(async () => {
        await result.current.playMajorChordAtPosition(0);
        await result.current.playMinorChordAtPosition(1);
        await result.current.playMajorChordAtPosition(2);
      });

      // ChordBuilderは1回だけインスタンス化される
      expect(mockDomain.ChordBuilder).toHaveBeenCalledTimes(1);

      // 同じインスタンスで複数のメソッドが呼ばれる
      const chordBuilderInstance = mockDomain.ChordBuilder.mock.results[0].value;
      expect(chordBuilderInstance.buildMajorTriadFromPosition).toHaveBeenCalledTimes(2);
      expect(chordBuilderInstance.buildMinorTriadFromPosition).toHaveBeenCalledTimes(1);
    });

    it('正常ケース: エラー発生後の正常動作復旧', async () => {
      const { result } = renderHook(() => useAudio());
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // 1回目はエラー
      mockDomain.AudioEngine.playChord.mockRejectedValueOnce(new Error('Temporary error'));

      await act(async () => {
        await result.current.playMajorChordAtPosition(0);
      });

      // エラーが発生
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);

      // 2回目は正常動作
      mockDomain.AudioEngine.playChord.mockResolvedValueOnce(undefined);

      await act(async () => {
        await result.current.playMajorChordAtPosition(1);
      });

      // 正常に再生される
      expect(mockDomain.AudioEngine.playChord).toHaveBeenCalledTimes(2);

      consoleErrorSpy.mockRestore();
    });
  });

  describe('型安全性', () => {
    it('正常ケース: FifthsIndex型の使用', async () => {
      const { result } = renderHook(() => useAudio());
      const validIndices: FifthsIndex[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

      for (const index of validIndices) {
        await act(async () => {
          await result.current.playMajorChordAtPosition(index);
          await result.current.playMinorChordAtPosition(index);
        });
      }

      // 全ての有効なインデックスで正常動作
      const chordBuilderInstance = mockDomain.ChordBuilder.mock.results[0].value;
      expect(chordBuilderInstance.buildMajorTriadFromPosition).toHaveBeenCalledTimes(
        validIndices.length
      );
      expect(chordBuilderInstance.buildMinorTriadFromPosition).toHaveBeenCalledTimes(
        validIndices.length
      );
    });

    it('正常ケース: 数値型パラメータの型安全性', () => {
      const { result } = renderHook(() => useAudio());

      // TypeScriptの型チェックが通ることを確認
      expect(() => {
        act(() => {
          result.current.setVolume(-10);
          result.current.setArpeggioSpeed(100);
        });
      }).not.toThrow();

      expect(mockDomain.AudioEngine.setVolume).toHaveBeenCalledWith(-10);
      expect(mockDomain.AudioEngine.setArpeggioSpeed).toHaveBeenCalledWith(100);
    });
  });
});
