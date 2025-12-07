/**
 * 五度圏コンポーネントの定数定義
 *
 * このファイルには、五度圏コンポーネントで使用される
 * 計算に必要な定数のみが含まれています。
 * スタイル値はTailwind CSSで管理されます。
 */

// 円形レイアウトの共通定数をインポート
export {
  SEGMENT_COUNT,
  ANGLE_OFFSET,
  ANGLE_PER_SEGMENT,
  HALF_ANGLE_PER_SEGMENT_RAD,
} from '@/constants/circle';

// ============================================================================
// レイアウト定数（計算に必要な値のみ）
// ============================================================================

/** マイナーキーテキストの配置オフセット比率（テキストがエリア内側に配置されるように調整） */
export const MINOR_TEXT_OFFSET_RATIO = 1.2;

/**
 * 五度圏の同心円レイアウト定数
 *
 * 五度圏は4つの同心円エリアで構成されます（中心から外側へ）：
 * 1. 中心空白エリア（0px～90px）
 * 2. マイナーキーエリア（90px～130px）- Am、Em、Bmなどを表示
 * 3. メジャーキーエリア（130px～175px）- C、G、Dなどを表示
 * 4. 調号エリア（175px～200px）- #1、♭2などを表示
 */
export const CIRCLE_LAYOUT = {
  /** 最外側の半径（200px）- SVG全体のサイズ（400x400px）も決定 */
  RADIUS: 200,
  /** メジャーキーエリアの外側境界（175px）- メジャーキーを130px～175pxの輪っかに表示 */
  MIDDLE_RADIUS: 175,
  /** マイナーキーエリアの外側境界（130px）- マイナーキーを90px～130pxの輪っかに表示 */
  INNER_RADIUS: 130,
  /** 中心の空白エリア（90px）- ドーナツ形状を作り、中心部分を空ける */
  CENTER_RADIUS: 90,
} as const;

/**
 * テキスト配置用半径定数
 *
 * 五度圏の各エリアにテキストを配置するための半径値。
 * CIRCLE_LAYOUTの値を基に事前計算されている。
 */
export const TEXT_RADIUS = {
  /** マイナーキーテキストの配置半径（108.33px）- INNER_RADIUS / MINOR_TEXT_OFFSET_RATIO */
  MINOR: CIRCLE_LAYOUT.INNER_RADIUS / MINOR_TEXT_OFFSET_RATIO,
  /** メジャーキーテキストの配置半径（152.5px）- INNER_RADIUS と MIDDLE_RADIUS の中点 */
  MAJOR: (CIRCLE_LAYOUT.INNER_RADIUS + CIRCLE_LAYOUT.MIDDLE_RADIUS) / 2,
  /** 調号テキストの配置半径（187.5px）- MIDDLE_RADIUS と RADIUS の中点 */
  SIGNATURE: (CIRCLE_LAYOUT.MIDDLE_RADIUS + CIRCLE_LAYOUT.RADIUS) / 2,
} as const;

// ============================================================================
// KeyArea アニメーション・スタイル定数
// ============================================================================

/**
 * アニメーション定数
 * Framer Motionのアニメーション設定に使用される定数
 */
export const ANIMATION = {
  /** フェードイン時間（秒） */
  FADE_DURATION: 0.3,
  /** ホバー時のスケール */
  HOVER_SCALE: 1.03,
  /** タップ時のスケール */
  TAP_SCALE: 0.9,
} as const;

/**
 * レイアウトオフセット定数
 * テキスト位置調整用の値
 */
export const LAYOUT_OFFSETS = {
  ROMAN_Y_OFFSET: 6,
  PRIMARY_Y_OFFSET: -6,
  /** ダイアトニックと機能和声が両方表示される時のX方向オフセット */
  DUAL_LAYER_X_OFFSET: 10,
} as const;
