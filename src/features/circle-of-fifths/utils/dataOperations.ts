import { Key, CircleOfFifthsError } from '@/features/circle-of-fifths/types';
import { KEYS } from '../constants/index';
import { isValidKey } from './validation';

/**
 * キーの詳細情報を取得
 * @param key キー情報
 * @returns キーの詳細情報
 * @throws {CircleOfFifthsError} キーが無効な場合
 */
export const getKeyInfo = (key: Key) => {
  if (!isValidKey(key)) {
    throw new CircleOfFifthsError(`Invalid key: ${JSON.stringify(key)}`, 'INVALID_KEY');
  }

  const relativeKey = KEYS.find(
    k => k.isMajor !== key.isMajor && k.position === key.position
  )?.name;

  return {
    name: key.name,
    relativeKey,
    position: key.position + 1,
    scale: key.isMajor ? '長調' : '短調',
  };
};
