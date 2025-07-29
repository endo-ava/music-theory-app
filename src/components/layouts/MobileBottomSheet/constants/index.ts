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

/**
 * カスタムタッチハンドラーの設定パラメータの型定義
 *
 * @interface TouchConfig
 * @description
 * useCustomTouchHandlerで使用される各種閾値とタイミング設定の型定義。
 * モバイル実機での最適な操作感を実現するためのパラメータ群です。
 */
export interface TouchConfig {
  /**
   * ドラッグ開始判定の最小移動距離（px）
   * @description この距離を超えた移動でドラッグ操作として認識開始
   * @range 1-10px (推奨: 3px)
   */
  MIN_MOVE_DISTANCE: number;

  /**
   * 縦方向判定の閾値（0-1の比率）
   * @description 全体の移動量に対する縦方向移動の比率がこの値を超えると縦スクロールと判定
   * @range 0.5-0.8 (推奨: 0.6)
   */
  VERTICAL_THRESHOLD: number;

  /**
   * 速度による段階スキップの閾値（px/ms）
   * @description この速度を超えるスワイプで中間段階をスキップ
   * @range 0.2-0.6 (推奨: 0.4)
   */
  SNAP_VELOCITY_THRESHOLD: number;

  /**
   * デバウンス時間（ms）
   * @description タッチイベント処理の最小間隔
   * @range 8-16ms (推奨: 8ms = 120fps相当)
   */
  DEBOUNCE_TIME: number;

  /**
   * スナップ切り替えに必要な最小距離（px）
   * @description この距離未満のスワイプではスナップポイントが変更されない
   * @range 15-40px (推奨: 25px)
   */
  MIN_SWIPE_DISTANCE: number;
}

/**
 * 実機最適化されたタッチ判定パラメータ
 *
 * @description
 * モバイル実機での操作性を重視して調整されたパラメータセット。
 * 各値は実機テストを通じて最適化されており、以下の特性を持ちます：
 * - 微細な動きの確実な検出
 * - 意図しない誤操作の防止
 * - 中間地点への停止しやすさ
 * - 高速操作時の段階スキップ機能
 *
 * @constant TOUCH_CONFIG
 * @type {TouchConfig}
 */
export const TOUCH_CONFIG: TouchConfig = {
  MIN_MOVE_DISTANCE: 3, // より敏感に（実機での微細な動きを確実に検出）
  VERTICAL_THRESHOLD: 0.6, // 縦方向判定を緩和（60%以上で縦方向と判定）
  SNAP_VELOCITY_THRESHOLD: 0.4, // 速度閾値を上げて段階スキップしにくくする
  DEBOUNCE_TIME: 8, // より高頻度で処理（120fps相当）
  MIN_SWIPE_DISTANCE: 25, // より意図的なスワイプのみ反応するように
};
