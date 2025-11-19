import { describe, test, expect, vi, beforeEach } from 'vitest';
import { getChromaticCircleData } from '../chromaticCircleData';
import { ChromaticCircleService } from '@/domain/services/ChromaticCircle';
import { CIRCLE_LAYOUT, TEXT_RADIUS } from '../../constants';

// generateTwoLayerPathsをモック化
vi.mock('../pathGeneration', () => ({
  generateTwoLayerPaths: vi.fn((position: number) => ({
    pitchPath: `pitch-path-${position}`,
    signaturePath: `signature-path-${position}`,
  })),
}));

describe('getChromaticCircleData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // ChromaticCircleServiceのキャッシュをクリア
    // @ts-expect-error - テスト用にプライベートプロパティにアクセス
    ChromaticCircleService.segments = undefined;
  });

  describe('正常ケース', () => {
    test('正しいviewBoxを生成する', () => {
      const { viewBox } = getChromaticCircleData();

      const expectedViewBox = `-${CIRCLE_LAYOUT.RADIUS} -${CIRCLE_LAYOUT.RADIUS} ${CIRCLE_LAYOUT.RADIUS * 2} ${CIRCLE_LAYOUT.RADIUS * 2}`;
      expect(viewBox).toBe(expectedViewBox);
    });

    test('12個のセグメントデータを生成する', () => {
      const { segments } = getChromaticCircleData();

      expect(segments).toHaveLength(12);
    });

    test('各セグメントがsegment、paths、textPositionを持つ', () => {
      const { segments } = getChromaticCircleData();

      segments.forEach(segment => {
        expect(segment).toHaveProperty('segment');
        expect(segment).toHaveProperty('paths');
        expect(segment).toHaveProperty('textPosition');
      });
    });

    test('position 0 はCピッチクラスを持つ', () => {
      const { segments } = getChromaticCircleData();

      expect(segments[0].segment.position).toBe(0);
      expect(segments[0].segment.pitchClassName).toBe('C');
    });

    test('position 1 はC#/D♭ピッチクラスを持つ', () => {
      const { segments } = getChromaticCircleData();

      expect(segments[1].segment.position).toBe(1);
      expect(segments[1].segment.pitchClassName).toBe('C#/D♭');
    });

    test('各セグメントがpitchPathとsignaturePathを持つ', () => {
      const { segments } = getChromaticCircleData();

      segments.forEach((segment, index) => {
        expect(segment.paths).toHaveProperty('pitchPath');
        expect(segment.paths).toHaveProperty('signaturePath');
        expect(segment.paths.pitchPath).toBe(`pitch-path-${index}`);
        expect(segment.paths.signaturePath).toBe(`signature-path-${index}`);
      });
    });

    test('各セグメントがtextPosition（x, y）を持つ', () => {
      const { segments } = getChromaticCircleData();

      segments.forEach(segment => {
        expect(segment.textPosition).toHaveProperty('x');
        expect(segment.textPosition).toHaveProperty('y');
        expect(typeof segment.textPosition.x).toBe('number');
        expect(typeof segment.textPosition.y).toBe('number');
      });
    });

    test('textPositionがTEXT_RADIUS.PITCHの半径で計算される', () => {
      const { segments } = getChromaticCircleData();

      // position 0 (12時方向) の場合
      const segment0 = segments[0];
      // 12時方向: 角度270度（3π/2）
      // x = radius * cos(270°) = 0に近い値
      // y = radius * sin(270°) = -radius
      expect(segment0.textPosition.x).toBeCloseTo(0, 1);
      expect(segment0.textPosition.y).toBeCloseTo(-TEXT_RADIUS.PITCH, 1);
    });

    test('すべてのセグメントが一意な位置を持つ', () => {
      const { segments } = getChromaticCircleData();

      const positions = segments.map(s => s.segment.position);
      const uniquePositions = new Set(positions);

      expect(uniquePositions.size).toBe(12);
    });

    test('半音階順（0-11）にセグメントが並んでいる', () => {
      const { segments } = getChromaticCircleData();

      segments.forEach((segment, index) => {
        expect(segment.segment.position).toBe(index);
      });
    });
  });

  describe('データ構造の検証', () => {
    test('segmentDTOがChromaticCircleServiceから取得される', () => {
      const { segments } = getChromaticCircleData();

      const serviceDTOs = ChromaticCircleService.getSegmentDTOs();

      segments.forEach((segment, index) => {
        expect(segment.segment).toEqual(serviceDTOs[index]);
      });
    });

    test('返されるデータがシリアライズ可能である', () => {
      const data = getChromaticCircleData();

      expect(() => JSON.stringify(data)).not.toThrow();

      const serialized = JSON.stringify(data);
      const deserialized = JSON.parse(serialized);

      expect(deserialized).toHaveProperty('viewBox');
      expect(deserialized).toHaveProperty('segments');
      expect(deserialized.segments).toHaveLength(12);
    });
  });
});
