import { Key } from '@/types/circleOfFifths';
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

  // 円周上の点を計算 (現時点ではボタンの中心座標)
  let x = radius * Math.cos(angle);
  let y = radius * Math.sin(angle);

  const BUTTON_WIDTH_HALF = 30; // KeyButtonの幅の半分を仮定 (実測値に合わせる)
  const BUTTON_HEIGHT_HALF = 22; // KeyButtonの高さの半分を仮定 (実測値に合わせる)

  // xとyを、ボタンの左上隅が来るべき位置に調整
  x -= BUTTON_WIDTH_HALF;
  y -= BUTTON_HEIGHT_HALF;

  return {
    x,
    y,
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
