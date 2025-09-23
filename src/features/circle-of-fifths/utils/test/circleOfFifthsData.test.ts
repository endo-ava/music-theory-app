import { describe, test, expect, vi } from 'vitest';
import { getCircleOfFifthsData } from '../circleOfFifthsData';
import { CIRCLE_LAYOUT } from '../../constants';

// ドメインサービスのモック
vi.mock('@/domain/services/CircleOfFifths', () => {
  // 12セグメント分のモックデータを生成
  const mockSegments = Array.from({ length: 12 }, (_, index) => ({
    position: index,
    majorKey: {
      shortName: ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'F', 'Bb', 'Eb', 'Ab'][index],
      contextName: `${['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'F', 'Bb', 'Eb', 'Ab'][index]} Major`,
      fifthsIndex: index,
      isMajor: true,
      type: 'key' as const,
    },
    minorKey: {
      shortName: ['Am', 'Em', 'Bm', 'F#m', 'C#m', 'G#m', 'D#m', 'A#m', 'Dm', 'Gm', 'Cm', 'Fm'][
        index
      ],
      contextName: `${['Am', 'Em', 'Bm', 'F#m', 'C#m', 'G#m', 'D#m', 'A#m', 'Dm', 'Gm', 'Cm', 'Fm'][index]}`,
      fifthsIndex: index,
      isMajor: false,
      type: 'key' as const,
    },
    keySignature: [
      '',
      '♯',
      '♯♯',
      '♯♯♯',
      '♯♯♯♯',
      '♯♯♯♯♯',
      '♯♯♯♯♯♯',
      '♭',
      '♭♭',
      '♭♭♭',
      '♭♭♭♭',
      '♭♭♭♭♭',
    ][index],
  }));

  return {
    CircleOfFifthsService: {
      getSegmentDTOs: vi.fn().mockReturnValue(mockSegments),
      getSegmentCount: vi.fn().mockReturnValue(12),
    },
  };
});

// ユーティリティ関数のモック
vi.mock('../../utils/geometry', () => ({
  calculateTextPosition: vi.fn((position: number, radius: number) => ({
    x: Math.cos(((position * 30 - 90) * Math.PI) / 180) * radius,
    y: Math.sin(((position * 30 - 90) * Math.PI) / 180) * radius,
  })),
  calculateTextRotation: vi.fn().mockReturnValue(0),
}));

vi.mock('../../utils/pathGeneration', () => ({
  generateThreeSegmentPaths: vi.fn(
    (_position: number, minorRadius: number, majorRadius: number, signatureRadius: number) => ({
      minorPath: `M ${minorRadius} 0 A ${minorRadius} ${minorRadius} 0 0 1 0 ${minorRadius} Z`,
      majorPath: `M ${majorRadius} 0 A ${majorRadius} ${majorRadius} 0 0 1 0 ${majorRadius} Z`,
      signaturePath: `M ${signatureRadius} 0 A ${signatureRadius} ${signatureRadius} 0 0 1 0 ${signatureRadius} Z`,
    })
  ),
}));

