'use client';

import { create } from 'zustand';

/**
 * レイヤー表示状態の管理
 */
interface LayerState {
  /** ダイアトニックレイヤーの表示状態（ボーダーハイライト） */
  isDiatonicVisible: boolean;
  /** 度数（ローマ数字）表記の表示状態 */
  isDegreeVisible: boolean;
  /** 機能和声（T/D/SD）色分けの表示状態 */
  isFunctionalHarmonyVisible: boolean;
}

/**
 * レイヤー表示状態の操作
 */
interface LayerActions {
  /** ダイアトニックレイヤー表示の切り替え */
  toggleDiatonic: () => void;
  /** 度数表記の切り替え */
  toggleDegree: () => void;
  /** 機能和声色分けの切り替え */
  toggleFunctionalHarmony: () => void;
}

/**
 * レイヤー表示状態を管理するZustandストア
 *
 * 音楽理論の各レイヤー（スケール、コード、関係性）の表示制御を行う。
 * 現在はダイアトニックレイヤー表示のみ実装。
 */
export const useLayerStore = create<LayerState & LayerActions>(set => ({
  // State
  isDiatonicVisible: true,
  isDegreeVisible: true,
  isFunctionalHarmonyVisible: false,

  // Actions
  toggleDiatonic: () =>
    set(state => ({
      isDiatonicVisible: !state.isDiatonicVisible,
    })),
  toggleDegree: () =>
    set(state => ({
      isDegreeVisible: !state.isDegreeVisible,
    })),
  toggleFunctionalHarmony: () =>
    set(state => ({
      isFunctionalHarmonyVisible: !state.isFunctionalHarmonyVisible,
    })),
}));
