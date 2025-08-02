import { Point, CircleOfFifthsError } from '@/features/circle-of-fifths/types';
import { ANGLE_OFFSET, ANGLE_PER_SEGMENT } from '../constants/index';
import { isValidPosition } from './validation';
import { CircleOfFifthsService } from '@/domain/services/CircleOfFifths';

/**
 * 指定された位置の角度を計算
 * @param position 0-11の位置
 * @returns 角度（ラジアン）
 * @throws {CircleOfFifthsError} 位置が無効な場合
 */
export const calculateAngle = (position: number): number => {
  if (!isValidPosition(position)) {
    throw new CircleOfFifthsError(`Invalid position: ${position}`, 'INVALID_POSITION');
  }

  const angleInDegrees = position * ANGLE_PER_SEGMENT + ANGLE_OFFSET;
  return (angleInDegrees * Math.PI) / 180;
};

/**
 * 角度を正規化（0-2πの範囲に）
 * @param angle 正規化する角度（ラジアン）
 * @returns 正規化された角度（ラジアン）
 */
export const normalizeAngle = (angle: number): number => {
  let normalized = angle % (2 * Math.PI);
  if (normalized < 0) {
    normalized += 2 * Math.PI;
  }
  return normalized;
};

/**
 * 極座標から直交座標に変換
 * @param radius 半径
 * @param angle 角度（ラジアン）
 * @returns 直交座標
 */
export const polarToCartesian = (radius: number, angle: number): Point => {
  return {
    x: radius * Math.cos(angle),
    y: radius * Math.sin(angle),
  };
};

/**
 * テキストの位置を計算
 * @param position 0-11の位置
 * @param radius 半径
 * @returns テキストの座標
 * @throws {CircleOfFifthsError} 位置が無効な場合
 */
export const calculateTextPosition = (position: number, radius: number): Point => {
  if (!isValidPosition(position)) {
    throw new CircleOfFifthsError(`Invalid position: ${position}`, 'INVALID_POSITION');
  }

  if (radius < 0) {
    throw new CircleOfFifthsError(`Invalid radius: ${radius}`, 'INVALID_RADIUS');
  }

  const angle = calculateAngle(position) + Math.PI / CircleOfFifthsService.getSegmentCount(); // セグメントの中心
  return polarToCartesian(radius, angle);
};

/**
 * テキストの回転角度を計算
 * @returns 回転角度（度）- 常に0度（垂直）を返す
 */
export const calculateTextRotation = (): number => {
  // テキストを常に垂直に表示
  return 0;
};
