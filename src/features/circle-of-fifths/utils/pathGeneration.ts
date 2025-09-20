import type { SegmentPaths } from '../types';
import { CircleOfFifthsError } from '@/features/circle-of-fifths/types';
import { CIRCLE_LAYOUT } from '../constants/index';
import { isValidPosition } from './validation';
import { calculateAngle, normalizeAngle, polarToCartesian } from './geometry';
import { CircleOfFifthsService } from '@/domain/services/CircleOfFifths';

/**
 * ピザ型ブロックのパスを生成
 * @param position 0-11の位置
 * @param innerRadius 内側の半径
 * @param outerRadius 外側の半径
 * @returns SVGパス文字列
 * @throws {CircleOfFifthsError} パラメータが無効な場合
 */
export const generatePizzaSlicePath = (
  position: number,
  innerRadius: number,
  outerRadius: number
): string => {
  if (!isValidPosition(position)) {
    throw new CircleOfFifthsError(`Invalid position: ${position}`, 'INVALID_POSITION');
  }

  if (innerRadius < 0 || outerRadius < 0 || innerRadius >= outerRadius) {
    throw new CircleOfFifthsError(
      `Invalid radii: inner=${innerRadius}, outer=${outerRadius}`,
      'INVALID_RADII'
    );
  }

  const startAngle = calculateAngle(position);
  const endAngle = calculateAngle((position + 1) % CircleOfFifthsService.getSegmentCount());

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
 * 3分割されたブロックの各セグメントのパスを生成
 * @param minorOuterRadius マイナーキーエリアの外側の半径
 * @param majorOuterRadius メジャーキーエリアの外側の半径
 * @param signatureOuterRadius 調号エリアの外側の半径
 * @returns 各セグメントのパス文字列のオブジェクト
 * @throws {CircleOfFifthsError} パラメータが無効な場合
 */
export const generateThreeSegmentPaths = (
  position: number,
  minorOuterRadius: number,
  majorOuterRadius: number,
  signatureOuterRadius: number
): SegmentPaths => {
  if (!isValidPosition(position)) {
    throw new CircleOfFifthsError(`Invalid position: ${position}`, 'INVALID_POSITION');
  }
  if (minorOuterRadius < 0 || majorOuterRadius < 0 || signatureOuterRadius < 0) {
    throw new CircleOfFifthsError(
      `Invalid radii: minor=${minorOuterRadius}, major=${majorOuterRadius}, signature=${signatureOuterRadius}`,
      'INVALID_RADII'
    );
  }
  if (minorOuterRadius >= majorOuterRadius || majorOuterRadius >= signatureOuterRadius) {
    throw new CircleOfFifthsError(
      `Radii must be in ascending order: minor < major < signature`,
      'INVALID_RADII_ORDER'
    );
  }

  // マイナーキーエリア（内側）- 内側の半径から始まるドーナツ型
  const minorPath = generatePizzaSlicePath(position, CIRCLE_LAYOUT.CENTER_RADIUS, minorOuterRadius);

  // メジャーキーエリア（中間）
  const majorPath = generatePizzaSlicePath(position, minorOuterRadius, majorOuterRadius);

  // 調号エリア（外側）
  const signaturePath = generatePizzaSlicePath(position, majorOuterRadius, signatureOuterRadius);

  return {
    minorPath,
    majorPath,
    signaturePath,
  };
};
