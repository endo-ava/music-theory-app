/**
 * 音楽カラーシステムを使用したスタイリングフック
 */
import React, { useMemo } from 'react';
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

/**
 * 音楽カラーシステムを使用してaccent色を動的に設定するフック
 * @param key - 対象のキー（Key または KeyDTO）
 */
export const useMusicColorAccent = (key: Key | KeyDTO | null): void => {
  React.useEffect(() => {
    const cssVariable = getMusicColorVariable(key);
    // CSS変数--accentを動的に更新
    document.documentElement.style.setProperty('--accent', cssVariable);

    // クリーンアップ関数でデフォルト値に戻す
    return () => {
      // ダークモードかどうかで適切なデフォルト値を設定
      const isDark = document.documentElement.classList.contains('dark');
      const defaultAccent = isDark ? 'oklch(0.55 0 0)' : 'oklch(0.97 0 0)';

      document.documentElement.style.setProperty('--accent', defaultAccent);
    };
  }, [key]);
};
