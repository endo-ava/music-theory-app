import type { Point } from '@/shared/types/graphics';
import { ANGLE_OFFSET, ANGLE_PER_SEGMENT } from '../constants';
import { ChromaticCircleService } from '@/domain/services/ChromaticCircle';

/**
 * 指定された位置の角度を計算
 * @param position 0-11の位置
 * @returns 角度（ラジアン）
 */
export const calculateAngle = (position: number): number => {
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
 * テキストの位置を計算（セグメントの中心）
 * @param position 0-11の位置
 * @param radius 半径
 * @returns テキストの座標
 */
export const calculateTextPosition = (position: number, radius: number): Point => {
  // セグメントの中心角度
  const angle = calculateAngle(position) + Math.PI / ChromaticCircleService.SEGMENT_COUNT;
  return polarToCartesian(radius, angle);
};
