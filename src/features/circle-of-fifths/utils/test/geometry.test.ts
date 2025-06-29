import { describe, test, expect } from 'vitest';
import {
  calculateAngle,
  normalizeAngle,
  polarToCartesian,
  calculateTextPosition,
  calculateTextRotation,
} from '../geometry';
import { CircleOfFifthsError } from '@/features/circle-of-fifths/types';
import { ANGLE_OFFSET, ANGLE_PER_SEGMENT, SEGMENT_COUNT } from '../../constants/index';

describe('geometry utils', () => {
  describe('calculateAngle', () => {
    test('正常ケース: 位置0で正しい角度を返す', () => {
      const expectedAngle = (ANGLE_OFFSET * Math.PI) / 180;
      expect(calculateAngle(0)).toBeCloseTo(expectedAngle, 10);
    });

    test('正常ケース: 各位置（0-11）で正しい角度を計算', () => {
      for (let position = 0; position < SEGMENT_COUNT; position++) {
        const expectedAngleInDegrees = position * ANGLE_PER_SEGMENT + ANGLE_OFFSET;
        const expectedAngle = (expectedAngleInDegrees * Math.PI) / 180;
        expect(calculateAngle(position)).toBeCloseTo(expectedAngle, 10);
      }
    });

    test('正常ケース: 位置3（A）で正しい角度を返す', () => {
      // 3 * 30 - 105 = -15 degrees
      const expectedAngle = (-15 * Math.PI) / 180;
      expect(calculateAngle(3)).toBeCloseTo(expectedAngle, 10);
    });

    test('正常ケース: 位置6（F#/G♭）で正しい角度を返す', () => {
      // 6 * 30 - 105 = 75 degrees
      const expectedAngle = (75 * Math.PI) / 180;
      expect(calculateAngle(6)).toBeCloseTo(expectedAngle, 10);
    });

    test('異常ケース: 無効な位置でCircleOfFifthsErrorをスロー', () => {
      expect(() => calculateAngle(-1)).toThrow(CircleOfFifthsError);
      expect(() => calculateAngle(12)).toThrow(CircleOfFifthsError);
      expect(() => calculateAngle(1.5)).toThrow(CircleOfFifthsError);

      // エラーメッセージとコードの確認
      try {
        calculateAngle(-1);
      } catch (error) {
        expect(error).toBeInstanceOf(CircleOfFifthsError);
        expect((error as CircleOfFifthsError).code).toBe('INVALID_POSITION');
        expect((error as CircleOfFifthsError).message).toBe('Invalid position: -1');
      }
    });
  });

  describe('normalizeAngle', () => {
    test('正常ケース: 正の角度をそのまま返す', () => {
      expect(normalizeAngle(Math.PI / 2)).toBeCloseTo(Math.PI / 2, 10);
      expect(normalizeAngle(Math.PI)).toBeCloseTo(Math.PI, 10);
      expect(normalizeAngle((3 * Math.PI) / 2)).toBeCloseTo((3 * Math.PI) / 2, 10);
    });

    test('正常ケース: 負の角度を正規化', () => {
      expect(normalizeAngle(-Math.PI / 2)).toBeCloseTo((3 * Math.PI) / 2, 10);
      expect(normalizeAngle(-Math.PI)).toBeCloseTo(Math.PI, 10);
      expect(normalizeAngle(-2 * Math.PI)).toBeCloseTo(0, 10);
    });

    test('正常ケース: 2π以上の角度を正規化', () => {
      expect(normalizeAngle(2 * Math.PI + Math.PI / 2)).toBeCloseTo(Math.PI / 2, 10);
      expect(normalizeAngle(4 * Math.PI)).toBeCloseTo(0, 10);
      expect(normalizeAngle(3 * Math.PI)).toBeCloseTo(Math.PI, 10);
    });

    test('境界値ケース: 0度と2π度の処理', () => {
      expect(normalizeAngle(0)).toBeCloseTo(0, 10);
      expect(normalizeAngle(2 * Math.PI)).toBeCloseTo(0, 10);
      expect(normalizeAngle(-2 * Math.PI)).toBeCloseTo(0, 10);
    });
  });

  describe('polarToCartesian', () => {
    test('正常ケース: 0度で正しい座標を返す', () => {
      const result = polarToCartesian(100, 0);
      expect(result.x).toBeCloseTo(100, 10);
      expect(result.y).toBeCloseTo(0, 10);
    });

    test('正常ケース: 90度で正しい座標を返す', () => {
      const result = polarToCartesian(100, Math.PI / 2);
      expect(result.x).toBeCloseTo(0, 10);
      expect(result.y).toBeCloseTo(100, 10);
    });

    test('正常ケース: 180度で正しい座標を返す', () => {
      const result = polarToCartesian(100, Math.PI);
      expect(result.x).toBeCloseTo(-100, 10);
      expect(result.y).toBeCloseTo(0, 10);
    });

    test('正常ケース: 270度で正しい座標を返す', () => {
      const result = polarToCartesian(100, (3 * Math.PI) / 2);
      expect(result.x).toBeCloseTo(0, 10);
      expect(result.y).toBeCloseTo(-100, 10);
    });

    test('正常ケース: 半径0で原点を返す', () => {
      const result = polarToCartesian(0, Math.PI / 4);
      expect(result.x).toBeCloseTo(0, 10);
      expect(result.y).toBeCloseTo(0, 10);
    });
  });

  describe('calculateTextPosition', () => {
    test('正常ケース: 各位置で正しいテキスト座標を計算', () => {
      const radius = 150;

      for (let position = 0; position < SEGMENT_COUNT; position++) {
        const result = calculateTextPosition(position, radius);

        // セグメントの中心角度を計算
        const centerAngle = calculateAngle(position) + Math.PI / SEGMENT_COUNT;
        const expected = polarToCartesian(radius, centerAngle);

        expect(result.x).toBeCloseTo(expected.x, 10);
        expect(result.y).toBeCloseTo(expected.y, 10);
      }
    });

    test('異常ケース: 無効な位置でCircleOfFifthsErrorをスロー', () => {
      expect(() => calculateTextPosition(-1, 100)).toThrow(CircleOfFifthsError);
      expect(() => calculateTextPosition(12, 100)).toThrow(CircleOfFifthsError);

      try {
        calculateTextPosition(-1, 100);
      } catch (error) {
        expect(error).toBeInstanceOf(CircleOfFifthsError);
        expect((error as CircleOfFifthsError).code).toBe('INVALID_POSITION');
      }
    });

    test('異常ケース: 負の半径でCircleOfFifthsErrorをスロー', () => {
      expect(() => calculateTextPosition(0, -100)).toThrow(CircleOfFifthsError);

      try {
        calculateTextPosition(0, -100);
      } catch (error) {
        expect(error).toBeInstanceOf(CircleOfFifthsError);
        expect((error as CircleOfFifthsError).code).toBe('INVALID_RADIUS');
        expect((error as CircleOfFifthsError).message).toBe('Invalid radius: -100');
      }
    });
  });

  describe('calculateTextRotation', () => {
    test('正常ケース: 常に0を返す', () => {
      expect(calculateTextRotation()).toBe(0);
    });
  });
});
