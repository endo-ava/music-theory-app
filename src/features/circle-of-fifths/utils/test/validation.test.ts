import { describe, test, expect } from 'vitest';
import { isValidPosition } from '../validation';
import { CircleOfFifthsService } from '@/domain/services/CircleOfFifths';

describe('validation utils', () => {
  describe('isValidPosition', () => {
    const segmentCount = CircleOfFifthsService.getSegmentCount();

    test('正常ケース: 有効な位置（0-11）でtrueを返す', () => {
      // 0から11までの全ての位置をテスト
      for (let i = 0; i < segmentCount; i++) {
        expect(isValidPosition(i)).toBe(true);
      }
    });

    test('境界値ケース: 負の数でfalseを返す', () => {
      expect(isValidPosition(-1)).toBe(false);
      expect(isValidPosition(-10)).toBe(false);
    });

    test('境界値ケース: getSegmentCount()以上の数でfalseを返す', () => {
      expect(isValidPosition(segmentCount)).toBe(false);
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
});
