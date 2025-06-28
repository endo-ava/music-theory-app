import { useMemo } from 'react';
import { CIRCLE_SEGMENTS, CIRCLE_LAYOUT } from '../constants';
import { CircleSegment, Point, SegmentPaths } from '@/types/circleOfFifths';
import { calculateTextPosition, calculateTextRotation } from '../utils/geometry';
import { generateThreeSegmentPaths } from '../utils/pathGeneration';

/**
 * 五度圏の単一セグメントを描画するためのデータセット。
 * 静的な定義と動的に計算された描画情報をひとまとめにする。
 */
export interface SegmentData {
  /** 元となるセグメントの静的データ（キー、ポジションなど）。 */
  segment: CircleSegment;
  /** SVG <path> のd属性に使われる、描画用のパスデータ。 */
  paths: SegmentPaths;
  /** 各種テキスト要素（短調、長調、調号）の配置座標 (x, y)。 */
  textPositions: {
    minorTextPos: Point;
    majorTextPos: Point;
    signatureTextPos: Point;
  };
}

/**
 * 五度圏（Circle of Fifths）の描画に必要な計算ロジックを提供するカスタムフック。
 * SVGのビューボックス、各セグメントのパスデータ、テキスト座標などをメモ化して算出する。
 * このフックは計算に特化しており、UIのレンダリングは行わない（関心の分離）。
 * @returns {{
 * viewBox: string;
 * segments: SegmentData[];
 * textRotation: number;
 * }} 描画に必要なプロパティを含むオブジェクト。
 */
export const useCircleOfFifths = () => {
  // SVGのビューボックス属性を計算。円がアートボードにちょうど収まるように設定。
  const viewBox = useMemo(() => {
    const size = CIRCLE_LAYOUT.RADIUS * 2;
    return `-${CIRCLE_LAYOUT.RADIUS} -${CIRCLE_LAYOUT.RADIUS} ${size} ${size}`;
  }, []); // CIRCLE_LAYOUTは不変な定数なので、依存配列は空で初回のみ計算。

  // 全セグメントの描画データを一度の計算でまとめて生成し、メモ化する。(再レンダリング時の不要な計算コストを削減)
  const segments = useMemo<SegmentData[]>(() => {
    return CIRCLE_SEGMENTS.map(segment => {
      const { position } = segment;

      // 3つの同心円弧からなるセグメントのパスを生成
      const paths = generateThreeSegmentPaths(
        position,
        CIRCLE_LAYOUT.INNER_RADIUS,
        CIRCLE_LAYOUT.MIDDLE_RADIUS,
        CIRCLE_LAYOUT.RADIUS
      );

      // 各領域の中心にテキストを配置するための座標を計算
      const textPositions = {
        minorTextPos: calculateTextPosition(position, CIRCLE_LAYOUT.INNER_RADIUS / 1.2),
        majorTextPos: calculateTextPosition(
          position,
          (CIRCLE_LAYOUT.INNER_RADIUS + CIRCLE_LAYOUT.MIDDLE_RADIUS) / 2
        ),
        signatureTextPos: calculateTextPosition(
          position,
          (CIRCLE_LAYOUT.MIDDLE_RADIUS + CIRCLE_LAYOUT.RADIUS) / 2
        ),
      };

      return {
        segment,
        paths,
        textPositions,
      };
    });
  }, []);

  // テキスト要素を円の向きに合わせるための統一の回転角度を計算。
  const textRotation = useMemo(() => calculateTextRotation(), []);

  // 算出された全ての値をオブジェクトとして集約し、コンポーネントに提供する。
  return { viewBox, segments, textRotation };
};
