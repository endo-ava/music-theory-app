/**
 * CoordinateSystem 単体テスト
 *
 * 座標計算関数の正確性を検証する。
 */

import { describe, test, expect } from 'vitest';
import { CoordinateSystem, CoordinateConstants } from '../CoordinateSystem';

const { R, SECTOR } = CoordinateConstants;
const CENTER = CoordinateConstants.CENTER;

describe('座標系計算ユーティリティ', () => {
  describe('polarToCartesian', () => {
    test('正常ケース: 基本角度（0°, 90°, 180°, 270°, 360°）での極座標→直交座標変換が正しく動作する', () => {
      // 0度: 東（右）
      const pos0 = CoordinateSystem.polarToCartesian(100, 0);
      expect(pos0.x).toBeCloseTo(CENTER + 100, 10);
      expect(pos0.y).toBeCloseTo(CENTER, 10);

      // 90度: 北（上）- SVG y軸は下向きなので、y座標は減少
      const pos90 = CoordinateSystem.polarToCartesian(100, 90);
      expect(pos90.x).toBeCloseTo(CENTER, 10);
      expect(pos90.y).toBeCloseTo(CENTER - 100, 10);

      // 180度: 西（左）
      const pos180 = CoordinateSystem.polarToCartesian(100, 180);
      expect(pos180.x).toBeCloseTo(CENTER - 100, 10);
      expect(pos180.y).toBeCloseTo(CENTER, 10);

      // 270度: 南（下）
      const pos270 = CoordinateSystem.polarToCartesian(100, 270);
      expect(pos270.x).toBeCloseTo(CENTER, 10);
      expect(pos270.y).toBeCloseTo(CENTER + 100, 10);

      // 360度: 0度と同じ位置
      const pos360 = CoordinateSystem.polarToCartesian(100, 360);
      expect(pos360.x).toBeCloseTo(CENTER + 100, 10);
      expect(pos360.y).toBeCloseTo(CENTER, 10);
    });

    test('正常ケース: SVG y軸反転が正しく適用される', () => {
      // 45度: 右上（数学座標系）→ SVGでは右上
      const pos45 = CoordinateSystem.polarToCartesian(100, 45);
      expect(pos45.x).toBeGreaterThan(CENTER); // 右
      expect(pos45.y).toBeLessThan(CENTER); // 上（SVGでy座標が小さい）

      // 135度: 左上（数学座標系）→ SVGでは左上
      const pos135 = CoordinateSystem.polarToCartesian(100, 135);
      expect(pos135.x).toBeLessThan(CENTER); // 左
      expect(pos135.y).toBeLessThan(CENTER); // 上（SVGでy座標が小さい）

      // 225度: 左下（数学座標系）→ SVGでは左下
      const pos225 = CoordinateSystem.polarToCartesian(100, 225);
      expect(pos225.x).toBeLessThan(CENTER); // 左
      expect(pos225.y).toBeGreaterThan(CENTER); // 下（SVGでy座標が大きい）

      // 315度: 右下（数学座標系）→ SVGでは右下
      const pos315 = CoordinateSystem.polarToCartesian(100, 315);
      expect(pos315.x).toBeGreaterThan(CENTER); // 右
      expect(pos315.y).toBeGreaterThan(CENTER); // 下（SVGでy座標が大きい）
    });

    test('境界値ケース: radius=0で中心座標を返す', () => {
      const pos = CoordinateSystem.polarToCartesian(0, 45);
      expect(pos.x).toBe(CENTER);
      expect(pos.y).toBe(CENTER);
    });

    test('正常ケース: 浮動小数点精度が小数第4位で丸められる', () => {
      const pos = CoordinateSystem.polarToCartesian(100, 30);

      // 座標値に小数点以下5桁以上の精度がないことを確認
      const xDecimal = pos.x.toString().split('.')[1];
      const yDecimal = pos.y.toString().split('.')[1];

      if (xDecimal) {
        expect(xDecimal.length).toBeLessThanOrEqual(4);
      }
      if (yDecimal) {
        expect(yDecimal.length).toBeLessThanOrEqual(4);
      }
    });

    test('境界値ケース: 負の角度でも正しく変換される', () => {
      const posNeg90 = CoordinateSystem.polarToCartesian(100, -90);
      const pos270 = CoordinateSystem.polarToCartesian(100, 270);

      // -90度と270度は同じ位置
      expect(posNeg90.x).toBeCloseTo(pos270.x, 10);
      expect(posNeg90.y).toBeCloseTo(pos270.y, 10);
    });
  });

  describe('getSectorAngle', () => {
    test('正常ケース: セクター内で均等配置する角度を計算する', () => {
      // 120度から240度の範囲に3つの要素を配置
      const angle0 = CoordinateSystem.getSectorAngle(120, 240, 0, 3);
      const angle1 = CoordinateSystem.getSectorAngle(120, 240, 1, 3);
      const angle2 = CoordinateSystem.getSectorAngle(120, 240, 2, 3);

      // 範囲120-240度（120度幅）を4分割（両端に余白）
      // step = 120 / (3 + 1) = 30度
      expect(angle0).toBe(150); // 120 + 30
      expect(angle1).toBe(180); // 120 + 60
      expect(angle2).toBe(210); // 120 + 90
    });

    test('正常ケース: 360度をまたぐセクターで正しく計算される', () => {
      // 330度から30度の範囲（360度をまたぐ、60度幅）に2つの要素を配置
      const angle0 = CoordinateSystem.getSectorAngle(330, 30, 0, 2);
      const angle1 = CoordinateSystem.getSectorAngle(330, 30, 1, 2);

      // step = 60 / (2 + 1) = 20度
      // 330 + 20 = 350度
      expect(angle0).toBe(350);
      // 330 + 40 = 370度 → 370 - 360 = 10度
      expect(angle1).toBe(10);
    });

    test('境界値ケース: 360度ラップが正しく処理される', () => {
      // 0度から60度の範囲
      const angles = [];
      for (let i = 0; i < 5; i++) {
        angles.push(CoordinateSystem.getSectorAngle(0, 60, i, 5));
      }

      // すべて0-360度の範囲内
      angles.forEach(angle => {
        expect(angle).toBeGreaterThanOrEqual(0);
        expect(angle).toBeLessThan(360);
      });

      // 昇順に並んでいる
      for (let i = 0; i < angles.length - 1; i++) {
        expect(angles[i]).toBeLessThan(angles[i + 1]);
      }
    });

    test('境界値ケース: 単一要素でもセクター中央に配置される', () => {
      const angle = CoordinateSystem.getSectorAngle(0, 60, 0, 1);
      // step = 60 / (1 + 1) = 30度
      expect(angle).toBe(30); // セクターの中央
    });
  });

  describe('getSectorPosition', () => {
    test('正常ケース: セクター配置の座標を正しく返す', () => {
      const { start, end } = SECTOR.PITCH;
      const radius = R.PATTERN_INNER;

      const pos = CoordinateSystem.getSectorPosition(start, end, 0, 12, radius);

      // 座標がCENTERからradius距離内にある
      const distance = Math.sqrt(Math.pow(pos.x - CENTER, 2) + Math.pow(pos.y - CENTER, 2));
      expect(distance).toBeCloseTo(radius, 1);
    });

    test('正常ケース: 複数要素が均等に配置される', () => {
      const { start, end } = SECTOR.CHORD;
      const radius = R.PATTERN_MID;
      const total = 6;

      const positions = [];
      for (let i = 0; i < total; i++) {
        positions.push(CoordinateSystem.getSectorPosition(start, end, i, total, radius));
      }

      // すべてが同じ半径上にある
      positions.forEach(pos => {
        const distance = Math.sqrt(Math.pow(pos.x - CENTER, 2) + Math.pow(pos.y - CENTER, 2));
        expect(distance).toBeCloseTo(radius, 1);
      });

      // 隣接要素間の角度が均等
      const angles = positions.map(pos => {
        const dx = pos.x - CENTER;
        const dy = CENTER - pos.y; // SVG y軸反転を考慮
        return (Math.atan2(dy, dx) * 180) / Math.PI;
      });

      for (let i = 0; i < angles.length - 1; i++) {
        const diff = Math.abs(angles[i] - angles[i + 1]);
        // 角度差が一定（セクター範囲 / (total + 1)）
        const expectedDiff = (end - start) / (total + 1);
        expect(diff).toBeCloseTo(expectedDiff, 1);
      }
    });
  });

  describe('getCenter', () => {
    test('正常ケース: 中心座標を返す', () => {
      const center = CoordinateSystem.getCenter();
      expect(center.x).toBe(CENTER);
      expect(center.y).toBe(CENTER);
    });
  });

  describe('CoordinateConstants', () => {
    test('正常ケース: 半径定数が正しく定義されている', () => {
      // すべての半径が非負
      Object.values(R).forEach(radius => {
        expect(radius).toBeGreaterThanOrEqual(0);
      });

      // レイヤー順序が正しい（内側から外側へ）
      expect(R.FOUNDATION_CENTER).toBe(0);
      expect(R.FOUNDATION_INNER).toBeLessThan(R.FOUNDATION_OUTER);
      expect(R.PATTERN_INNER).toBeLessThan(R.PATTERN_MID);
      expect(R.PATTERN_MID).toBeLessThan(R.PATTERN_OUTER);
      expect(R.INSTANCE_INNER).toBeLessThan(R.INSTANCE_MID);
      expect(R.INSTANCE_MID).toBeLessThan(R.INSTANCE_OUTER);
      expect(R.KEY_MAJOR).toBeLessThan(R.KEY_MINOR);
    });

    test('正常ケース: セクター定数が正しく定義されている', () => {
      // すべてのセクターが0-360度の範囲内
      Object.values(SECTOR).forEach(sector => {
        expect(sector.start).toBeGreaterThanOrEqual(0);
        expect(sector.start).toBeLessThan(360);
        expect(sector.end).toBeGreaterThanOrEqual(0);
        expect(sector.end).toBeLessThanOrEqual(360);
      });

      // ALLセクターが全範囲をカバー
      expect(SECTOR.ALL.start).toBe(0);
      expect(SECTOR.ALL.end).toBe(360);
    });
  });
});
