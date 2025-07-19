/**
 * ChromaticIndex値オブジェクトのユニットテスト
 */

import { describe, it, expect } from 'vitest';
import { ChromaticIndex, type ChromaticIndexValue } from '../ChromaticIndex';
import type { NoteName } from '../Note';
import type { FifthsIndex } from '../../types/FifthsIndex';

describe('ChromaticIndex', () => {
  describe('constructor', () => {
    it('正常ケース: 有効な値（0-11）でインスタンスを作成', () => {
      const validValues: ChromaticIndexValue[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

      validValues.forEach(value => {
        const index = new ChromaticIndex(value);
        expect(index.value).toBe(value);
      });
    });

    it('異常ケース: 無効な値でエラーをスロー', () => {
      const invalidValues = [-1, 12, 13, 0.5, NaN, Infinity];

      invalidValues.forEach(value => {
        expect(() => new ChromaticIndex(value as ChromaticIndexValue)).toThrow(
          `Invalid chromatic index: ${value}. Must be 0-11`
        );
      });
    });
  });

  describe('toNoteName', () => {
    it('正常ケース: 各半音階インデックスが正しい音名を返す', () => {
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

      expectedMapping.forEach(([chromaticValue, expectedNoteName]) => {
        const index = new ChromaticIndex(chromaticValue);
        expect(index.toNoteName()).toBe(expectedNoteName);
      });
    });
  });

  describe('toFifthsIndex', () => {
    it('正常ケース: 各半音階インデックスが正しい五度圏インデックスを返す', () => {
      const expectedMapping: Array<[ChromaticIndexValue, FifthsIndex]> = [
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

      expectedMapping.forEach(([chromaticValue, expectedFifthsIndex]) => {
        const index = new ChromaticIndex(chromaticValue);
        expect(index.toFifthsIndex()).toBe(expectedFifthsIndex);
      });
    });
  });

  describe('toSemitones', () => {
    it('正常ケース: 半音階インデックス値がそのままセミトーン数として返される', () => {
      const testValues: ChromaticIndexValue[] = [0, 1, 5, 7, 11];

      testValues.forEach(value => {
        const index = new ChromaticIndex(value);
        expect(index.toSemitones()).toBe(value);
      });
    });
  });

  describe('fromNoteName', () => {
    it('正常ケース: 各音名から正しい半音階インデックスを作成', () => {
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

      expectedMapping.forEach(([noteName, expectedValue]) => {
        const index = ChromaticIndex.fromNoteName(noteName);
        expect(index.value).toBe(expectedValue);
      });
    });
  });

  describe('fromFifthsIndex', () => {
    it('正常ケース: 各五度圏インデックスから正しい半音階インデックスを作成', () => {
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

      expectedMapping.forEach(([fifthsIndex, expectedValue]) => {
        const index = ChromaticIndex.fromFifthsIndex(fifthsIndex);
        expect(index.value).toBe(expectedValue);
      });
    });
  });

  describe('fromSemitones', () => {
    it('正常ケース: 正の値から正しい半音階インデックスを作成', () => {
      const testCases: Array<[number, ChromaticIndexValue]> = [
        [0, 0],
        [5, 5],
        [11, 11],
        [12, 0], // 1オクターブ上
        [13, 1], // 1オクターブ + 1セミトーン
        [24, 0], // 2オクターブ上
      ];

      testCases.forEach(([semitones, expectedValue]) => {
        const index = ChromaticIndex.fromSemitones(semitones);
        expect(index.value).toBe(expectedValue);
      });
    });

    it('正常ケース: 負の値から正しい半音階インデックスを作成', () => {
      const testCases: Array<[number, ChromaticIndexValue]> = [
        [-1, 11], // 1セミトーン下
        [-5, 7], // 5セミトーン下
        [-12, 0], // 1オクターブ下
        [-13, 11], // 1オクターブ + 1セミトーン下
        [-24, 0], // 2オクターブ下
      ];

      testCases.forEach(([semitones, expectedValue]) => {
        const index = ChromaticIndex.fromSemitones(semitones);
        expect(index.value).toBe(expectedValue);
      });
    });
  });

  describe('相互変換の一貫性', () => {
    it('正常ケース: 音名 → 半音階 → 音名の往復変換', () => {
      const allNoteNames: NoteName[] = [
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

      allNoteNames.forEach(noteName => {
        const chromatic = ChromaticIndex.fromNoteName(noteName);
        const convertedNoteName = chromatic.toNoteName();
        expect(convertedNoteName).toBe(noteName);
      });
    });

    it('正常ケース: 五度圏 → 半音階 → 五度圏の往復変換', () => {
      const allFifthsIndices: FifthsIndex[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

      allFifthsIndices.forEach(fifthsIndex => {
        const chromatic = ChromaticIndex.fromFifthsIndex(fifthsIndex);
        const convertedFifthsIndex = chromatic.toFifthsIndex();
        expect(convertedFifthsIndex).toBe(fifthsIndex);
      });
    });

    it('正常ケース: セミトーン → 半音階 → セミトーンの往復変換', () => {
      const testSemitones = [0, 1, 5, 7, 11, 12, 13, 23, -1, -5, -12];

      testSemitones.forEach(semitones => {
        const chromatic = ChromaticIndex.fromSemitones(semitones);
        const convertedSemitones = chromatic.toSemitones();
        const normalizedExpected = ((semitones % 12) + 12) % 12;
        expect(convertedSemitones).toBe(normalizedExpected);
      });
    });
  });
});
