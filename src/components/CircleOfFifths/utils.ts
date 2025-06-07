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
  const angle = ((key.position * 360) / KEY_COUNT + ANGLE_OFFSET) * (Math.PI / 180);

  return {
    x: radius * Math.cos(angle),
    y: radius * Math.sin(angle),
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
