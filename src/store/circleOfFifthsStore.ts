import { create } from 'zustand';
import { CircleOfFifthsState, CircleOfFifthsStore, Key } from '@/types/circleOfFifths';

// 初期状態
const initialState: CircleOfFifthsState = {
  selectedKey: null,
  hoveredKey: null,
  isPlaying: false,
};

// ストアの作成
export const useCircleOfFifthsStore = create<CircleOfFifthsStore>(set => ({
  state: initialState,
  setSelectedKey: (key: Key | null) =>
    set(state => ({
      state: {
        ...state.state,
        selectedKey: key,
        isPlaying: false,
      },
    })),
  setHoveredKey: (key: Key | null) =>
    set(state => ({
      state: {
        ...state.state,
        hoveredKey: key,
        isPlaying: key !== null,
      },
    })),
  setIsPlaying: (isPlaying: boolean) =>
    set(state => ({
      state: {
        ...state.state,
        isPlaying,
      },
    })),
}));
