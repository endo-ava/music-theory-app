/**
 * 音楽カラーシステムを使用したスタイリングフック
 */
import { useMemo } from 'react';
import { getMusicColorVariable } from '@/shared/utils/musicColorSystem';
import type { Key, KeyDTO } from '@/domain';

/**
 * 音楽カラーシステムを使用したボーダー色を取得するフック
 * @param key - 対象のキー（Key または KeyDTO）
 * @returns ボーダー色のスタイルオブジェクト
 */
export const useMusicColorBorder = (
  key: Key | KeyDTO | null
): {
  borderColor: string;
  borderStyle: React.CSSProperties;
} => {
  return useMemo(() => {
    const cssVariable = getMusicColorVariable(key);

    return {
      borderColor: cssVariable,
      borderStyle: { borderColor: cssVariable },
    };
  }, [key]);
};

/**
 * 音楽カラーシステムを使用したテキスト色を取得するフック（将来拡張用）
 * @param key - 対象のキー（Key または KeyDTO）
 * @returns テキスト色のスタイルオブジェクト
 */
export const useMusicColorText = (
  key: Key | KeyDTO | null
): {
  textColor: string;
  textStyle: React.CSSProperties;
} => {
  return useMemo(() => {
    const cssVariable = getMusicColorVariable(key);
    const textColor = key ? cssVariable : 'var(--foreground)';

    return {
      textColor,
      textStyle: { color: textColor },
    };
  }, [key]);
};
