import { create } from 'zustand';
import { CircleOfFifthsStore, Key } from '@/features/circle-of-fifths/types';

// ストアの作成
export const useCircleOfFifthsStore = create<CircleOfFifthsStore>(set => ({
  // 初期状態
  selectedKey: null,
  hoveredKey: null,
  isPlaying: false,

  setSelectedKey: (key: Key | null) =>
    set(() => ({
      selectedKey: key,
      isPlaying: false,
    })),
  setHoveredKey: (key: Key | null) =>
    set(() => ({
      hoveredKey: key,
      isPlaying: key !== null,
    })),
  setIsPlaying: (isPlaying: boolean) => set(() => ({ isPlaying })),
}));
