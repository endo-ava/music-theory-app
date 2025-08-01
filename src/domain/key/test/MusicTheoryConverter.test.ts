/**
 * MusicTheoryConverter変換ユーティリティのユニットテスト（最小化版）
 * 実際に使用されているメソッドのテストのみ保持
 */

import { describe, it, expect } from 'vitest';
import { MusicTheoryConverter } from '../MusicTheoryConverter';
import { PitchClass, type FifthsIndex, type PitchClassName } from '@/domain/common/PitchClass';

describe('MusicTheoryConverter（最小化版）', () => {
  describe('fifthsToNoteName', () => {
    it('正常ケース: 五度圏から音名への変換', () => {
      const expectedMapping: Array<[FifthsIndex, PitchClassName]> = [
        [0, 'C'],
        [1, 'G'],
        [2, 'D'],
        [3, 'A'],
        [4, 'E'],
        [5, 'B'],
        [6, 'F#'],
        [7, 'C#'],
        [8, 'G#'],
        [9, 'D#'],
        [10, 'A#'],
        [11, 'F'],
      ];

      expectedMapping.forEach(([fifthsIndex, expectedNoteName]) => {
        expect(MusicTheoryConverter.fifthsToNoteName(fifthsIndex)).toBe(expectedNoteName);
      });
    });
  });

  describe('fifthsToRelativeMinorNoteName', () => {
    it('正常ケース: 既知のメジャー/マイナーペアの確認', () => {
      const wellKnownPairs: Array<[FifthsIndex, PitchClassName, PitchClassName]> = [
        [0, 'C', 'A'], // C major / A minor
        [1, 'G', 'E'], // G major / E minor
        [2, 'D', 'B'], // D major / B minor
        [5, 'B', 'G#'], // B major / G# minor
        [11, 'F', 'D'], // F major / D minor
      ];

      wellKnownPairs.forEach(([position, expectedMajor, expectedMinor]) => {
        const actualMajor = MusicTheoryConverter.fifthsToNoteName(position);
        const actualMinor = MusicTheoryConverter.fifthsToRelativeMinorNoteName(position);

        expect(actualMajor).toBe(expectedMajor);
        expect(actualMinor).toBe(expectedMinor);
      });
    });

    it('境界値ケース: 全ての五度圏ポジションで短3度関係が成立', () => {
      const allFifthsIndices: FifthsIndex[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

      allFifthsIndices.forEach(fifthsIndex => {
        const majorNoteName = MusicTheoryConverter.fifthsToNoteName(fifthsIndex);
        const relativeMinorNoteName =
          MusicTheoryConverter.fifthsToRelativeMinorNoteName(fifthsIndex);

        // メジャーキーから相対マイナーキーは短3度下（-3セミトーン）の関係
        const majorPitchClass = new PitchClass(majorNoteName);
        const expectedMinorPitchClass = majorPitchClass.transpose(-3);

        expect(relativeMinorNoteName).toBe(expectedMinorPitchClass.name);
      });
    });
  });
});
