/**
 * 共通円形パス生成ユーティリティのテスト
 *
 * generatePizzaSlicePathとgenerateMultiLayerPathsの単体テスト。
 * これらの関数は五度圏とクロマチックサークルの両方で使用される。
 */

import { describe, test, expect } from 'vitest';
import { generatePizzaSlicePath, generateMultiLayerPaths } from '../circlePathGeneration';

describe('circlePathGeneration utils', () => {
  describe('generatePizzaSlicePath', () => {
    test('正常ケース: 有効なパラメータで正しいSVGパスを生成', () => {
      const path = generatePizzaSlicePath(0, 50, 100);

      // SVGパスの基本構造をチェック
      expect(path).toMatch(/^M\s+[\d.-]+\s+[\d.-]+/); // M (move to) で始まる
      expect(path).toContain('L'); // L (line to) を含む
      expect(path).toContain('A'); // A (arc) を含む
      expect(path).toContain('Z'); // Z (close path) で終わる

      // パスが文字列として適切に生成されているか
      expect(typeof path).toBe('string');
      expect(path.length).toBeGreaterThan(0);
    });

    test('正常ケース: 複数の位置で一貫したパス構造を生成', () => {
      for (let position = 0; position < 12; position++) {
        const path = generatePizzaSlicePath(position, 80, 150);

        // 各パスが適切な構造を持つことを確認
        expect(path).toMatch(/^M\s+[\d.-]+\s+[\d.-]+.*Z$/);
        expect(path.split('M').length).toBe(2); // M は1回のみ
        expect(path.split('A').length).toBe(3); // A は2回（内側と外側の弧）
        expect(path.split('L').length).toBe(3); // L は2回（放射線）
      }
    });

    test('正常ケース: 異なる半径で異なるパスを生成', () => {
      const path1 = generatePizzaSlicePath(0, 50, 100);
      const path2 = generatePizzaSlicePath(0, 60, 120);

      // 異なる半径では異なるパスが生成される
      expect(path1).not.toBe(path2);
    });

    test('正常ケース: 異なる位置で異なるパスを生成', () => {
      const path1 = generatePizzaSlicePath(0, 50, 100);
      const path2 = generatePizzaSlicePath(1, 50, 100);

      // 異なる位置では異なるパスが生成される
      expect(path1).not.toBe(path2);
    });

    test('境界値ケース: large-arc-flagの計算が正しい', () => {
      // 12分割の円形レイアウトでは各セグメントが30度なので、large-arc-flagは常に0
      const path = generatePizzaSlicePath(0, 50, 100);

      // 円弧コマンドのlarge-arc-flagを抽出
      const arcCommands = path.match(/A\s+[\d.-]+\s+[\d.-]+\s+\d+\s+(\d+)/g);
      expect(arcCommands).not.toBeNull();

      if (arcCommands) {
        arcCommands.forEach((arcCommand: string) => {
          const flagMatch = arcCommand.match(/A\s+[\d.-]+\s+[\d.-]+\s+\d+\s+(\d+)/);
          expect(flagMatch).not.toBeNull();
          if (flagMatch) {
            const largeArcFlag = parseInt(flagMatch[1]);
            expect(largeArcFlag).toBe(0); // 30度のセグメントなのでlarge-arc-flagは0
          }
        });
      }
    });

    test('正常ケース: 内側半径0でも正しく動作', () => {
      // 中心から外側への完全なピザスライス
      const path = generatePizzaSlicePath(0, 0, 100);

      expect(path).toBeTruthy();
      expect(path).toMatch(/^M.*Z$/);
      expect(path).toContain('A');
      expect(path).toContain('L');
    });

    test('正常ケース: 大きな半径でも正しく動作', () => {
      const path = generatePizzaSlicePath(0, 500, 1000);

      expect(path).toBeTruthy();
      expect(path).toMatch(/^M.*Z$/);
      expect(path).toContain('A');
      expect(path).toContain('L');
    });
  });

  describe('generateMultiLayerPaths', () => {
    test('正常ケース: 2層構造のパスを生成（クロマチックサークル想定）', () => {
      const radii = [90, 175, 200]; // CENTER_RADIUS, MIDDLE_RADIUS, RADIUS
      const paths = generateMultiLayerPaths(0, radii);

      expect(paths).toHaveLength(2);
      expect(paths[0]).toBeTruthy(); // ピッチクラス表示エリア
      expect(paths[1]).toBeTruthy(); // 調号エリア

      // 各パスが有効なSVGパス
      paths.forEach(path => {
        expect(path).toMatch(/^M.*Z$/);
        expect(path).toContain('A');
        expect(path).toContain('L');
      });
    });

    test('正常ケース: 3層構造のパスを生成（五度圏想定）', () => {
      const radii = [90, 130, 175, 200]; // CENTER_RADIUS, INNER_RADIUS, MIDDLE_RADIUS, RADIUS
      const paths = generateMultiLayerPaths(0, radii);

      expect(paths).toHaveLength(3);
      expect(paths[0]).toBeTruthy(); // マイナーキーエリア
      expect(paths[1]).toBeTruthy(); // メジャーキーエリア
      expect(paths[2]).toBeTruthy(); // 調号エリア

      // 各パスが有効なSVGパス
      paths.forEach(path => {
        expect(path).toMatch(/^M.*Z$/);
        expect(path).toContain('A');
        expect(path).toContain('L');
      });
    });

    test('正常ケース: 各層のパスが異なる', () => {
      const radii = [90, 130, 175, 200];
      const paths = generateMultiLayerPaths(5, radii);

      // 各層で異なる半径範囲のため、異なるパスが生成される
      expect(paths[0]).not.toBe(paths[1]);
      expect(paths[1]).not.toBe(paths[2]);
      expect(paths[0]).not.toBe(paths[2]);
    });

    test('正常ケース: 全ての位置で一貫した層数を生成', () => {
      const radii = [90, 130, 175, 200];

      for (let position = 0; position < 12; position++) {
        const paths = generateMultiLayerPaths(position, radii);

        expect(paths).toHaveLength(3);
        paths.forEach(path => {
          expect(path).toBeTruthy();
          expect(path).toMatch(/^M.*Z$/);
        });
      }
    });

    test('正常ケース: 4層以上の構造にも対応', () => {
      const radii = [50, 100, 150, 200, 250]; // 5つの半径 = 4層
      const paths = generateMultiLayerPaths(0, radii);

      expect(paths).toHaveLength(4);
      paths.forEach(path => {
        expect(path).toBeTruthy();
        expect(path).toMatch(/^M.*Z$/);
      });
    });

    test('正常ケース: 最小構成（2つの半径=1層）でも動作', () => {
      const radii = [50, 100];
      const paths = generateMultiLayerPaths(0, radii);

      expect(paths).toHaveLength(1);
      expect(paths[0]).toBeTruthy();
      expect(paths[0]).toMatch(/^M.*Z$/);
    });

    test('正常ケース: 異なる位置で異なるパスを生成', () => {
      const radii = [90, 175, 200];
      const paths0 = generateMultiLayerPaths(0, radii);
      const paths1 = generateMultiLayerPaths(1, radii);

      // 異なる位置では異なるパスが生成される
      expect(paths0[0]).not.toBe(paths1[0]);
      expect(paths0[1]).not.toBe(paths1[1]);
    });

    test('正常ケース: 半径配列の順序が結果に反映される', () => {
      const radii = [90, 130, 175, 200];
      const paths = generateMultiLayerPaths(0, radii);

      // 最初の層は最も内側（90-130）、最後の層は最も外側（175-200）
      // 外側の層の方がパスが長くなるはず
      expect(paths[2].length).toBeGreaterThan(paths[0].length);
    });
  });

  describe('統合テスト: generatePizzaSlicePath と generateMultiLayerPaths の整合性', () => {
    test('generateMultiLayerPathsの各層はgeneratePizzaSlicePathと同じ結果', () => {
      const position = 3;
      const radii = [90, 130, 175, 200];

      // generateMultiLayerPathsで生成
      const multiLayerPaths = generateMultiLayerPaths(position, radii);

      // generatePizzaSlicePathで個別に生成
      const path1 = generatePizzaSlicePath(position, radii[0], radii[1]);
      const path2 = generatePizzaSlicePath(position, radii[1], radii[2]);
      const path3 = generatePizzaSlicePath(position, radii[2], radii[3]);

      // 結果が一致することを確認
      expect(multiLayerPaths[0]).toBe(path1);
      expect(multiLayerPaths[1]).toBe(path2);
      expect(multiLayerPaths[2]).toBe(path3);
    });
  });
});
