import { Key, STYLES } from '@/types/circleOfFifths';
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
