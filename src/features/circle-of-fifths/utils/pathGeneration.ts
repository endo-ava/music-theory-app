/**
 * 五度圏のSVGパス生成ユーティリティ
 *
 * 五度圏固有の3層構造（マイナーキー、メジャーキー、調号）の
 * セグメントパスを生成する。
 */

import { generateMultiLayerPaths } from '@/shared/utils/circlePathGeneration';
import { CIRCLE_LAYOUT } from '../constants/index';
import type { SegmentPaths } from '../types';

/**
 * 五度圏の3層構造セグメントパスを生成
 *
 * 五度圏特有の3層構造（内側からマイナーキー、メジャーキー、調号）の
 * 各エリアに対応するSVGパスを生成する。
 *
 * 層構造の詳細:
 * - マイナーキーエリア: CENTER_RADIUS (90px) ～ INNER_RADIUS (130px)
 * - メジャーキーエリア: INNER_RADIUS (130px) ～ MIDDLE_RADIUS (175px)
 * - 調号エリア: MIDDLE_RADIUS (175px) ～ RADIUS (200px)
 *
 * @param position - 0-11の位置（0=C, 1=G, 2=D, ...五度圏の順序）
 * @returns 3つのパス（minorPath, majorPath, signaturePath）を含むオブジェクト
 *
 * @example
 * ```tsx
 * const { minorPath, majorPath, signaturePath } = generateThreeSegmentPaths(0);
 * <path d={minorPath} className="fill-key-area-minor" />
 * <path d={majorPath} className="fill-key-area-major" />
 * <path d={signaturePath} className="fill-signature-area" />
 * ```
 */
export const generateThreeSegmentPaths = (position: number): SegmentPaths => {
  const radii = [
    CIRCLE_LAYOUT.CENTER_RADIUS, // 90px - 中心空白の外側境界
    CIRCLE_LAYOUT.INNER_RADIUS, // 130px - マイナーキーエリアの外側境界
    CIRCLE_LAYOUT.MIDDLE_RADIUS, // 175px - メジャーキーエリアの外側境界
    CIRCLE_LAYOUT.RADIUS, // 200px - 最外側
  ];

  const [minorPath, majorPath, signaturePath] = generateMultiLayerPaths(position, radii);

  return {
    minorPath,
    majorPath,
    signaturePath,
  };
};
