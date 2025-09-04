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

    // 明るいキー（G,D,A,E,B,G♭(f#)）は黒、それ以外は白を設定
    // CSS変数名からキー名を抽出（例: "var(--color-key-d-ionian)" -> "d", "var(--color-key-gsharp-ionian)" -> "gsharp"）
    const keyMatch = cssVariable.match(/--color-key-([a-z]+(?:sharp|flat)?)-/);
    const extractedKey = keyMatch ? keyMatch[1] : '';
    // sharp/flatも含めた明るいキー判定
    const isLightKey = ['g', 'd', 'a', 'e', 'b', 'fsharp'].includes(extractedKey);
    const foregroundColor = isLightKey ? 'oklch(0.205 0 0)' : 'oklch(0.985 0 0)';
    document.documentElement.style.setProperty('--accent-foreground', foregroundColor);
    // クリーンアップ関数でデフォルト値に戻す
    return () => {
      // ダークモードかどうかで適切なデフォルト値を設定
      const isDark = document.documentElement.classList.contains('dark');
      const defaultAccent = isDark ? 'oklch(0.55 0 0)' : 'oklch(0.97 0 0)';
      const defaultAccentForeground = isDark ? 'oklch(0.95 0 0)' : 'oklch(0.15 0 0)';

      document.documentElement.style.setProperty('--accent', defaultAccent);
      document.documentElement.style.setProperty('--accent-foreground', defaultAccentForeground);
    };
  }, [key]);
};
