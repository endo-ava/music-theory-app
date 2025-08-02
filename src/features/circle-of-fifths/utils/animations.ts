/**
 * アニメーション計算ユーティリティ
 *
 * 五度圏コンポーネントで使用されるアニメーション関連の計算を提供します。
 */

import { ANIMATION } from '../constants/index';

// アニメーション遅延の追加オフセット定数
const ANIMATION_OFFSETS = {
  /** メジャーキーの追加遅延 */
  MAJOR_KEY_OFFSET: 0.1,
  /** テキストアニメーションの追加遅延 */
  TEXT_OFFSET: 0.3,
  /** 調号エリアの追加遅延 */
  SIGNATURE_AREA_OFFSET: 0.2,
  /** 調号テキストの追加遅延 */
  SIGNATURE_TEXT_OFFSET: 0.5,
} as const;

/**
 * 基本的なアニメーション遅延を計算します
 * @param position セグメントの位置 (0-11)
 * @returns 基本遅延時間（秒）
 */
export function calculateBaseDelay(position: number): number {
  return position * ANIMATION.BASE_DELAY;
}

/**
 * キーエリアのアニメーション遅延を計算します
 * @param position セグメントの位置 (0-11)
 * @param isMajor メジャーキーかどうか
 * @returns アニメーション遅延時間（秒）
 */
export function calculateKeyAnimationDelay(position: number, isMajor: boolean): number {
  const baseDelay = calculateBaseDelay(position);
  return isMajor ? baseDelay + ANIMATION_OFFSETS.MAJOR_KEY_OFFSET : baseDelay;
}

/**
 * テキストアニメーションの遅延を計算します
 * @param position セグメントの位置 (0-11)
 * @param isMajor メジャーキーかどうか
 * @returns テキストアニメーション遅延時間（秒）
 */
export function calculateTextAnimationDelay(position: number, isMajor: boolean): number {
  const keyDelay = calculateKeyAnimationDelay(position, isMajor);
  return keyDelay + ANIMATION_OFFSETS.TEXT_OFFSET;
}

/**
 * 調号エリアのアニメーション遅延を計算します
 * @param position セグメントの位置 (0-11)
 * @returns 調号エリアアニメーション遅延時間（秒）
 */
export function calculateSignatureAreaDelay(position: number): number {
  const baseDelay = calculateBaseDelay(position);
  return baseDelay + ANIMATION_OFFSETS.SIGNATURE_AREA_OFFSET;
}

/**
 * 調号テキストのアニメーション遅延を計算します
 * @param position セグメントの位置 (0-11)
 * @returns 調号テキストアニメーション遅延時間（秒）
 */
export function calculateSignatureTextDelay(position: number): number {
  const baseDelay = calculateBaseDelay(position);
  return baseDelay + ANIMATION_OFFSETS.SIGNATURE_TEXT_OFFSET;
}
