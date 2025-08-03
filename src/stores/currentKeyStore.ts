import { create } from 'zustand';
import { Key } from '@/domain/key';
import { PitchClass, ScalePattern } from '@/domain/common';

/**
 * 現在の音楽キー状態管理ストアの型定義
 */
export interface CurrentKeyState {
  /** 現在の音楽キー（音楽的世界観） */
  currentKey: Key;
  /** 音楽キーを設定する */
  setCurrentKey: (Key: Key) => void;
  /** キー名から音楽キーを設定する */
  // setCurrentKeyFromKeyName: (keyName: string) => void;
  /** デフォルト音楽キーにリセットする */
  resetToDefault: () => void;
}

/**
 * 現在の音楽キー状態管理ストア
 *
 * 音楽的世界観（現在の音楽キー）の状態を管理します。
 * 相対的な音楽理論学習において、基準となる音楽キーの設定・取得を担います。
 */
export const useCurrentKeyStore = create<CurrentKeyState>(set => ({
  // 初期状態はC Major
  currentKey: new Key(PitchClass.fromCircleOfFifths(0), ScalePattern.Major),

  // 音楽キーを設定
  setCurrentKey: (Key: Key) => set({ currentKey: Key }),

  // キー名文字列から音楽キーを設定
  // setCurrentKeyFromKeyName: (keyName: string) => {
  //   try {
  //     // 五度圏から生成することで、シンプルな実装にする
  //     // 今回はC Major/A Minor のような基本的なキーのみサポート
  //     if (keyName === 'C Major') {
  //       const key = Key.fromCircleOfFifths(0, false); // C Major
  //       set({ currentKey: key });
  //     } else if (keyName === 'A Minor') {
  //       const key = Key.fromCircleOfFifths(0, true); // A Minor (C Majorの相対短調)
  //       set({ currentKey: key });
  //     } else {
  //       // その他のキーも徐々に追加可能
  //       console.warn('Unsupported key name for now:', keyName);
  //     }
  //   } catch (error) {
  //     console.warn('Invalid key name provided:', keyName, error);
  //     // 無効なキー名の場合は何もしない
  //   }
  // },

  // デフォルト音楽キー（C Major）にリセット
  resetToDefault: () =>
    set({ currentKey: new Key(PitchClass.fromCircleOfFifths(0), ScalePattern.Major) }),
}));
