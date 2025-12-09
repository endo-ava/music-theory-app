import { describe, test, expect, vi } from 'vitest';
import { generateTwoLayerPaths } from '../pathGeneration';
import { CIRCLE_LAYOUT } from '../../constants';
import * as circlePathGeneration from '@/utils/circlePathGeneration';

// generateMultiLayerPathsをモック化
vi.mock('@/utils/circlePathGeneration', () => ({
  generateMultiLayerPaths: vi.fn((position: number, radii: number[]) => {
    return [`path-layer-0-pos-${position}`, `path-layer-1-pos-${position}`];
  }),
}));

describe('pathGeneration', () => {
  describe('generateTwoLayerPaths', () => {
    test('正常ケース: 正しいradii配列でgenerateMultiLayerPathsを呼び出す', () => {
      const position = 0;
      generateTwoLayerPaths(position);

      expect(circlePathGeneration.generateMultiLayerPaths).toHaveBeenCalledWith(position, [
        CIRCLE_LAYOUT.CENTER_RADIUS,
        CIRCLE_LAYOUT.MIDDLE_RADIUS,
        CIRCLE_LAYOUT.RADIUS,
      ]);
    });

    test('正常ケース: pitchPathとsignaturePathを含むオブジェクトを返す', () => {
      const result = generateTwoLayerPaths(0);

      expect(result).toHaveProperty('pitchPath');
      expect(result).toHaveProperty('signaturePath');
    });

    test('正常ケース: position 0 で正しいパスを生成する', () => {
      const result = generateTwoLayerPaths(0);

      expect(result.pitchPath).toBe('path-layer-0-pos-0');
      expect(result.signaturePath).toBe('path-layer-1-pos-0');
    });

    test('正常ケース: position 5 で正しいパスを生成する', () => {
      const result = generateTwoLayerPaths(5);

      expect(result.pitchPath).toBe('path-layer-0-pos-5');
      expect(result.signaturePath).toBe('path-layer-1-pos-5');
    });

    test('正常ケース: position 11 で正しいパスを生成する', () => {
      const result = generateTwoLayerPaths(11);

      expect(result.pitchPath).toBe('path-layer-0-pos-11');
      expect(result.signaturePath).toBe('path-layer-1-pos-11');
    });

    test('正常ケース: 異なる位置で異なるパスを生成する', () => {
      const result0 = generateTwoLayerPaths(0);
      const result1 = generateTwoLayerPaths(1);

      expect(result0.pitchPath).not.toBe(result1.pitchPath);
      expect(result0.signaturePath).not.toBe(result1.signaturePath);
    });

    test('正常ケース: radii配列が3つの要素を持つ（2層構造）', () => {
      generateTwoLayerPaths(0);

      const callArgs = vi.mocked(circlePathGeneration.generateMultiLayerPaths).mock.calls[0];
      const radii = callArgs[1];

      expect(radii).toHaveLength(3);
      expect(radii[0]).toBe(CIRCLE_LAYOUT.CENTER_RADIUS);
      expect(radii[1]).toBe(CIRCLE_LAYOUT.MIDDLE_RADIUS);
      expect(radii[2]).toBe(CIRCLE_LAYOUT.RADIUS);
    });

    test('境界値ケース: position 0 でエラーが発生しない', () => {
      expect(() => generateTwoLayerPaths(0)).not.toThrow();
    });

    test('境界値ケース: position 11 でエラーが発生しない', () => {
      expect(() => generateTwoLayerPaths(11)).not.toThrow();
    });
  });

  describe('レイアウト定数の整合性', () => {
    test('CIRCLE_LAYOUTの値が正しい順序である', () => {
      expect(CIRCLE_LAYOUT.CENTER_RADIUS).toBeLessThan(CIRCLE_LAYOUT.MIDDLE_RADIUS);
      expect(CIRCLE_LAYOUT.MIDDLE_RADIUS).toBeLessThan(CIRCLE_LAYOUT.RADIUS);
    });

    test('CENTER_RADIUSが90pxである', () => {
      expect(CIRCLE_LAYOUT.CENTER_RADIUS).toBe(90);
    });

    test('MIDDLE_RADIUSが175pxである', () => {
      expect(CIRCLE_LAYOUT.MIDDLE_RADIUS).toBe(175);
    });

    test('RADIUSが200pxである', () => {
      expect(CIRCLE_LAYOUT.RADIUS).toBe(200);
    });
  });
});
