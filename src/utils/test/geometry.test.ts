import { describe, test, expect } from 'vitest';
import {
  normalizeAngle,
  polarToCartesian,
  degreesToRadians,
  calculateAngle,
  calculateTextPosition,
} from '../geometry';

describe('shared/utils/geometry', () => {
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

    test('正常ケース: 負の半径を扱う', () => {
      // 負の半径は反対方向の座標を生成
      const result = polarToCartesian(-100, 0);
      expect(result.x).toBeCloseTo(-100, 10);
      expect(result.y).toBeCloseTo(0, 10);
    });

    test('正常ケース: 様々な角度と半径の組み合わせ', () => {
      // 45度
      const result45 = polarToCartesian(100, Math.PI / 4);
      expect(result45.x).toBeCloseTo(100 * Math.cos(Math.PI / 4), 10);
      expect(result45.y).toBeCloseTo(100 * Math.sin(Math.PI / 4), 10);

      // 135度
      const result135 = polarToCartesian(50, (3 * Math.PI) / 4);
      expect(result135.x).toBeCloseTo(50 * Math.cos((3 * Math.PI) / 4), 10);
      expect(result135.y).toBeCloseTo(50 * Math.sin((3 * Math.PI) / 4), 10);
    });
  });

  describe('degreesToRadians', () => {
    test('正常ケース: 0度を正しく変換', () => {
      expect(degreesToRadians(0)).toBeCloseTo(0, 10);
    });

    test('正常ケース: 90度を正しく変換', () => {
      expect(degreesToRadians(90)).toBeCloseTo(Math.PI / 2, 10);
    });

    test('正常ケース: 180度を正しく変換', () => {
      expect(degreesToRadians(180)).toBeCloseTo(Math.PI, 10);
    });

    test('正常ケース: 270度を正しく変換', () => {
      expect(degreesToRadians(270)).toBeCloseTo((3 * Math.PI) / 2, 10);
    });

    test('正常ケース: 360度を正しく変換', () => {
      expect(degreesToRadians(360)).toBeCloseTo(2 * Math.PI, 10);
    });

    test('正常ケース: 負の角度を正しく変換', () => {
      expect(degreesToRadians(-90)).toBeCloseTo(-Math.PI / 2, 10);
      expect(degreesToRadians(-180)).toBeCloseTo(-Math.PI, 10);
    });

    test('正常ケース: 様々な角度を正しく変換', () => {
      expect(degreesToRadians(45)).toBeCloseTo(Math.PI / 4, 10);
      expect(degreesToRadians(30)).toBeCloseTo(Math.PI / 6, 10);
      expect(degreesToRadians(60)).toBeCloseTo(Math.PI / 3, 10);
      expect(degreesToRadians(120)).toBeCloseTo((2 * Math.PI) / 3, 10);
    });
  });

  describe('calculateAngle', () => {
    // 12セグメントの円形レイアウトの標準定数（共通定数から自動適用）
    const ANGLE_PER_SEGMENT = 30; // 360 / 12
    const ANGLE_OFFSET = -105; // Cが真上に来るように調整

    test('正常ケース: 位置0で正しい角度を返す', () => {
      const expectedAngle = (ANGLE_OFFSET * Math.PI) / 180;
      expect(calculateAngle(0)).toBeCloseTo(expectedAngle, 10);
    });

    test('正常ケース: 各位置（0-11）で正しい角度を計算', () => {
      for (let position = 0; position < 12; position++) {
        const expectedAngleInDegrees = position * ANGLE_PER_SEGMENT + ANGLE_OFFSET;
        const expectedAngle = (expectedAngleInDegrees * Math.PI) / 180;
        expect(calculateAngle(position)).toBeCloseTo(expectedAngle, 10);
      }
    });

    test('正常ケース: 位置3で正しい角度を返す', () => {
      // 3 * 30 - 105 = -15 degrees
      const expectedAngle = (-15 * Math.PI) / 180;
      expect(calculateAngle(3)).toBeCloseTo(expectedAngle, 10);
    });

    test('正常ケース: 位置6で正しい角度を返す', () => {
      // 6 * 30 - 105 = 75 degrees
      const expectedAngle = (75 * Math.PI) / 180;
      expect(calculateAngle(6)).toBeCloseTo(expectedAngle, 10);
    });

    test('正常ケース: 位置11で正しい角度を返す', () => {
      // 11 * 30 - 105 = 225 degrees
      const expectedAngle = (225 * Math.PI) / 180;
      expect(calculateAngle(11)).toBeCloseTo(expectedAngle, 10);
    });
  });

  describe('calculateTextPosition', () => {
    const HALF_ANGLE_PER_SEGMENT_RAD = Math.PI / 12;

    test('正常ケース: 各位置で正しいテキスト座標を計算', () => {
      const radius = 150;

      for (let position = 0; position < 12; position++) {
        const result = calculateTextPosition(position, radius);

        // セグメントの中心角度を計算
        const centerAngle = calculateAngle(position) + HALF_ANGLE_PER_SEGMENT_RAD;
        const expected = polarToCartesian(radius, centerAngle);

        expect(result.x).toBeCloseTo(expected.x, 10);
        expect(result.y).toBeCloseTo(expected.y, 10);
      }
    });

    test('正常ケース: 位置0、半径100での座標計算', () => {
      const result = calculateTextPosition(0, 100);

      // position=0の中心角度: -105 + 15 = -90度 = -π/2ラジアン（真上）
      const centerAngle = (-90 * Math.PI) / 180;
      expect(result.x).toBeCloseTo(100 * Math.cos(centerAngle), 10);
      expect(result.y).toBeCloseTo(100 * Math.sin(centerAngle), 10);
    });

    test('正常ケース: 半径0で原点を返す', () => {
      const result = calculateTextPosition(5, 0);
      expect(result.x).toBeCloseTo(0, 10);
      expect(result.y).toBeCloseTo(0, 10);
    });

    test('正常ケース: 異なる半径での座標計算', () => {
      const radii = [50, 100, 150, 200];
      radii.forEach(radius => {
        const result = calculateTextPosition(3, radius);

        // 結果の座標が期待される半径になっていることを確認
        const distance = Math.sqrt(result.x * result.x + result.y * result.y);
        expect(distance).toBeCloseTo(radius, 10);
      });
    });

    test('正常ケース: 位置6、半径120での座標計算', () => {
      const result = calculateTextPosition(6, 120);

      // position=6の中心角度: 6 * 30 - 105 + 15 = 90度 = π/2ラジアン（右）
      const centerAngle = (90 * Math.PI) / 180;
      expect(result.x).toBeCloseTo(120 * Math.cos(centerAngle), 10);
      expect(result.y).toBeCloseTo(120 * Math.sin(centerAngle), 10);
    });
  });
});
