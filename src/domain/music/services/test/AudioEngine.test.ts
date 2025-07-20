/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * AudioEngine音響エンジンのユニットテスト（モック化）
 */

import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from 'vitest';
import { AudioEngine } from '../AudioEngine';
import { Chord } from '../../entities/Chord';
import { Note } from '../../value-objects/Note';

// Tone.jsの基本的なモック
vi.mock('tone', () => ({
  start: vi.fn().mockResolvedValue(undefined),
  getContext: vi.fn().mockReturnValue({ state: 'running' }),
  Sampler: vi.fn().mockImplementation(config => {
    // onloadコールバックがある場合は即座に実行
    if (config && config.onload) {
      setTimeout(() => config.onload(), 0);
    }
    return {
      triggerAttackRelease: vi.fn(),
      volume: { value: -10 },
      toDestination: vi.fn().mockReturnThis(),
    };
  }),
}));

describe('AudioEngine', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.clearAllTimers();

    // AudioEngineの内部状態をリセット
    (AudioEngine as any).sampler = null;
    AudioEngine.config = {
      volume: -10,
      arpeggioDelay: 100,
      release: 1.5,
    };
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('setVolume', () => {
    it('正常ケース: 音量設定がconfigに反映される', () => {
      AudioEngine.setVolume(-5);
      expect(AudioEngine.config.volume).toBe(-5);
    });

    it('境界値ケース: 極端な音量値', () => {
      const testCases = [-50, 0, 10];

      testCases.forEach(volume => {
        AudioEngine.setVolume(volume);
        expect(AudioEngine.config.volume).toBe(volume);
      });
    });
  });

  describe('setArpeggioSpeed', () => {
    it('正常ケース: 有効範囲内の速度設定', () => {
      const testCases = [50, 100, 200, 300, 500];

      testCases.forEach(speed => {
        AudioEngine.setArpeggioSpeed(speed);
        expect(AudioEngine.config.arpeggioDelay).toBe(speed);
      });
    });

    it('境界値ケース: 最小値以下の場合は50msに制限', () => {
      const testCases = [0, 10, 49];

      testCases.forEach(speed => {
        AudioEngine.setArpeggioSpeed(speed);
        expect(AudioEngine.config.arpeggioDelay).toBe(50);
      });
    });

    it('境界値ケース: 最大値以上の場合は500msに制限', () => {
      const testCases = [501, 1000, 2000];

      testCases.forEach(speed => {
        AudioEngine.setArpeggioSpeed(speed);
        expect(AudioEngine.config.arpeggioDelay).toBe(500);
      });
    });
  });

  describe('playChord', () => {
    it('正常ケース: 和音再生インターフェースのテスト', async () => {
      const chord = Chord.major(new Note('C', 4));

      // エラーなく実行されることを確認
      await expect(AudioEngine.playChord(chord)).resolves.toBeUndefined();
    });

    it('正常ケース: 異なる和音での再生', async () => {
      const testCases = [
        Chord.major(new Note('C', 4)),
        Chord.minor(new Note('A', 4)),
        Chord.major7(new Note('F', 4)),
        Chord.dominant7(new Note('G', 4)),
      ];

      for (const chord of testCases) {
        await expect(AudioEngine.playChord(chord)).resolves.toBeUndefined();
      }
    });

    it('正常ケース: 複数回の連続再生', async () => {
      const chord = Chord.major(new Note('C', 4));

      // 複数回実行してもエラーが発生しない
      await AudioEngine.playChord(chord);
      await AudioEngine.playChord(chord);
      await AudioEngine.playChord(chord);
    });
  });

  describe('config初期値', () => {
    it('正常ケース: デフォルト設定値の確認', () => {
      expect(AudioEngine.config.volume).toBe(-10);
      expect(AudioEngine.config.arpeggioDelay).toBe(100);
      expect(AudioEngine.config.release).toBe(1.5);
    });
  });

  describe('設定の統合テスト', () => {
    it('正常ケース: 設定変更後の和音再生', async () => {
      // 設定を変更
      AudioEngine.setVolume(-15);
      AudioEngine.setArpeggioSpeed(200);

      // 変更された設定の確認
      expect(AudioEngine.config.volume).toBe(-15);
      expect(AudioEngine.config.arpeggioDelay).toBe(200);

      // 新しい設定で和音を再生
      const chord = Chord.major(new Note('G', 4));
      await expect(AudioEngine.playChord(chord)).resolves.toBeUndefined();
    });

    it('正常ケース: 設定のリセット動作', () => {
      // 設定を変更
      AudioEngine.setVolume(-25);
      AudioEngine.setArpeggioSpeed(50);

      // テストのbeforeEachでリセットされることを想定
      expect(AudioEngine.config.volume).toBe(-25);
      expect(AudioEngine.config.arpeggioDelay).toBe(50);
    });
  });

  describe('型安全性の検証', () => {
    it('正常ケース: Chordエンティティとの統合', async () => {
      const chords = [
        Chord.major(new Note('C', 4)),
        Chord.minor(new Note('D', 4)),
        Chord.major7(new Note('E', 4)),
        Chord.minor7(new Note('F', 4)),
        Chord.dominant7(new Note('G', 4)),
      ];

      // すべての和音タイプで再生可能
      for (const chord of chords) {
        expect(chord).toBeInstanceOf(Chord);
        await expect(AudioEngine.playChord(chord)).resolves.toBeUndefined();
      }
    });

    it('正常ケース: 音量設定の型安全性', () => {
      const volumes = [-50, -10, 0, 5];

      volumes.forEach(volume => {
        expect(() => AudioEngine.setVolume(volume)).not.toThrow();
        expect(typeof AudioEngine.config.volume).toBe('number');
      });
    });

    it('正常ケース: アルペジオ速度設定の型安全性', () => {
      const speeds = [50, 100, 200, 500];

      speeds.forEach(speed => {
        expect(() => AudioEngine.setArpeggioSpeed(speed)).not.toThrow();
        expect(typeof AudioEngine.config.arpeggioDelay).toBe('number');
      });
    });
  });

  describe('実用的な使用例', () => {
    it('正常ケース: 基本的な和音進行の再生', async () => {
      // I-V-vi-IV進行
      const progression = [
        Chord.major(new Note('C', 4)), // I
        Chord.major(new Note('G', 4)), // V
        Chord.minor(new Note('A', 4)), // vi
        Chord.major(new Note('F', 4)), // IV
      ];

      // 連続して再生
      for (const chord of progression) {
        await expect(AudioEngine.playChord(chord)).resolves.toBeUndefined();
      }
    });

    // カバレッジ向上: Tone.start()が呼ばれる条件をテスト（AudioEngine.ts 64-65行目）
    it('正常ケース: Toneコンテキストが停止状態の場合にTone.start()が呼ばれる', async () => {
      const mockTone = await import('tone');

      // Toneコンテキストを停止状態に設定
      (mockTone.getContext as Mock).mockReturnValue({ state: 'suspended' });

      // サンプラーをリセット
      (AudioEngine as any).sampler = null;

      const chord = Chord.major(new Note('C', 4));
      await AudioEngine.playChord(chord);

      // Tone.start()が呼ばれることを確認（64-65行目のカバレッジ）
      expect(mockTone.start).toHaveBeenCalled();
    });

    it('正常ケース: 動的な設定変更とセッション', async () => {
      // セッション開始時の設定
      AudioEngine.setVolume(-12);
      AudioEngine.setArpeggioSpeed(120);

      // いくつかの和音を再生
      await AudioEngine.playChord(Chord.major(new Note('C', 4)));

      // 途中で設定変更
      AudioEngine.setVolume(-8);
      AudioEngine.setArpeggioSpeed(80);

      // 変更後の設定で再生
      await AudioEngine.playChord(Chord.minor(new Note('A', 4)));

      // 最終的な設定の確認
      expect(AudioEngine.config.volume).toBe(-8);
      expect(AudioEngine.config.arpeggioDelay).toBe(80);
    });

    it('正常ケース: 異なるオクターブでの再生', async () => {
      const octaves = [2, 3, 4, 5, 6];

      for (const octave of octaves) {
        const chord = Chord.major(new Note('C', octave as any));
        await expect(AudioEngine.playChord(chord)).resolves.toBeUndefined();
      }
    });
  });
});