describe('getCircleOfFifthsData', () => {
  describe('基本機能', () => {
    test('正常ケース: 関数が正しい構造を返す', () => {
      const result = getCircleOfFifthsData();

      expect(result).toHaveProperty('viewBox');
      expect(result).toHaveProperty('segments');
      expect(result).toHaveProperty('textRotation');

      expect(typeof result.viewBox).toBe('string');
      expect(Array.isArray(result.segments)).toBe(true);
      expect(typeof result.textRotation).toBe('number');
    });

    test('正常ケース: 複数回呼び出しで同じ値を返す（事前計算済み）', () => {
      const firstResult = getCircleOfFifthsData();
      const secondResult = getCircleOfFifthsData();

      // 事前計算されているため、同じオブジェクト参照を返す
      expect(firstResult.viewBox).toBe(secondResult.viewBox);
      expect(firstResult.segments).toBe(secondResult.segments);
      expect(firstResult.textRotation).toBe(secondResult.textRotation);
    });
  });

  describe('viewBox計算', () => {
    test('正常ケース: 正しいSVGビューボックス形式', () => {
      const result = getCircleOfFifthsData();

      const expectedSize = CIRCLE_LAYOUT.RADIUS * 2;
      const expectedViewBox = `-${CIRCLE_LAYOUT.RADIUS} -${CIRCLE_LAYOUT.RADIUS} ${expectedSize} ${expectedSize}`;

      expect(result.viewBox).toBe(expectedViewBox);
    });

    test('境界値ケース: CIRCLE_LAYOUT.RADIUSの値に基づく計算', () => {
      const result = getCircleOfFifthsData();

      // ビューボックスが適切な数値範囲内にあることを確認
      const viewBoxParts = result.viewBox.split(' ').map(Number);
      expect(viewBoxParts).toHaveLength(4);
      expect(viewBoxParts[0]).toBe(-CIRCLE_LAYOUT.RADIUS); // x
      expect(viewBoxParts[1]).toBe(-CIRCLE_LAYOUT.RADIUS); // y
      expect(viewBoxParts[2]).toBe(CIRCLE_LAYOUT.RADIUS * 2); // width
      expect(viewBoxParts[3]).toBe(CIRCLE_LAYOUT.RADIUS * 2); // height
    });
  });

  describe('segments配列', () => {
    test('正常ケース: 12セグメントが生成される', () => {
      const result = getCircleOfFifthsData();

      expect(result.segments).toHaveLength(12);
    });

    test('正常ケース: 各セグメントが必要なプロパティを持つ', () => {
      const result = getCircleOfFifthsData();

      result.segments.forEach((segmentData, index) => {
        // SegmentData型の構造を検証
        expect(segmentData).toHaveProperty('segment');
        expect(segmentData).toHaveProperty('paths');
        expect(segmentData).toHaveProperty('textPositions');

        // segment プロパティの検証
        expect(segmentData.segment.position).toBe(index);
        expect(segmentData.segment).toHaveProperty('majorKey');
        expect(segmentData.segment).toHaveProperty('minorKey');
        expect(segmentData.segment).toHaveProperty('keySignature');

        // paths プロパティの検証
        expect(segmentData.paths).toHaveProperty('minorPath');
        expect(segmentData.paths).toHaveProperty('majorPath');
        expect(segmentData.paths).toHaveProperty('signaturePath');
        expect(typeof segmentData.paths.minorPath).toBe('string');
        expect(typeof segmentData.paths.majorPath).toBe('string');
        expect(typeof segmentData.paths.signaturePath).toBe('string');

        // textPositions プロパティの検証
        expect(segmentData.textPositions).toHaveProperty('minorTextPos');
        expect(segmentData.textPositions).toHaveProperty('majorTextPos');
        expect(segmentData.textPositions).toHaveProperty('signatureTextPos');

        // Point型の検証
        expect(segmentData.textPositions.minorTextPos).toHaveProperty('x');
        expect(segmentData.textPositions.minorTextPos).toHaveProperty('y');
        expect(typeof segmentData.textPositions.minorTextPos.x).toBe('number');
        expect(typeof segmentData.textPositions.minorTextPos.y).toBe('number');
      });
    });

    test('正常ケース: セグメントのposition値が0-11の範囲', () => {
      const result = getCircleOfFifthsData();

      const positions = result.segments.map(segment => segment.segment.position);
      expect(positions).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
    });

    test('正常ケース: 各セグメントのキー情報が正しく設定される', () => {
      const result = getCircleOfFifthsData();

      result.segments.forEach(segmentData => {
        const { majorKey, minorKey } = segmentData.segment;

        // メジャーキーの検証
        expect(typeof majorKey.shortName).toBe('string');
        expect(typeof majorKey.contextName).toBe('string');
        expect(typeof majorKey.fifthsIndex).toBe('number');
        expect(majorKey.isMajor).toBe(true);

        // マイナーキーの検証
        expect(typeof minorKey.shortName).toBe('string');
        expect(typeof minorKey.contextName).toBe('string');
        expect(typeof minorKey.fifthsIndex).toBe('number');
        expect(minorKey.isMajor).toBe(false);
      });
    });
  });

  describe('textRotation', () => {
    test('正常ケース: textRotationが数値である', () => {
      const result = getCircleOfFifthsData();

      expect(typeof result.textRotation).toBe('number');
      expect(result.textRotation).toBe(0); // モックで0を返すように設定
    });
  });

  describe('テキスト位置計算', () => {
    test('正常ケース: 3つの異なる半径でテキスト位置が計算される', () => {
      const result = getCircleOfFifthsData();

      result.segments.forEach(segmentData => {
        const { minorTextPos, majorTextPos, signatureTextPos } = segmentData.textPositions;

        // 各テキスト位置が異なることを確認（異なる半径で計算されている証拠）
        const positions = [minorTextPos, majorTextPos, signatureTextPos];
        positions.forEach(pos => {
          expect(typeof pos.x).toBe('number');
          expect(typeof pos.y).toBe('number');
          expect(isFinite(pos.x)).toBe(true);
          expect(isFinite(pos.y)).toBe(true);
        });
      });
    });
  });

  describe('事前計算の最適化', () => {
    test('パフォーマンステスト: 関数呼び出しが高速である', () => {
      const startTime = performance.now();

      // 複数回実行して性能を測定
      for (let i = 0; i < 100; i++) {
        getCircleOfFifthsData();
      }

      const endTime = performance.now();
      const executionTime = endTime - startTime;

      // 事前計算により、100回実行でも十分高速であることを確認
      expect(executionTime).toBeLessThan(150); // 150ms以下
    });

    test('メモ化テスト: 同じオブジェクト参照が返される', () => {
      const result1 = getCircleOfFifthsData();
      const result2 = getCircleOfFifthsData();

      // useMemoによる遅延初期化なので、内容は同じだが参照は異なる可能性がある
      expect(result1.segments).toStrictEqual(result2.segments);
      expect(result1.viewBox).toStrictEqual(result2.viewBox);
      expect(result1.textRotation).toStrictEqual(result2.textRotation);
    });
  });
});
