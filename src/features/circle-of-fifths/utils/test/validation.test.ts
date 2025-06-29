import { describe, test, expect } from 'vitest';
import { isValidPosition, isValidKey } from '../validation';
import { Key } from '@/features/circle-of-fifths/types';

describe('validation utils', () => {
  describe('isValidPosition', () => {
    test('正常ケース: 有効な位置（0-11）でtrueを返す', () => {
      // 0から11までの全ての位置をテスト
      for (let i = 0; i < 12; i++) {
        expect(isValidPosition(i)).toBe(true);
      }
    });

    test('境界値ケース: 負の数でfalseを返す', () => {
      expect(isValidPosition(-1)).toBe(false);
      expect(isValidPosition(-10)).toBe(false);
    });

    test('境界値ケース: 12以上の数でfalseを返す', () => {
      expect(isValidPosition(12)).toBe(false);
      expect(isValidPosition(100)).toBe(false);
    });

    test('異常ケース: 小数でfalseを返す', () => {
      expect(isValidPosition(1.5)).toBe(false);
      expect(isValidPosition(10.1)).toBe(false);
      expect(isValidPosition(-0.5)).toBe(false);
    });

    test('異常ケース: NaNでfalseを返す', () => {
      expect(isValidPosition(NaN)).toBe(false);
    });

    test('異常ケース: Infinityでfalseを返す', () => {
      expect(isValidPosition(Infinity)).toBe(false);
      expect(isValidPosition(-Infinity)).toBe(false);
    });
  });

  describe('isValidKey', () => {
    test('正常ケース: 完全に有効なKeyオブジェクトでtrueを返す', () => {
      const validMajorKey: Key = {
        name: 'C',
        isMajor: true,
        position: 0,
      };
      expect(isValidKey(validMajorKey)).toBe(true);

      const validMinorKey: Key = {
        name: 'Am',
        isMajor: false,
        position: 0,
      };
      expect(isValidKey(validMinorKey)).toBe(true);

      // 複雑なキー名もテスト
      const validComplexKey: Key = {
        name: 'F#/G♭',
        isMajor: true,
        position: 6,
      };
      expect(isValidKey(validComplexKey)).toBe(true);
    });

    test('異常ケース: nameが空文字列でfalseを返す', () => {
      const invalidKey: Key = {
        name: '',
        isMajor: true,
        position: 0,
      };
      expect(isValidKey(invalidKey)).toBe(false);
    });

    test('異常ケース: nameが文字列以外でfalseを返す', () => {
      const invalidKey = {
        name: 123,
        isMajor: true,
        position: 0,
      } as unknown as Key;
      expect(isValidKey(invalidKey)).toBe(false);

      const nullNameKey = {
        name: null,
        isMajor: true,
        position: 0,
      } as unknown as Key;
      expect(isValidKey(nullNameKey)).toBe(false);

      const undefinedNameKey = {
        name: undefined,
        isMajor: true,
        position: 0,
      } as unknown as Key;
      expect(isValidKey(undefinedNameKey)).toBe(false);
    });

    test('異常ケース: isMajorがboolean以外でfalseを返す', () => {
      const invalidKey = {
        name: 'C',
        isMajor: 'true',
        position: 0,
      } as unknown as Key;
      expect(isValidKey(invalidKey)).toBe(false);

      const numberKey = {
        name: 'C',
        isMajor: 1,
        position: 0,
      } as unknown as Key;
      expect(isValidKey(numberKey)).toBe(false);

      const nullKey = {
        name: 'C',
        isMajor: null,
        position: 0,
      } as unknown as Key;
      expect(isValidKey(nullKey)).toBe(false);
    });

    test('異常ケース: positionが無効でfalseを返す', () => {
      const invalidPositionKey: Key = {
        name: 'C',
        isMajor: true,
        position: -1,
      };
      expect(isValidKey(invalidPositionKey)).toBe(false);

      const outOfRangeKey: Key = {
        name: 'C',
        isMajor: true,
        position: 12,
      };
      expect(isValidKey(outOfRangeKey)).toBe(false);

      const floatPositionKey = {
        name: 'C',
        isMajor: true,
        position: 1.5,
      } as unknown as Key;
      expect(isValidKey(floatPositionKey)).toBe(false);
    });
  });
});
