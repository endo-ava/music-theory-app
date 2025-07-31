import { create } from 'zustand';
import { MusicalKey } from '@/domain/music/value-objects';

/**
 * 現在の音楽キー状態管理ストアの型定義
 */
export interface CurrentMusicalKeyState {
  /** 現在の音楽キー（音楽的世界観） */
  currentMusicalKey: MusicalKey;
  /** 音楽キーを設定する */
  setCurrentMusicalKey: (musicalKey: MusicalKey) => void;
  /** キー名から音楽キーを設定する */
  setCurrentMusicalKeyFromKeyName: (keyName: string) => void;
  /** デフォルト音楽キーにリセットする */
  resetToDefault: () => void;
}

/**
 * 現在の音楽キー状態管理ストア
 *
 * 音楽的世界観（現在の音楽キー）の状態を管理します。
 * 相対的な音楽理論学習において、基準となる音楽キーの設定・取得を担います。
 */
export const useCurrentMusicalKeyStore = create<CurrentMusicalKeyState>(set => ({
  // 初期状態はC Major
  currentMusicalKey: MusicalKey.getDefault(),

  // 音楽キーを設定
  setCurrentMusicalKey: (musicalKey: MusicalKey) => set({ currentMusicalKey: musicalKey }),

  // キー名文字列から音楽キーを設定
  setCurrentMusicalKeyFromKeyName: (keyName: string) => {
    try {
      const musicalKey = MusicalKey.fromKeyName(
        keyName as Parameters<typeof MusicalKey.fromKeyName>[0]
      );
      set({ currentMusicalKey: musicalKey });
    } catch {
      console.warn('Invalid key name provided:', keyName);
      // 無効なキー名の場合は何もしない
    }
  },

  // デフォルト音楽キー（C Major）にリセット
  resetToDefault: () => set({ currentMusicalKey: MusicalKey.getDefault() }),
}));

// レガシーサポート: 旧名称でのエクスポート（廆止予定）
/**
 * @deprecated useCurrentMusicalKeyStore を使用してください
 */
export const useCurrentScaleStore = useCurrentMusicalKeyStore;
export type CurrentScaleState = CurrentMusicalKeyState;
