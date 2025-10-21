import { calculateAngle, normalizeAngle, polarToCartesian } from './geometry';
import { ChromaticCircleService } from '@/domain/services/ChromaticCircle';
import { CIRCLE_LAYOUT } from '../constants';
import type { ChromaticSegmentPaths } from '../types';

/**
 * ピザ型セグメントのSVGパスを生成
 * @param position 0-11の位置
 * @param innerRadius 内側の半径（CENTER_RADIUS）
 * @param outerRadius 外側の半径（RADIUS）
 * @returns SVGパス文字列
 */
export const generatePizzaSlicePath = (
  position: number,
  innerRadius: number,
  outerRadius: number
): string => {
  const startAngle = calculateAngle(position);
  const endAngle = calculateAngle((position + 1) % ChromaticCircleService.SEGMENT_COUNT);

  // 内側の円弧の開始点と終了点
  const innerStart = polarToCartesian(innerRadius, startAngle);
  const innerEnd = polarToCartesian(innerRadius, endAngle);

  // 外側の円弧の開始点と終了点
  const outerStart = polarToCartesian(outerRadius, startAngle);
  const outerEnd = polarToCartesian(outerRadius, endAngle);

  // 角度差を計算
  const angleDiff = normalizeAngle(endAngle - startAngle);
  const largeArcFlag = angleDiff > Math.PI ? 1 : 0;

  return [
    `M ${innerStart.x} ${innerStart.y}`,
    `L ${outerStart.x} ${outerStart.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerStart.x} ${innerStart.y}`,
    'Z',
  ].join(' ');
};

/**
 * 2層構造のセグメントパスを生成（五度圏との統一レイアウト）
 * ピッチクラス表示エリアと調号エリアの2層からなるパスを生成
 * @param position 0-11の位置
 * @returns ピッチパスと調号パスを含むオブジェクト
 */
export const generateTwoLayerPaths = (position: number): ChromaticSegmentPaths => {
  // ピッチクラス表示エリア（90px～175px）- INNER_RADIUSとMIDDLE_RADIUSを統合
  const pitchPath = generatePizzaSlicePath(
    position,
    CIRCLE_LAYOUT.CENTER_RADIUS,
    CIRCLE_LAYOUT.MIDDLE_RADIUS
  );

  // 調号エリア（175px～200px）
  const signaturePath = generatePizzaSlicePath(
    position,
    CIRCLE_LAYOUT.MIDDLE_RADIUS,
    CIRCLE_LAYOUT.RADIUS
  );

  return {
    pitchPath,
    signaturePath,
  };
};
