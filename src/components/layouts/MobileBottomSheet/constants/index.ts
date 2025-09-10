/**
 * ボトムシートのスナップポイント設定
 *
 * @description
 * vaulライブラリで使用されるスナップポイントの定義。
 * 値は画面高さに対する比率（0-1）で設定されています。
 *
 * @constant SNAP_POINTS
 * @readonly
 */
export const SNAP_POINTS = {
  /** 最小化状態：画面の8%の高さに表示（視認性改善） */
  LOWEST: 0.08,
  /** 中間状態：画面の50%の高さに表示（真の中央） */
  HALF: 0.5,
  /** 展開状態：画面の85%の高さに表示（操作しやすい高さ） */
  EXPANDED: 0.85,
} as const;
