import { CIRCLE_LAYOUT, TEXT_RADIUS } from '../constants';
import type { Point } from '@/shared/types/graphics';
import type { SegmentPaths } from '../types';
import { calculateTextPosition, calculateTextRotation } from '../utils/geometry';
import { generateThreeSegmentPaths } from '../utils/pathGeneration';
import { CircleOfFifthsService, CircleSegmentDTO } from '@/domain/services/CircleOfFifths';

/**
 * 五度圏の単一セグメントを描画するためのデータセット。
 * 静的な定義と動的に計算された描画情報をひとまとめにする。
 */
export interface SegmentData {
  /** 元となるセグメントの静的データ（キー、ポジションなど）。 */
  segment: CircleSegmentDTO;
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
 * 五度圏（Circle of Fifths）の描画に必要な、事前計算済みのデータセットを提供する関数。
 * SVGのビューボックス、各セグメントのパスデータ、テキスト座標などを返す。
 * この関数は計算に特化しており、UIのレンダリングは行わない（関心の分離）。
 * @returns {{
 * viewBox: string;
 * segments: SegmentData[];
 * textRotation: number;
 * }} 描画に必要なプロパティを含むオブジェクト。
 */
// 固定値の事前計算（モジュールレベルで一度だけ実行）
const PRECOMPUTED_VIEW_BOX = (() => {
  const size = CIRCLE_LAYOUT.RADIUS * 2;
  return `-${CIRCLE_LAYOUT.RADIUS} -${CIRCLE_LAYOUT.RADIUS} ${size} ${size}`;
})();

const PRECOMPUTED_SEGMENTS: SegmentData[] = CircleOfFifthsService.getSegmentDTOs().map(segment => {
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
    minorTextPos: calculateTextPosition(position, TEXT_RADIUS.MINOR),
    majorTextPos: calculateTextPosition(position, TEXT_RADIUS.MAJOR),
    signatureTextPos: calculateTextPosition(position, TEXT_RADIUS.SIGNATURE),
  };

  return {
    segment,
    paths,
    textPositions,
  };
});

const PRECOMPUTED_TEXT_ROTATION = calculateTextRotation();

export const getCircleOfFifthsData = () => {
  // 事前計算済みの固定値をそのまま返す
  return {
    viewBox: PRECOMPUTED_VIEW_BOX,
    segments: PRECOMPUTED_SEGMENTS,
    textRotation: PRECOMPUTED_TEXT_ROTATION,
  };
};
