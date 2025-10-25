/**
 * クロマチックサークルの定数定義
 */

// 円形レイアウトの共通定数をインポート
export {
  SEGMENT_COUNT,
  ANGLE_OFFSET,
  ANGLE_PER_SEGMENT,
  HALF_ANGLE_PER_SEGMENT_RAD,
} from '@/shared/constants/circle';

/**
 * クロマチックサークルのレイアウト定数
 *
 * 五度圏と統一された2層構造:
 * 1. 中心空白エリア（0px～90px）
 * 2. ピッチクラス表示エリア（90px～175px）- INNER_RADIUSとMIDDLE_RADIUSを統合
 * 3. 調号エリア（175px～200px）- 装飾用の外側リング
 */
export const CIRCLE_LAYOUT = {
  /** 最外側の半径（200px）- 五度圏と同じサイズ */
  RADIUS: 200,
  /** ピッチクラス表示エリアの外側境界（175px）- 五度圏のMIDDLE_RADIUSと統一 */
  MIDDLE_RADIUS: 175,
  /** 中心の空白エリア（90px）- 五度圏のCENTER_RADIUSと統一 */
  CENTER_RADIUS: 90,
} as const;

/**
 * テキスト配置用半径定数
 */
export const TEXT_RADIUS = {
  /** ピッチクラス名の配置半径（152.5px）- セグメントの中央にくるように */
  PITCH: 132.5,
} as const;

// アニメーション定数（五度圏と統一）
export const ANIMATION = {
  FADE_DURATION: 0.3,
  HOVER_SCALE: 1.03,
  TAP_SCALE: 0.9,
} as const;
