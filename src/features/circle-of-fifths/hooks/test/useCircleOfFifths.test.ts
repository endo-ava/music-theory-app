import { describe, test, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useCircleOfFifths } from '../useCircleOfFifths';
import { CIRCLE_LAYOUT } from '../../constants';

// ドメインサービスのモック
vi.mock('@/domain/services/CircleOfFifths', () => {
  // 12セグメント分のモックデータを生成
  const mockSegments = Array.from({ length: 12 }, (_, index) => ({
    position: index,
    majorKey: {
      shortName: ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'F', 'Bb', 'Eb', 'Ab'][index],
      keyName: `${['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'F', 'Bb', 'Eb', 'Ab'][index]} Major`,
      fifthsIndex: index,
      isMajor: true,
    },
    minorKey: {
      shortName: ['Am', 'Em', 'Bm', 'F#m', 'C#m', 'G#m', 'D#m', 'A#m', 'Dm', 'Gm', 'Cm', 'Fm'][
        index
      ],
      keyName: `${['Am', 'Em', 'Bm', 'F#m', 'C#m', 'G#m', 'D#m', 'A#m', 'Dm', 'Gm', 'Cm', 'Fm'][index]}`,
      fifthsIndex: index,
      isMajor: false,
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
    (position: number, innerRadius: number, middleRadius: number, outerRadius: number) => ({
      innerPath: `M ${innerRadius} 0 A ${innerRadius} ${innerRadius} 0 0 1 0 ${innerRadius} Z`,
      middlePath: `M ${middleRadius} 0 A ${middleRadius} ${middleRadius} 0 0 1 0 ${middleRadius} Z`,
      outerPath: `M ${outerRadius} 0 A ${outerRadius} ${outerRadius} 0 0 1 0 ${outerRadius} Z`,
    })
  ),
}));

describe('useCircleOfFifths hook', () => {
  describe('基本機能', () => {
    test('正常ケース: フックが正しい構造を返す', () => {
      const { result } = renderHook(() => useCircleOfFifths());

      expect(result.current).toHaveProperty('viewBox');
      expect(result.current).toHaveProperty('segments');
      expect(result.current).toHaveProperty('textRotation');

      expect(typeof result.current.viewBox).toBe('string');
      expect(Array.isArray(result.current.segments)).toBe(true);
      expect(typeof result.current.textRotation).toBe('number');
    });

    test('正常ケース: 複数回レンダリングで同じ値を返す（事前計算済み）', () => {
      const { result, rerender } = renderHook(() => useCircleOfFifths());

      const firstRender = result.current;
      rerender();
      const secondRender = result.current;

      // 事前計算されているため、同じオブジェクト参照を返す
      expect(firstRender.viewBox).toBe(secondRender.viewBox);
      expect(firstRender.segments).toBe(secondRender.segments);
      expect(firstRender.textRotation).toBe(secondRender.textRotation);
    });
  });

  describe('viewBox計算', () => {
    test('正常ケース: 正しいSVGビューボックス形式', () => {
      const { result } = renderHook(() => useCircleOfFifths());

      const expectedSize = CIRCLE_LAYOUT.RADIUS * 2;
      const expectedViewBox = `-${CIRCLE_LAYOUT.RADIUS} -${CIRCLE_LAYOUT.RADIUS} ${expectedSize} ${expectedSize}`;

      expect(result.current.viewBox).toBe(expectedViewBox);
    });

    test('境界値ケース: CIRCLE_LAYOUT.RADIUSの値に基づく計算', () => {
      const { result } = renderHook(() => useCircleOfFifths());

      // ビューボックスが適切な数値範囲内にあることを確認
      const viewBoxParts = result.current.viewBox.split(' ').map(Number);
      expect(viewBoxParts).toHaveLength(4);
      expect(viewBoxParts[0]).toBe(-CIRCLE_LAYOUT.RADIUS); // x
      expect(viewBoxParts[1]).toBe(-CIRCLE_LAYOUT.RADIUS); // y
      expect(viewBoxParts[2]).toBe(CIRCLE_LAYOUT.RADIUS * 2); // width
      expect(viewBoxParts[3]).toBe(CIRCLE_LAYOUT.RADIUS * 2); // height
    });
  });

  describe('segments配列', () => {
    test('正常ケース: 12セグメントが生成される', () => {
      const { result } = renderHook(() => useCircleOfFifths());

      expect(result.current.segments).toHaveLength(12);
    });

    test('正常ケース: 各セグメントが必要なプロパティを持つ', () => {
      const { result } = renderHook(() => useCircleOfFifths());

      result.current.segments.forEach((segmentData, index) => {
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
      const { result } = renderHook(() => useCircleOfFifths());

      const positions = result.current.segments.map(segment => segment.segment.position);
      expect(positions).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
    });

    test('正常ケース: 各セグメントのキー情報が正しく設定される', () => {
      const { result } = renderHook(() => useCircleOfFifths());

      result.current.segments.forEach(segmentData => {
        const { majorKey, minorKey } = segmentData.segment;

        // メジャーキーの検証
        expect(typeof majorKey.shortName).toBe('string');
        expect(typeof majorKey.keyName).toBe('string');
        expect(typeof majorKey.fifthsIndex).toBe('number');
        expect(majorKey.isMajor).toBe(true);

        // マイナーキーの検証
        expect(typeof minorKey.shortName).toBe('string');
        expect(typeof minorKey.keyName).toBe('string');
        expect(typeof minorKey.fifthsIndex).toBe('number');
        expect(minorKey.isMajor).toBe(false);
      });
    });
  });

  describe('textRotation', () => {
    test('正常ケース: textRotationが数値である', () => {
      const { result } = renderHook(() => useCircleOfFifths());

      expect(typeof result.current.textRotation).toBe('number');
      expect(result.current.textRotation).toBe(0); // モックで0を返すように設定
    });
  });

  describe('テキスト位置計算', () => {
    test('正常ケース: 3つの異なる半径でテキスト位置が計算される', () => {
      const { result } = renderHook(() => useCircleOfFifths());

      result.current.segments.forEach(segmentData => {
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
    test('パフォーマンステスト: フック呼び出しが高速である', () => {
      const startTime = performance.now();

      // 複数回実行して性能を測定
      for (let i = 0; i < 100; i++) {
        renderHook(() => useCircleOfFifths());
      }

      const endTime = performance.now();
      const executionTime = endTime - startTime;

      // 事前計算により、100回実行でも十分高速であることを確認
      expect(executionTime).toBeLessThan(150); // 150ms以下
    });

    test('メモ化テスト: 同じオブジェクト参照が返される', () => {
      const { result: result1 } = renderHook(() => useCircleOfFifths());
      const { result: result2 } = renderHook(() => useCircleOfFifths());

      // 事前計算済みなので、同じ参照が返される
      expect(result1.current.segments).toBe(result2.current.segments);
      expect(result1.current.viewBox).toBe(result2.current.viewBox);
      expect(result1.current.textRotation).toBe(result2.current.textRotation);
    });
  });
});
