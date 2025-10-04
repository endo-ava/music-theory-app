import { create } from 'zustand';
import { Key } from '@/domain/key';
import { IMusicalContext } from '../domain';

/**
 * 現在の音楽文脈状態管理ストアの型定義
 *
 * KeyとModalContextの両方を扱えるよう拡張されています。
 * 段階的移行により、既存のKey中心のシステムから
 * ModalContextも含むシステムへと発展させていきます。
 */
export interface CurrentKeyState {
  /** 現在の音楽文脈（KeyまたはModalContext） */
  currentKey: IMusicalContext;
  /** 音楽文脈を設定する */
  setCurrentKey: (context: IMusicalContext) => void;
  /** デフォルト音楽文脈（C Major）にリセットする */
  resetToDefault: () => void;
}

/**
 * 現在の音楽文脈状態管理ストア
 *
 * 音楽的世界観（現在の音楽文脈）の状態を管理します。
 * KeyとModalContextの両方に対応し、相対的な音楽理論学習において
 * 基準となる音楽文脈の設定・取得を担います。
 */
export const useCurrentKeyStore = create<CurrentKeyState>(set => ({
  // 初期状態はC Major (Key)
  currentKey: Key.fromCircleOfFifths(0, true),

  // 音楽文脈を設定（KeyまたはModalContext）
  setCurrentKey: (context: IMusicalContext) => set({ currentKey: context }),

  // デフォルト音楽文脈（C Major Key）にリセット
  resetToDefault: () => set({ currentKey: Key.fromCircleOfFifths(0, true) }),
}));
