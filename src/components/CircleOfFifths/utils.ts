import { Key, STYLES, CircleSegment } from '@/types/circleOfFifths';
import { CIRCLE_CONSTANTS, KEYS } from './constants';

/**
 * キーの位置を計算する
 * @param key キー情報
 * @returns キーの位置（x, y座標）
 */
export const calculateKeyPosition = (key: Key): { x: number; y: number } => {
  const { RADIUS, INNER_RADIUS, KEY_COUNT, ANGLE_OFFSET } = CIRCLE_CONSTANTS;
  const radius = key.isMajor ? RADIUS : INNER_RADIUS;
  // 角度を計算（ラジアンに変換
  const angle = ((key.position * 360) / KEY_COUNT + ANGLE_OFFSET) * (Math.PI / 180);

  return {
    // ボタンの中心座標を計算し、ボタンの左上隅が来るべき位置に調整
    x: radius * Math.cos(angle) - Number(STYLES.KEY_BUTTON.WIDTH) / 2,
    y: radius * Math.sin(angle) - Number(STYLES.KEY_BUTTON.HEIGHT) / 2
  };
};

/**
 * キーの情報を取得する
 * @param key キー情報
 * @returns キーの詳細情報
 */
export const getKeyInfo = (key: Key) => {
  const { name, isMajor, position } = key;
  const relativeKey = isMajor
    ? KEYS.find(k => !k.isMajor && k.position === position)?.name
    : KEYS.find(k => k.isMajor && k.position === position)?.name;

  return {
    name,
    type: isMajor ? 'メジャー' : 'マイナー',
    relativeKey,
    position: position + 1,
    scale: isMajor ? '長調' : '短調',
  };
};

/**
 * 指定された位置の角度を計算
 * @param position 0-11の位置
 * @returns 角度（ラジアン）
 */
export const calculateAngle = (position: number): number => {
  const angleInDegrees = (position * 360) / 12 - 105; // Cが一番上（-90度）に来るように
  return (angleInDegrees * Math.PI) / 180;
};

/**
 * ピザ型ブロックのパスを生成
 * @param position 0-11の位置
 * @param innerRadius 内側の半径
 * @param outerRadius 外側の半径
 * @returns SVGパス文字列
 */
export const generatePizzaSlicePath = (
  position: number,
  innerRadius: number,
  outerRadius: number
): string => {
  const startAngle = calculateAngle(position);
  const endAngle = calculateAngle((position + 1) % 12);

  // 内側の円弧の開始点
  const innerStartX = Math.cos(startAngle) * innerRadius;
  const innerStartY = Math.sin(startAngle) * innerRadius;

  // 外側の円弧の開始点
  const outerStartX = Math.cos(startAngle) * outerRadius;
  const outerStartY = Math.sin(startAngle) * outerRadius;

  // 外側の円弧の終了点
  const outerEndX = Math.cos(endAngle) * outerRadius;
  const outerEndY = Math.sin(endAngle) * outerRadius;

  // 内側の円弧の終了点
  const innerEndX = Math.cos(endAngle) * innerRadius;
  const innerEndY = Math.sin(endAngle) * innerRadius;

  // 角度差を計算（0-2πの範囲に正規化）
  let angleDiff = endAngle - startAngle;
  if (angleDiff < 0) {
    angleDiff += 2 * Math.PI;
  }

  // 大きな円弧のフラグ（角度差がπを超える場合）
  const largeArcFlag = angleDiff > Math.PI ? 1 : 0;

  return [
    `M ${innerStartX} ${innerStartY}`,
    `L ${outerStartX} ${outerStartY}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${outerEndX} ${outerEndY}`,
    `L ${innerEndX} ${innerEndY}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerStartX} ${innerStartY}`,
    'Z'
  ].join(' ');
};

/**
 * 3分割されたピザ型ブロックの各セグメントのパスを生成
 * @param position 0-11の位置
 * @param innerRadius 内側の半径（マイナーキーエリア）
 * @param middleRadius 中間の半径（メジャーキーエリア）
 * @param outerRadius 外側の半径（調号エリア）
 * @returns 各セグメントのパス文字列のオブジェクト
 */
export const generateThreeSegmentPaths = (
  position: number,
  innerRadius: number,
  middleRadius: number,
  outerRadius: number
) => {
  const startAngle = calculateAngle(position);
  const endAngle = calculateAngle((position + 1) % 12);

  // 角度差を計算（0-2πの範囲に正規化）
  let angleDiff = endAngle - startAngle;
  if (angleDiff < 0) {
    angleDiff += 2 * Math.PI;
  }
  const largeArcFlag = angleDiff > Math.PI ? 1 : 0;

  // マイナーキーエリア（内側）- 中心点から始まる扇形
  const minorStartX = Math.cos(startAngle) * innerRadius;
  const minorStartY = Math.sin(startAngle) * innerRadius;
  const minorEndX = Math.cos(endAngle) * innerRadius;
  const minorEndY = Math.sin(endAngle) * innerRadius;

  const minorPath = [
    'M 0 0', // 中心点から開始
    `L ${minorStartX} ${minorStartY}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 1 ${minorEndX} ${minorEndY}`,
    'Z'
  ].join(' ');

  // メジャーキーエリア（中間）
  const majorPath = generatePizzaSlicePath(position, innerRadius, middleRadius);

  // 調号エリア（外側）
  const signaturePath = generatePizzaSlicePath(position, middleRadius, outerRadius);

  return {
    minorPath,
    majorPath,
    signaturePath,
  };
};

/**
 * テキストの位置を計算
 * @param position 0-11の位置
 * @param radius 半径
 * @returns テキストの座標
 */
export const calculateTextPosition = (position: number, radius: number) => {
  const angle = calculateAngle(position) + (Math.PI / 12); // セグメントの中心
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
  };
};

/**
 * テキストの回転角度を計算
 * @param position 0-11の位置
 * @returns 回転角度（度）
 */
export const calculateTextRotation = (position: number): number => {
  const angleInDegrees = (position * 360) / 12 - 90 + 15; // セグメントの中心 + 15度
  return angleInDegrees;
};
