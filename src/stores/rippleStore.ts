import { create } from 'zustand';

/**
 * リップルエフェクトのインスタンス情報
 */
export interface RippleInstance {
  id: number;
  x: number;
  y: number;
  color: string;
}

/**
 * リップルストアの状態
 */
interface RippleState {
  ripples: RippleInstance[];
  nextId: number;
}

/**
 * リップルストアのアクション
 */
interface RippleActions {
  /**
   * 新しいリップルを追加する
   * @param x 中心X座標
   * @param y 中心Y座標
   * @param color リップルの色
   */
  addRipple: (x: number, y: number, color: string) => void;

  /**
   * 指定されたIDのリップルを削除する
   * @param id 削除するリップルのID
   */
  removeRipple: (id: number) => void;
}

/**
 * リップルエフェクトを管理するグローバルストア
 *
 * 複数のコンポーネントから発生するリップルを一元管理し、
 * 専用のレイヤーで描画するために使用します。
 */
export const useRippleStore = create<RippleState & RippleActions>(set => ({
  ripples: [],
  nextId: 0,

  addRipple: (x, y, color) =>
    set(state => ({
      ripples: [
        ...state.ripples,
        {
          id: state.nextId,
          x,
          y,
          color,
        },
      ],
      nextId: state.nextId + 1,
    })),

  removeRipple: id =>
    set(state => ({
      ripples: state.ripples.filter(ripple => ripple.id !== id),
    })),
}));
