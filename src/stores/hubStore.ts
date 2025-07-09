import { create } from 'zustand';
import type { HubType } from '@/shared/types';

/**
 * Hub 状態管理ストアの型定義
 */
export interface HubState {
  /** 現在のHub種類 */
  hubType: HubType;
  /** Hub種類を設定する */
  setHubType: (hubType: HubType) => void;
}

/**
 * Hub 状態管理ストア
 *
 * 五度圏とクロマチックサークルの切り替えを管理します。
 */
export const useHubStore = create<HubState>(set => ({
  // 初期状態は五度圏
  hubType: 'circle-of-fifths',

  // Hub種類を設定
  setHubType: (hubType: HubType) => set({ hubType }),
}));
