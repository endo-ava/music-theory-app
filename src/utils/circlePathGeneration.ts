/**
 * 円形レイアウトのSVGパス生成ユーティリティ
 *
 * クロマチックサークルと五度圏で共通して使用される
 * ピザ型セグメントのSVGパス生成ロジックを提供。
 *
 * @module circlePathGeneration
 */

import { calculateAngle, normalizeAngle, polarToCartesian } from './geometry';
import { SEGMENT_COUNT } from '@/constants/circle';

/**
 * ピザ型セグメントのSVGパスを生成する汎用関数
 *
 * 円形レイアウト上の指定位置に、内側半径と外側半径で定義される
 * ドーナツ型のセグメント（ピザのスライス形状）のSVGパスを生成。
 *
 * パフォーマンス重視のため、パラメータのバリデーションは行わない。
 * 呼び出し側が適切な値を渡す責任を持つ。
 *
 * @param position - 0から(SEGMENT_COUNT-1)の位置インデックス
 * @param innerRadius - 内側の半径（px）
 * @param outerRadius - 外側の半径（px）
 * @returns SVGパス文字列（"M ... L ... A ... Z"形式）
 *
 * @example
 * ```ts
 * // 位置0（Cの位置）、半径90px～130pxのセグメント
 * const path = generatePizzaSlicePath(0, 90, 130);
 * // => "M 0 -90 L 0 -130 A 130 130 0 0 1 112.58... -65 L 77.94... -45 A 90 90 0 0 0 0 -90 Z"
 * ```
 */
export const generatePizzaSlicePath = (
  position: number,
  innerRadius: number,
  outerRadius: number
): string => {
  const startAngle = calculateAngle(position);
  const endAngle = calculateAngle((position + 1) % SEGMENT_COUNT);

  // 内側の円弧の開始点と終了点
  const innerStart = polarToCartesian(innerRadius, startAngle);
  const innerEnd = polarToCartesian(innerRadius, endAngle);

  // 外側の円弧の開始点と終了点
  const outerStart = polarToCartesian(outerRadius, startAngle);
  const outerEnd = polarToCartesian(outerRadius, endAngle);

  // 角度差を計算（large-arc-flagの判定用）
  const angleDiff = normalizeAngle(endAngle - startAngle);
  const largeArcFlag = angleDiff > Math.PI ? 1 : 0;

  return [
    `M ${innerStart.x} ${innerStart.y}`, // 内側円弧の開始点に移動
    `L ${outerStart.x} ${outerStart.y}`, // 外側円弧の開始点まで直線
    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${outerEnd.x} ${outerEnd.y}`, // 外側円弧を時計回り
    `L ${innerEnd.x} ${innerEnd.y}`, // 内側円弧の終了点まで直線
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerStart.x} ${innerStart.y}`, // 内側円弧を反時計回り
    'Z', // パスを閉じる
  ].join(' ');
};

/**
 * 複数層のセグメントパスを一度に生成するヘルパー関数
 *
 * 同心円状に複数の層を持つセグメント（五度圏の3層、クロマチックサークルの2層など）を
 * 効率的に生成。内側から外側へ順番に半径を指定する。
 *
 * @param position - 0から(SEGMENT_COUNT-1)の位置インデックス
 * @param radii - 各層の境界半径の配列（内側から外側へ、昇順）。最低2つ必要
 * @returns 各層のSVGパス文字列の配列（radii.length - 1個の要素）
 *
 * @example
 * ```ts
 * // 五度圏の3層構造（マイナー、メジャー、調号）
 * const [minorPath, majorPath, signaturePath] = generateMultiLayerPaths(
 *   0,
 *   [90, 130, 175, 200] // CENTER_RADIUS, INNER_RADIUS, MIDDLE_RADIUS, RADIUS
 * );
 *
 * // クロマチックサークルの2層構造（ピッチ、調号）
 * const [pitchPath, signaturePath] = generateMultiLayerPaths(
 *   0,
 *   [90, 175, 200] // CENTER_RADIUS, MIDDLE_RADIUS, RADIUS
 * );
 * ```
 */
export const generateMultiLayerPaths = (position: number, radii: number[]): string[] => {
  const paths: string[] = [];

  for (let i = 0; i < radii.length - 1; i++) {
    paths.push(generatePizzaSlicePath(position, radii[i], radii[i + 1]));
  }

  return paths;
};
