/**
 * MusicTheoryConverter変換ユーティリティのユニットテスト
 */

import { describe, it, expect } from 'vitest';
import { MusicTheoryConverter } from '../MusicTheoryConverter';
import type { FifthsIndex } from '../../types/FifthsIndex';
import type { NoteName } from '../../value-objects/Note';
import type { ChromaticIndexValue } from '../../value-objects/ChromaticIndex';
import type { Semitones, IntervalType } from '../../value-objects/Interval';
import { Interval } from '../../value-objects/Interval';

describe('MusicTheoryConverter', () => {
  describe('FifthsIndex ↔ ChromaticIndex', () => {
    it('正常ケース: 五度圏から半音階への変換', () => {
      const expectedMapping: Array<[FifthsIndex, ChromaticIndexValue]> = [
        [0, 0], // C
        [1, 7], // G
        [2, 2], // D
        [3, 9], // A
        [4, 4], // E
        [5, 11], // B
        [6, 6], // F#
        [7, 1], // C#
        [8, 8], // G#
        [9, 3], // D#
        [10, 10], // A#
        [11, 5], // F
      ];

      expectedMapping.forEach(([fifthsIndex, expectedChromatic]) => {
        expect(MusicTheoryConverter.fifthsToChromatic(fifthsIndex)).toBe(expectedChromatic);
      });
    });

    it('正常ケース: 半音階から五度圏への変換', () => {
      const expectedMapping: Array<[ChromaticIndexValue, FifthsIndex]> = [
        [0, 0], // C
        [1, 7], // C#
        [2, 2], // D
        [3, 9], // D#
        [4, 4], // E
        [5, 11], // F
        [6, 6], // F#
        [7, 1], // G
        [8, 8], // G#
        [9, 3], // A
        [10, 10], // A#
        [11, 5], // B
      ];

      expectedMapping.forEach(([chromaticIndex, expectedFifths]) => {
        expect(MusicTheoryConverter.chromaticToFifths(chromaticIndex)).toBe(expectedFifths);
      });
    });
  });

  describe('FifthsIndex ↔ NoteName', () => {
    it('正常ケース: 五度圏から音名への変換', () => {
      const expectedMapping: Array<[FifthsIndex, NoteName]> = [
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

    it('正常ケース: 音名から五度圏への変換', () => {
      const expectedMapping: Array<[NoteName, FifthsIndex]> = [
        ['C', 0],
        ['G', 1],
        ['D', 2],
        ['A', 3],
        ['E', 4],
        ['B', 5],
        ['F#', 6],
        ['C#', 7],
        ['G#', 8],
        ['D#', 9],
        ['A#', 10],
        ['F', 11],
      ];

      expectedMapping.forEach(([noteName, expectedFifthsIndex]) => {
        expect(MusicTheoryConverter.noteNameToFifths(noteName)).toBe(expectedFifthsIndex);
      });
    });
  });

  describe('FifthsIndex → 相対マイナーキー', () => {
    it('正常ケース: 五度圏ポジションから相対マイナーキーの音名を取得', () => {
      const expectedMapping: Array<[FifthsIndex, NoteName]> = [
        [0, 'A'], // C major → A minor
        [1, 'E'], // G major → E minor
        [2, 'B'], // D major → B minor
        [3, 'F#'], // A major → F# minor
        [4, 'C#'], // E major → C# minor
        [5, 'G#'], // B major → G# minor
        [6, 'D#'], // F# major → D# minor
        [7, 'A#'], // C# major → A# minor
        [8, 'F'], // G# major → F minor
        [9, 'C'], // D# major → C minor
        [10, 'G'], // A# major → G minor
        [11, 'D'], // F major → D minor
      ];

      expectedMapping.forEach(([fifthsIndex, expectedMinorNote]) => {
        expect(MusicTheoryConverter.fifthsToRelativeMinorNoteName(fifthsIndex)).toBe(
          expectedMinorNote
        );
      });
    });

    it('正常ケース: 相対メジャー・マイナー関係の一貫性', () => {
      const allFifthsIndices: FifthsIndex[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

      allFifthsIndices.forEach(fifthsIndex => {
        const majorNoteName = MusicTheoryConverter.fifthsToNoteName(fifthsIndex);
        const relativeMinorNoteName =
          MusicTheoryConverter.fifthsToRelativeMinorNoteName(fifthsIndex);

        // メジャーキーから相対マイナーキーは短3度下（-3セミトーン）の関係
        const expectedMinorNote = MusicTheoryConverter.transposeNoteName(majorNoteName, -3);
        expect(relativeMinorNoteName).toBe(expectedMinorNote);
      });
    });

    it('正常ケース: 音楽理論的正確性の検証', () => {
      // よく知られた相対調の関係をテスト
      const wellKnownPairs: Array<[FifthsIndex, NoteName, NoteName]> = [
        [0, 'C', 'A'], // C major ↔ A minor
        [1, 'G', 'E'], // G major ↔ E minor
        [2, 'D', 'B'], // D major ↔ B minor
        [11, 'F', 'D'], // F major ↔ D minor
      ];

      wellKnownPairs.forEach(([position, expectedMajor, expectedMinor]) => {
        const actualMajor = MusicTheoryConverter.fifthsToNoteName(position);
        const actualMinor = MusicTheoryConverter.fifthsToRelativeMinorNoteName(position);

        expect(actualMajor).toBe(expectedMajor);
        expect(actualMinor).toBe(expectedMinor);
      });
    });

    it('正常ケース: ドメインモデル（Interval）使用の検証', () => {
      // 内部でintervalToSemitonesByType('minor3rd')を使用していることを間接的に検証
      const testCases: Array<[FifthsIndex, NoteName]> = [
        [0, 'A'], // C - minor3rd = A
        [6, 'D#'], // F# - minor3rd = D#
      ];

      testCases.forEach(([fifthsIndex, expectedMinor]) => {
        const result = MusicTheoryConverter.fifthsToRelativeMinorNoteName(fifthsIndex);
        expect(result).toBe(expectedMinor);

        // 短3度（3セミトーン）が正しく適用されていることを確認
        const majorNote = MusicTheoryConverter.fifthsToNoteName(fifthsIndex);
        const manualCalculation = MusicTheoryConverter.transposeNoteName(majorNote, -3);
        expect(result).toBe(manualCalculation);
      });
    });
  });

  describe('FifthsIndex ↔ Semitones', () => {
    it('正常ケース: 五度圏からセミトーンへの変換', () => {
      const expectedMapping: Array<[FifthsIndex, Semitones]> = [
        [0, 0], // C
        [1, 7], // G
        [2, 2], // D
        [3, 9], // A
        [4, 4], // E
        [5, 11], // B
        [6, 6], // F#
        [7, 1], // C#
        [8, 8], // G#
        [9, 3], // D#
        [10, 10], // A#
        [11, 5], // F
      ];

      expectedMapping.forEach(([fifthsIndex, expectedSemitones]) => {
        expect(MusicTheoryConverter.fifthsToSemitones(fifthsIndex)).toBe(expectedSemitones);
      });
    });

    it('正常ケース: セミトーンから五度圏への変換', () => {
      const testCases: Array<[Semitones, FifthsIndex]> = [
        [0, 0], // C
        [7, 1], // G
        [2, 2], // D
        [9, 3], // A
        [4, 4], // E
        [11, 5], // B
        [6, 6], // F#
        [1, 7], // C#
        [8, 8], // G#
        [3, 9], // D#
        [10, 10], // A#
        [5, 11], // F
      ];

      testCases.forEach(([semitones, expectedFifthsIndex]) => {
        expect(MusicTheoryConverter.semitonesToFifths(semitones)).toBe(expectedFifthsIndex);
      });
    });

    it('正常ケース: オクターブを超えるセミトーンの正規化', () => {
      const testCases: Array<[Semitones, FifthsIndex]> = [
        [12, 0], // C + 1オクターブ
        [19, 1], // G + 1オクターブ
        [14, 2], // D + 1オクターブ
        [-5, 1], // G - 1オクターブ
        [-10, 2], // D - 1オクターブ
      ];

      testCases.forEach(([semitones, expectedFifthsIndex]) => {
        expect(MusicTheoryConverter.semitonesToFifths(semitones)).toBe(expectedFifthsIndex);
      });
    });
  });

  describe('ChromaticIndex ↔ NoteName', () => {
    it('正常ケース: 半音階から音名への変換', () => {
      const expectedMapping: Array<[ChromaticIndexValue, NoteName]> = [
        [0, 'C'],
        [1, 'C#'],
        [2, 'D'],
        [3, 'D#'],
        [4, 'E'],
        [5, 'F'],
        [6, 'F#'],
        [7, 'G'],
        [8, 'G#'],
        [9, 'A'],
        [10, 'A#'],
        [11, 'B'],
      ];

      expectedMapping.forEach(([chromaticIndex, expectedNoteName]) => {
        expect(MusicTheoryConverter.chromaticToNoteName(chromaticIndex)).toBe(expectedNoteName);
      });
    });

    it('正常ケース: 音名から半音階への変換', () => {
      const expectedMapping: Array<[NoteName, ChromaticIndexValue]> = [
        ['C', 0],
        ['C#', 1],
        ['D', 2],
        ['D#', 3],
        ['E', 4],
        ['F', 5],
        ['F#', 6],
        ['G', 7],
        ['G#', 8],
        ['A', 9],
        ['A#', 10],
        ['B', 11],
      ];

      expectedMapping.forEach(([noteName, expectedChromaticIndex]) => {
        expect(MusicTheoryConverter.noteNameToChromatic(noteName)).toBe(expectedChromaticIndex);
      });
    });
  });

  describe('ChromaticIndex ↔ Semitones', () => {
    it('正常ケース: 半音階からセミトーンへの変換（同一値）', () => {
      const testValues: ChromaticIndexValue[] = [0, 1, 5, 7, 11];

      testValues.forEach(value => {
        expect(MusicTheoryConverter.chromaticToSemitones(value)).toBe(value);
      });
    });

    it('正常ケース: セミトーンから半音階への変換', () => {
      const testCases: Array<[Semitones, ChromaticIndexValue]> = [
        [0, 0],
        [5, 5],
        [11, 11],
        [12, 0], // 1オクターブ上
        [13, 1], // 1オクターブ + 1セミトーン
        [-1, 11], // 1セミトーン下
        [-5, 7], // 5セミトーン下
      ];

      testCases.forEach(([semitones, expectedChromaticIndex]) => {
        expect(MusicTheoryConverter.semitonesToChromatic(semitones)).toBe(expectedChromaticIndex);
      });
    });
  });

  describe('NoteName ↔ Semitones', () => {
    it('正常ケース: 音名からセミトーンへの変換', () => {
      const expectedMapping: Array<[NoteName, Semitones]> = [
        ['C', 0],
        ['C#', 1],
        ['D', 2],
        ['F#', 6],
        ['G', 7],
        ['A#', 10],
        ['B', 11],
      ];

      expectedMapping.forEach(([noteName, expectedSemitones]) => {
        expect(MusicTheoryConverter.noteNameToSemitones(noteName)).toBe(expectedSemitones);
      });
    });

    it('正常ケース: セミトーンから音名への変換', () => {
      const testCases: Array<[Semitones, NoteName]> = [
        [0, 'C'],
        [1, 'C#'],
        [7, 'G'],
        [12, 'C'], // 1オクターブ上
        [19, 'G'], // 1オクターブ + 7セミトーン
        [-1, 'B'], // 1セミトーン下
        [-5, 'G'], // 5セミトーン下
      ];

      testCases.forEach(([semitones, expectedNoteName]) => {
        expect(MusicTheoryConverter.semitonesToNoteName(semitones)).toBe(expectedNoteName);
      });
    });
  });

  describe('Interval ↔ Semitones', () => {
    it('正常ケース: インターバルからセミトーンへの変換', () => {
      const intervals = [
        Interval.unison(),
        Interval.minorThird(),
        Interval.majorThird(),
        Interval.perfectFifth(),
      ];

      const expectedSemitones = [0, 3, 4, 7];

      intervals.forEach((interval, index) => {
        expect(MusicTheoryConverter.intervalToSemitones(interval)).toBe(expectedSemitones[index]);
      });
    });

    it('正常ケース: インターバルタイプからセミトーンへの変換', () => {
      const intervalTypes: IntervalType[] = ['unison', 'minor3rd', 'major3rd', 'perfect5th'];
      const expectedSemitones = [0, 3, 4, 7];

      intervalTypes.forEach((intervalType, index) => {
        expect(MusicTheoryConverter.intervalToSemitonesByType(intervalType)).toBe(
          expectedSemitones[index]
        );
      });
    });
  });

  describe('ユーティリティメソッド', () => {
    it('正常ケース: 全音名の配列を取得', () => {
      const allNoteNames = MusicTheoryConverter.getAllNoteNames();
      const expectedNoteNames: NoteName[] = [
        'C',
        'C#',
        'D',
        'D#',
        'E',
        'F',
        'F#',
        'G',
        'G#',
        'A',
        'A#',
        'B',
      ];

      expect(allNoteNames).toEqual(expectedNoteNames);
      expect(allNoteNames.length).toBe(12);
    });

    it('正常ケース: 五度圏順の音名配列を取得', () => {
      const fifthsOrderNoteNames = MusicTheoryConverter.getFifthsOrderNoteNames();
      const expectedFifthsOrder: NoteName[] = [
        'C',
        'G',
        'D',
        'A',
        'E',
        'B',
        'F#',
        'C#',
        'G#',
        'D#',
        'A#',
        'F',
      ];

      expect(fifthsOrderNoteNames).toEqual(expectedFifthsOrder);
      expect(fifthsOrderNoteNames.length).toBe(12);
    });

    it('正常ケース: 音名の移調', () => {
      const testCases: Array<[NoteName, Semitones, NoteName]> = [
        ['C', 0, 'C'], // 移調なし
        ['C', 4, 'E'], // 長3度上
        ['C', 7, 'G'], // 完全5度上
        ['C', 12, 'C'], // 1オクターブ上
        ['G', 5, 'C'], // G + 5セミトーン = C
        ['A', -2, 'G'], // A - 2セミトーン = G
        ['F#', 6, 'C'], // F# + 6セミトーン = C
      ];

      testCases.forEach(([baseNote, semitones, expectedNote]) => {
        expect(MusicTheoryConverter.transposeNoteName(baseNote, semitones)).toBe(expectedNote);
      });
    });

    it('正常ケース: 2つの音名間のセミトーン数を計算', () => {
      const testCases: Array<[NoteName, NoteName, Semitones]> = [
        ['C', 'C', 0], // 同じ音
        ['C', 'E', 4], // C → E (長3度)
        ['C', 'G', 7], // C → G (完全5度)
        ['E', 'C', 8], // E → C (短6度)
        ['G', 'F', 10], // G → F (短7度)
        ['B', 'C', 1], // B → C (短2度)
        ['F', 'F#', 1], // F → F# (増1度/短2度)
      ];

      testCases.forEach(([fromNote, toNote, expectedSemitones]) => {
        expect(MusicTheoryConverter.semitoneBetweenNoteNames(fromNote, toNote)).toBe(
          expectedSemitones
        );
      });
    });
  });

  describe('相互変換の一貫性', () => {
    it('正常ケース: 全表現形式の往復変換', () => {
      const allFifthsIndices: FifthsIndex[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

      allFifthsIndices.forEach(originalFifthsIndex => {
        // FifthsIndex → ChromaticIndex → FifthsIndex
        const chromatic = MusicTheoryConverter.fifthsToChromatic(originalFifthsIndex);
        const backToFifths = MusicTheoryConverter.chromaticToFifths(chromatic);
        expect(backToFifths).toBe(originalFifthsIndex);

        // FifthsIndex → NoteName → FifthsIndex
        const noteName = MusicTheoryConverter.fifthsToNoteName(originalFifthsIndex);
        const backToFifthsFromNote = MusicTheoryConverter.noteNameToFifths(noteName);
        expect(backToFifthsFromNote).toBe(originalFifthsIndex);

        // FifthsIndex → Semitones → FifthsIndex
        const semitones = MusicTheoryConverter.fifthsToSemitones(originalFifthsIndex);
        const backToFifthsFromSemitones = MusicTheoryConverter.semitonesToFifths(semitones);
        expect(backToFifthsFromSemitones).toBe(originalFifthsIndex);
      });
    });

    it('正常ケース: 移調の一貫性', () => {
      const baseNotes: NoteName[] = ['C', 'F#', 'G', 'A#'];
      const transpositionIntervals = [0, 3, 7, 12, -1, -5];

      baseNotes.forEach(baseNote => {
        transpositionIntervals.forEach(interval => {
          const transposedNote = MusicTheoryConverter.transposeNoteName(baseNote, interval);
          const intervalBack = MusicTheoryConverter.semitoneBetweenNoteNames(
            baseNote,
            transposedNote
          );
          const normalizedInterval = ((interval % 12) + 12) % 12;
          expect(intervalBack).toBe(normalizedInterval);
        });
      });
    });
  });
});
