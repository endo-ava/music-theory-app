import type { Point } from '@/shared/types/graphics';
import {
  ANGLE_PER_SEGMENT,
  ANGLE_OFFSET,
  HALF_ANGLE_PER_SEGMENT_RAD,
} from '@/shared/constants/circle';

/**
 * 極座標から直交座標に変換
 *
 * 円形レイアウトの計算で使用する汎用的な座標変換関数
 *
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
 * 角度を正規化（0-2πの範囲に）
 *
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
 * 度数法からラジアンへ変換
 *
 * @param degrees 角度（度）
 * @returns 角度（ラジアン）
 */
export const degreesToRadians = (degrees: number): number => {
  return (degrees * Math.PI) / 180;
};

/**
 * 指定された位置の角度を計算
 *
 * 円形レイアウト上のセグメント位置から、そのセグメントの角度（ラジアン）を計算。
 * 12セグメントの円形レイアウト（クロマチックサークル・五度圏）で使用。
 *
 * @param position 0-11の位置（0=C, 1=C#/Db, 2=D, ...）
 * @returns 角度（ラジアン）
 */
export const calculateAngle = (position: number): number => {
  const angleInDegrees = position * ANGLE_PER_SEGMENT + ANGLE_OFFSET;
  return degreesToRadians(angleInDegrees);
};

/**
 * テキストの位置を計算（セグメントの中心）
 *
 * 円形レイアウト上のセグメント中心にテキストを配置するための座標を計算。
 * セグメントの開始角度に半角を加えることで、セグメントの中心位置を求める。
 *
 * @param position 0-11の位置
 * @param radius 半径
 * @returns テキストの座標
 */
export const calculateTextPosition = (position: number, radius: number): Point => {
  // セグメントの開始角度 + 半角 = セグメントの中心角度
  const angle = calculateAngle(position) + HALF_ANGLE_PER_SEGMENT_RAD;
  return polarToCartesian(radius, angle);
};
