'use client';

import { create } from 'zustand';

/**
 * レイヤー表示状態の管理
 */
interface LayerState {
  /** ダイアトニックコードの表示状態 */
  isDiatonicChordsVisible: boolean;
}

/**
 * レイヤー表示状態の操作
 */
interface LayerActions {
  /** ダイアトニックコード表示の切り替え */
  toggleDiatonicChords: () => void;
}

/**
 * レイヤー表示状態を管理するZustandストア
 *
 * 音楽理論の各レイヤー（スケール、コード、関係性）の表示制御を行う。
 * 現在はダイアトニックコード表示のみ実装。
 */
export const useLayerStore = create<LayerState & LayerActions>(set => ({
  // State
  isDiatonicChordsVisible: true,

  // Actions
  toggleDiatonicChords: () =>
    set(state => ({
      isDiatonicChordsVisible: !state.isDiatonicChordsVisible,
    })),
}));
