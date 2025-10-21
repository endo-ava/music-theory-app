import { ChromaticCircleService } from '@/domain/services/ChromaticCircle';
import { CIRCLE_LAYOUT, TEXT_RADIUS } from '../constants';
import { generateTwoLayerPaths } from './pathGeneration';
import { calculateTextPosition } from './geometry';
import type { SegmentData } from '../types';

/**
 * クロマチックサークルの描画データを生成
 * Domain層のDTOを受け取り、SVG描画情報を追加する
 * 五度圏と統一された2層構造（メジャーキーエリア + 調号エリア）
 */
export const getChromaticCircleData = () => {
  const viewBox = `-${CIRCLE_LAYOUT.RADIUS} -${CIRCLE_LAYOUT.RADIUS} ${CIRCLE_LAYOUT.RADIUS * 2} ${CIRCLE_LAYOUT.RADIUS * 2}`;

  // Domain層からセグメント情報を取得
  const segmentDTOs = ChromaticCircleService.getSegmentDTOs();

  // SVG描画情報を追加
  const segments: SegmentData[] = segmentDTOs.map(segmentDTO => {
    // 2層構造のパスを生成（メジャーキーエリア + 調号エリア）
    const paths = generateTwoLayerPaths(segmentDTO.position);

    // テキスト位置はメジャーキーエリアの中央（五度圏のMAJOR位置と統一）
    const textPosition = calculateTextPosition(segmentDTO.position, TEXT_RADIUS.PITCH);

    return {
      segment: segmentDTO, // Domain層のDTO
      paths, // 2層構造のSVGパス
      textPosition, // テキスト配置座標
    };
  });

  return { viewBox, segments };
};
