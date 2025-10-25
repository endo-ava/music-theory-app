/**
 * 五度圏のpathGeneration統合テスト
 *
 * generateThreeSegmentPaths関数のテスト。
 * generatePizzaSlicePathは共通ユーティリティに移動したため、
 * 共通ユーティリティのテストファイルでカバーされる。
 */

import { describe, test, expect } from 'vitest';
import { generateThreeSegmentPaths } from '../pathGeneration';
import { CircleOfFifthsService } from '@/domain/services/CircleOfFifths';

describe('Five度圏 pathGeneration', () => {
  describe('generateThreeSegmentPaths', () => {
    test('正常ケース: 3層構造のパスを正しく生成', () => {
      const result = generateThreeSegmentPaths(0);

      // 3つのパスが生成されることを確認
      expect(result).toHaveProperty('minorPath');
      expect(result).toHaveProperty('majorPath');
      expect(result).toHaveProperty('signaturePath');

      // 各パスが有効なSVGパス文字列であることを確認
      expect(typeof result.minorPath).toBe('string');
      expect(typeof result.majorPath).toBe('string');
      expect(typeof result.signaturePath).toBe('string');

      // SVGパスの基本構造を確認（M で始まり Z で終わる）
      expect(result.minorPath).toMatch(/^M.*Z$/);
      expect(result.majorPath).toMatch(/^M.*Z$/);
      expect(result.signaturePath).toMatch(/^M.*Z$/);
    });

    test('正常ケース: 各層のパスが異なる内容で生成される', () => {
      const result = generateThreeSegmentPaths(3); // 位置3（A/F#m）

      // パスが正しく生成されることを確認
      expect(result.minorPath).toBeTruthy();
      expect(result.majorPath).toBeTruthy();
      expect(result.signaturePath).toBeTruthy();

      // 各パスが異なる半径範囲で生成されているため、内容が異なることを確認
      expect(result.minorPath).not.toBe(result.majorPath);
      expect(result.majorPath).not.toBe(result.signaturePath);
      expect(result.minorPath).not.toBe(result.signaturePath);
    });

    test('正常ケース: 全ての位置(0-11)で一貫したパス生成', () => {
      for (let position = 0; position < CircleOfFifthsService.SEGMENT_COUNT; position++) {
        const result = generateThreeSegmentPaths(position);

        // 各パスが正しく生成されることを確認
        expect(result.minorPath).toBeTruthy();
        expect(result.majorPath).toBeTruthy();
        expect(result.signaturePath).toBeTruthy();

        // 各パスが有効なSVGパス形式であることを確認
        expect(result.minorPath).toMatch(/^M.*Z$/);
        expect(result.majorPath).toMatch(/^M.*Z$/);
        expect(result.signaturePath).toMatch(/^M.*Z$/);

        // パスの長さがゼロでないことを確認
        expect(result.minorPath.length).toBeGreaterThan(0);
        expect(result.majorPath.length).toBeGreaterThan(0);
        expect(result.signaturePath.length).toBeGreaterThan(0);
      }
    });

    test('正常ケース: 各層の半径が正しく適用される', () => {
      const result = generateThreeSegmentPaths(0);

      // 各パスが異なる半径範囲で生成されているため、内容が異なることを確認
      expect(result.minorPath).not.toBe(result.majorPath);
      expect(result.majorPath).not.toBe(result.signaturePath);

      // パスの長さも異なるはず（異なる半径で異なるパス長）
      expect(result.minorPath.length).toBeGreaterThan(0);
      expect(result.majorPath.length).toBeGreaterThan(0);
      expect(result.signaturePath.length).toBeGreaterThan(0);
    });

    test('正常ケース: 連続する位置で異なるパスが生成される', () => {
      const result0 = generateThreeSegmentPaths(0);
      const result1 = generateThreeSegmentPaths(1);

      // 異なる位置では異なるパスが生成される
      expect(result0.minorPath).not.toBe(result1.minorPath);
      expect(result0.majorPath).not.toBe(result1.majorPath);
      expect(result0.signaturePath).not.toBe(result1.signaturePath);
    });

    test('正常ケース: 五度圏の各層構造が保持される', () => {
      const result = generateThreeSegmentPaths(6);

      // 各層のパスに円弧コマンド(A)が含まれていることを確認
      expect(result.minorPath).toContain('A');
      expect(result.majorPath).toContain('A');
      expect(result.signaturePath).toContain('A');

      // 各層のパスに直線コマンド(L)が含まれていることを確認
      expect(result.minorPath).toContain('L');
      expect(result.majorPath).toContain('L');
      expect(result.signaturePath).toContain('L');
    });
  });
});
