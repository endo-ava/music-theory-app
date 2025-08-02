/**
 * 五度圏関連のグローバル型定義
 *
 * このファイルには、アプリケーション全体で使用される
 * 五度圏関連の型定義が含まれています。
 */

import { Variants } from 'motion/react';

// ============================================================================
// ユーティリティ型定義（グローバルで使用）
// ============================================================================

/**
 * 座標情報
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * SVGパス情報
 */
export interface SegmentPaths {
  /** マイナーキーエリアのパス */
  minorPath: string;
  /** メジャーキーエリアのパス */
  majorPath: string;
  /** 調号エリアのパス */
  signaturePath: string;
}

/**
 * アニメーション変数の型
 */
export type AnimationVariants = Variants;

/**
 * アニメーション遅延値の型
 */
export interface KeyAreaAnimations {
  /** アニメーション遅延時間（秒） */
  readonly animationDelay: number;
  /** テキストアニメーション遅延時間（秒） */
  readonly textAnimationDelay: number;
}

/**
 * CSS クラス名の型定義
 */
export type FillClassName =
  | 'fill-key-area-major'
  | 'fill-key-area-minor'
  | 'fill-key-area-selected'
  | 'fill-key-area-hover';

export type TextClassName = 'text-key-major font-key-major' | 'text-key-minor font-key-minor';

// ============================================================================
// エラー型定義（グローバルで使用）
// ============================================================================

/**
 * 五度圏関連のエラー
 */
export class CircleOfFifthsError extends Error {
  constructor(
    message: string,
    public code: string
  ) {
    super(message);
    this.name = 'CircleOfFifthsError';
  }
}
