import { create } from 'zustand';
import { Key } from '@/domain/key';

/**
 * 現在の音楽キー状態管理ストアの型定義
 */
export interface CurrentKeyState {
  /** 現在の音楽キー（音楽的世界観） */
  currentKey: Key;
  /** 音楽キーを設定する */
  setCurrentKey: (Key: Key) => void;
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
  currentKey: Key.fromCircleOfFifths(0, true),

  // 音楽キーを設定
  setCurrentKey: (Key: Key) => set({ currentKey: Key }),

  // デフォルト音楽キー（C Major）にリセット
  resetToDefault: () => set({ currentKey: Key.fromCircleOfFifths(0, true) }),
}));
