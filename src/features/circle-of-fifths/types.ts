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
