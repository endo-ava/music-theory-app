import { create } from 'zustand';
import { KeyDTO } from '@/domain';

/**
 * 五度圏の状態のZustandストア型定義
 *
 * アプリケーション全体で共有される状態
 */
export interface CircleOfFifthsStore {
  /** 現在選択されているキー */
  selectedKey: KeyDTO | null;
  /** 現在ホバーされているキー */
  hoveredKey: KeyDTO | null;
  /** 再生状態 */
  isPlaying: boolean;
  /** キー選択のセッター */
  setSelectedKey: (key: KeyDTO | null) => void;
  /** キーホバーのセッター */
  setHoveredKey: (key: KeyDTO | null) => void;
  /** 再生状態のセッター */
  setIsPlaying: (isPlaying: boolean) => void;
}

// ストアの作成
export const useCircleOfFifthsStore = create<CircleOfFifthsStore>(set => ({
  // 初期状態
  selectedKey: null,
  hoveredKey: null,
  isPlaying: false,

  setSelectedKey: (key: KeyDTO | null) =>
    set(() => ({
      selectedKey: key,
      isPlaying: false,
    })),
  setHoveredKey: (key: KeyDTO | null) =>
    set(() => ({
      hoveredKey: key,
      isPlaying: key !== null,
    })),
  setIsPlaying: (isPlaying: boolean) => set(() => ({ isPlaying })),
}));
