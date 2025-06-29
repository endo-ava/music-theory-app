import { Key } from '@/features/circle-of-fifths/types';
import { SEGMENT_COUNT } from '../constants/index';

/**
 * 位置が有効かどうかをチェック
 * @param position チェックする位置
 * @returns 有効な位置かどうか
 */
export const isValidPosition = (position: number): boolean => {
  return Number.isInteger(position) && position >= 0 && position < SEGMENT_COUNT;
};

/**
 * キーが有効かどうかをチェック
 * @param key チェックするキー
 * @returns 有効なキーかどうか
 */
export const isValidKey = (key: Key): boolean => {
  return (
    typeof key.name === 'string' &&
    key.name.length > 0 &&
    typeof key.isMajor === 'boolean' &&
    isValidPosition(key.position)
  );
};
