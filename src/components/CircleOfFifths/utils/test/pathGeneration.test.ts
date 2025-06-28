import { describe, test, expect } from 'vitest';
import { generatePizzaSlicePath, generateThreeSegmentPaths } from '../pathGeneration';
import { CircleOfFifthsError } from '@/types/circleOfFifths';
import { CIRCLE_LAYOUT } from '../../constants/index';

describe('pathGeneration utils', () => {
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

    test('境界値ケース: large-arc-flagの計算が正しい', () => {
      // 角度差が180度より大きい場合と小さい場合をテスト
      const path = generatePizzaSlicePath(0, 50, 100);
      
      // 五度圏では各セグメントが30度なので、large-arc-flagは常に0になる
      const arcCommands = path.match(/A\s+[\d.-]+\s+[\d.-]+\s+\d+\s+(\d+)/g);
      expect(arcCommands).not.toBeNull();
      
      if (arcCommands) {
        arcCommands.forEach(arcCommand => {
          const flagMatch = arcCommand.match(/A\s+[\d.-]+\s+[\d.-]+\s+\d+\s+(\d+)/);
          expect(flagMatch).not.toBeNull();
          if (flagMatch) {
            const largeArcFlag = parseInt(flagMatch[1]);
            expect(largeArcFlag).toBe(0); // 30度のセグメントなのでlarge-arc-flagは0
          }
        });
      }
    });

    test('異常ケース: 無効な位置でCircleOfFifthsErrorをスロー', () => {
      expect(() => generatePizzaSlicePath(-1, 50, 100)).toThrow(CircleOfFifthsError);
      expect(() => generatePizzaSlicePath(12, 50, 100)).toThrow(CircleOfFifthsError);
      
      try {
        generatePizzaSlicePath(-1, 50, 100);
      } catch (error) {
        expect(error).toBeInstanceOf(CircleOfFifthsError);
        expect((error as CircleOfFifthsError).code).toBe('INVALID_POSITION');
      }
    });

    test('異常ケース: 負の半径でCircleOfFifthsErrorをスロー', () => {
      expect(() => generatePizzaSlicePath(0, -50, 100)).toThrow(CircleOfFifthsError);
      expect(() => generatePizzaSlicePath(0, 50, -100)).toThrow(CircleOfFifthsError);
      
      try {
        generatePizzaSlicePath(0, -50, 100);
      } catch (error) {
        expect(error).toBeInstanceOf(CircleOfFifthsError);
        expect((error as CircleOfFifthsError).code).toBe('INVALID_RADII');
      }
    });

    test('異常ケース: 内側半径≥外側半径でCircleOfFifthsErrorをスロー', () => {
      expect(() => generatePizzaSlicePath(0, 100, 100)).toThrow(CircleOfFifthsError);
      expect(() => generatePizzaSlicePath(0, 150, 100)).toThrow(CircleOfFifthsError);
      
      try {
        generatePizzaSlicePath(0, 100, 100);
      } catch (error) {
        expect(error).toBeInstanceOf(CircleOfFifthsError);
        expect((error as CircleOfFifthsError).code).toBe('INVALID_RADII');
        expect((error as CircleOfFifthsError).message).toContain('inner=100, outer=100');
      }
    });
  });

  describe('generateThreeSegmentPaths', () => {
    test('正常ケース: 有効なパラメータで3つのパスを正しく生成', () => {
      const result = generateThreeSegmentPaths(0, 120, 170, 200);
      
      // 3つのパスが生成されることを確認
      expect(result).toHaveProperty('minorPath');
      expect(result).toHaveProperty('majorPath');
      expect(result).toHaveProperty('signaturePath');
      
      // 各パスが有効なSVGパス文字列であることを確認
      expect(typeof result.minorPath).toBe('string');
      expect(typeof result.majorPath).toBe('string');
      expect(typeof result.signaturePath).toBe('string');
      
      expect(result.minorPath).toMatch(/^M.*Z$/);
      expect(result.majorPath).toMatch(/^M.*Z$/);
      expect(result.signaturePath).toMatch(/^M.*Z$/);
    });

    test('正常ケース: 実際のCIRCLE_LAYOUT値で正しく動作', () => {
      const result = generateThreeSegmentPaths(
        3, // 位置3（A/F#m）
        CIRCLE_LAYOUT.INNER_RADIUS,
        CIRCLE_LAYOUT.MIDDLE_RADIUS,
        CIRCLE_LAYOUT.RADIUS
      );
      
      // パスが正しく生成されることを確認
      expect(result.minorPath).toBeTruthy();
      expect(result.majorPath).toBeTruthy();
      expect(result.signaturePath).toBeTruthy();
      
      // 各パスが異なることを確認（異なる半径で生成されているため）
      expect(result.minorPath).not.toBe(result.majorPath);
      expect(result.majorPath).not.toBe(result.signaturePath);
      expect(result.minorPath).not.toBe(result.signaturePath);
    });

    test('異常ケース: 無効な位置でCircleOfFifthsErrorをスロー', () => {
      expect(() => generateThreeSegmentPaths(-1, 120, 170, 200)).toThrow(CircleOfFifthsError);
      expect(() => generateThreeSegmentPaths(12, 120, 170, 200)).toThrow(CircleOfFifthsError);
      
      try {
        generateThreeSegmentPaths(-1, 120, 170, 200);
      } catch (error) {
        expect(error).toBeInstanceOf(CircleOfFifthsError);
        expect((error as CircleOfFifthsError).code).toBe('INVALID_POSITION');
      }
    });

    test('異常ケース: 負の半径でCircleOfFifthsErrorをスロー', () => {
      expect(() => generateThreeSegmentPaths(0, -120, 170, 200)).toThrow(CircleOfFifthsError);
      expect(() => generateThreeSegmentPaths(0, 120, -170, 200)).toThrow(CircleOfFifthsError);
      expect(() => generateThreeSegmentPaths(0, 120, 170, -200)).toThrow(CircleOfFifthsError);
      
      try {
        generateThreeSegmentPaths(0, -120, 170, 200);
      } catch (error) {
        expect(error).toBeInstanceOf(CircleOfFifthsError);
        expect((error as CircleOfFifthsError).code).toBe('INVALID_RADII');
      }
    });

    test('異常ケース: 半径の順序が正しくない場合でErrorをスロー', () => {
      // minor >= major の場合
      expect(() => generateThreeSegmentPaths(0, 170, 170, 200)).toThrow(CircleOfFifthsError);
      expect(() => generateThreeSegmentPaths(0, 180, 170, 200)).toThrow(CircleOfFifthsError);
      
      // major >= signature の場合
      expect(() => generateThreeSegmentPaths(0, 120, 200, 200)).toThrow(CircleOfFifthsError);
      expect(() => generateThreeSegmentPaths(0, 120, 210, 200)).toThrow(CircleOfFifthsError);
      
      try {
        generateThreeSegmentPaths(0, 170, 170, 200);
      } catch (error) {
        expect(error).toBeInstanceOf(CircleOfFifthsError);
        expect((error as CircleOfFifthsError).code).toBe('INVALID_RADII_ORDER');
        expect((error as CircleOfFifthsError).message).toContain('minor < major < signature');
      }
    });
  });
});