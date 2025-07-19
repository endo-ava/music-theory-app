/**
 * FifthsIndex型とユーティリティのユニットテスト
 */

import { describe, it, expect } from 'vitest';
import { isValidFifthsIndex, type FifthsIndex } from '../FifthsIndex';

describe('FifthsIndex', () => {
  describe('isValidFifthsIndex', () => {
    it('正常ケース: 有効な五度圏インデックス（0-11）でtrueを返す', () => {
      const validIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

      validIndices.forEach(index => {
        expect(isValidFifthsIndex(index)).toBe(true);
      });
    });

    it('境界値ケース: 負の数でfalseを返す', () => {
      const negativeValues = [-1, -5, -12];

      negativeValues.forEach(value => {
        expect(isValidFifthsIndex(value)).toBe(false);
      });
    });

    it('境界値ケース: 12以上の数でfalseを返す', () => {
      const largeValues = [12, 13, 24, 100];

      largeValues.forEach(value => {
        expect(isValidFifthsIndex(value)).toBe(false);
      });
    });

    it('異常ケース: 小数点数でfalseを返す', () => {
      const decimalValues = [0.5, 1.1, 5.9, 10.99];

      decimalValues.forEach(value => {
        expect(isValidFifthsIndex(value)).toBe(false);
      });
    });

    it('異常ケース: 特殊値でfalseを返す', () => {
      const specialValues = [NaN, Infinity, -Infinity];

      specialValues.forEach(value => {
        expect(isValidFifthsIndex(value)).toBe(false);
      });
    });

    it('型ガード機能: 有効な値の場合に型の絞り込みが可能', () => {
      const testValue: number = 5;

      if (isValidFifthsIndex(testValue)) {
        // TypeScriptの型チェック: testValueがFifthsIndex型に絞り込まれる
        const fifthsIndex: FifthsIndex = testValue;
        expect(fifthsIndex).toBe(5);
      } else {
        // このブロックには入らないはず
        expect.fail('有効な値が無効と判定された');
      }
    });

    it('型ガード機能: 無効な値の場合に型の絞り込みが行われない', () => {
      const testValue: number = 12;

      if (isValidFifthsIndex(testValue)) {
        // このブロックには入らないはず
        expect.fail('無効な値が有効と判定された');
      } else {
        // testValueはnumber型のまま
        expect(testValue).toBe(12);
      }
    });
  });

  describe('FifthsIndex型の基本特性', () => {
    it('正常ケース: 全ての有効値が五度圏の12ポジションを表現', () => {
      // 五度圏の音名対応（コメントベース）
      const fifthsIndexToNoteName = {
        0: 'C', // C/Am
        1: 'G', // G/Em
        2: 'D', // D/Bm
        3: 'A', // A/F#m
        4: 'E', // E/C#m
        5: 'B', // B/G#m
        6: 'F#', // F#/D#m
        7: 'C#', // C#/A#m
        8: 'G#', // G#/Fm
        9: 'D#', // D#/Cm
        10: 'A#', // A#/Gm
        11: 'F', // F/Dm
      } as const;

      Object.keys(fifthsIndexToNoteName).forEach(key => {
        const index = parseInt(key, 10);
        expect(isValidFifthsIndex(index)).toBe(true);
        expect(index).toBeGreaterThanOrEqual(0);
        expect(index).toBeLessThan(12);
      });
    });

    it('境界値ケース: 下限（0）と上限付近（11）の動作確認', () => {
      // 下限
      expect(isValidFifthsIndex(0)).toBe(true);

      // 上限
      expect(isValidFifthsIndex(11)).toBe(true);

      // 上限を超える値
      expect(isValidFifthsIndex(12)).toBe(false);
    });
  });
});
