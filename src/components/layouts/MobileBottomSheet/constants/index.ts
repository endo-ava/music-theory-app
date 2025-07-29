import { Tab } from '../types';

/**
 * ボトムシートのタブナビゲーション定義
 *
 * @description
 * モバイルボトムシート内で表示されるタブの設定。
 * 各タブには一意のIDとユーザーに表示されるラベルが含まれます。
 *
 * @constant TABS
 * @type {Tab[]}
 */
export const TABS: Tab[] = [
  { id: 'view', label: 'View' },
  { id: 'layer', label: 'Layer' },
];

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
  /** 最小化状態：画面の6%の高さに表示 */
  LOWEST: 0.06,
  /** 中間状態：画面の50%の高さに表示 */
  HALF: 0.4,
  /** 展開状態：画面の90%の高さに表示 */
  EXPANDED: 0.9,
} as const;
