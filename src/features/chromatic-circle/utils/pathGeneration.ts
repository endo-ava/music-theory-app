/**
 * クロマチックサークルのSVGパス生成ユーティリティ
 *
 * クロマチックサークル固有の2層構造（ピッチクラス表示、調号）の
 * セグメントパスを生成する。
 */

import { generateMultiLayerPaths } from '@/shared/utils/circlePathGeneration';
import { CIRCLE_LAYOUT } from '../constants';
import type { ChromaticSegmentPaths } from '../types';

/**
 * クロマチックサークルの2層構造セグメントパスを生成
 *
 * クロマチックサークル特有の2層構造（ピッチクラス表示エリア、調号エリア）の
 * 各エリアに対応するSVGパスを生成する。
 *
 * 五度圏との統一レイアウトに対応し、INNER_RADIUSとMIDDLE_RADIUSを統合した
 * シンプルな2層構造を採用。
 *
 * 層構造の詳細:
 * - ピッチクラス表示エリア: CENTER_RADIUS (90px) ～ MIDDLE_RADIUS (175px)
 * - 調号エリア: MIDDLE_RADIUS (175px) ～ RADIUS (200px)
 *
 * @param position - 0-11の位置（0=C, 1=C#, 2=D, ...半音階順序）
 * @returns 2つのパス（pitchPath, signaturePath）を含むオブジェクト
 *
 * @example
 * ```tsx
 * const { pitchPath, signaturePath } = generateTwoLayerPaths(0);
 * <path d={pitchPath} className="fill-pitch-area" />
 * <path d={signaturePath} className="fill-signature-area" />
 * ```
 */
export const generateTwoLayerPaths = (position: number): ChromaticSegmentPaths => {
  const radii = [
    CIRCLE_LAYOUT.CENTER_RADIUS, // 90px - 中心空白の外側境界
    CIRCLE_LAYOUT.MIDDLE_RADIUS, // 175px - ピッチクラス表示エリアの外側境界
    CIRCLE_LAYOUT.RADIUS, // 200px - 最外側
  ];

  const [pitchPath, signaturePath] = generateMultiLayerPaths(position, radii);

  return {
    pitchPath,
    signaturePath,
  };
};
