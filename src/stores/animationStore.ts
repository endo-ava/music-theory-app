import { create } from 'zustand';

/**
 * アニメーションの種類
 */
export type AnimationType = 'fifth' | 'tritone';

/**
 * アクティブなアニメーションの状態
 */
export interface ActiveAnimation {
  id: string;
  type: AnimationType;
  from: number;
  to: number;
  isMajor: boolean;
  duration: number; // ms
}

/**
 * アニメーション状態の管理
 */
interface AnimationState {
  activeAnimations: ActiveAnimation[];
}

/**
 * アニメーション操作
 */
interface AnimationActions {
  startAnimation: (animation: Omit<ActiveAnimation, 'id'>) => void;
  clearAnimations: () => void;
  removeAnimation: (id: string) => void;
}

/**
 * アニメーション状態を管理するZustandストア
 *
 * 一時的な視覚効果（矢印やハイライトなど）の状態を管理します。
 */
export const useAnimationStore = create<AnimationState & AnimationActions>(set => ({
  activeAnimations: [],

  startAnimation: animation => {
    const id = Math.random().toString(36).substring(7);
    const newAnimation = { ...animation, id };

    set(state => ({
      activeAnimations: [...state.activeAnimations, newAnimation],
    }));

    // duration後に自動削除
    setTimeout(() => {
      set(state => ({
        activeAnimations: state.activeAnimations.filter(a => a.id !== id),
      }));
    }, animation.duration);
  },

  clearAnimations: () => set({ activeAnimations: [] }),

  removeAnimation: id =>
    set(state => ({
      activeAnimations: state.activeAnimations.filter(a => a.id !== id),
    })),
}));
