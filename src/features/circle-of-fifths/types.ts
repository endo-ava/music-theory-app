/**
 * 五度圏専用の型定義
 *
 * このファイルには、五度圏フィーチャー内でのみ使用される
 * ローカルな型定義が含まれています。
 */

// 共通型定義はsharedから再エクスポート
export type { Point } from '@/shared/types/graphics';

/**
 * SVGパス情報（3分割セグメント用）
 * 五度圏固有の構造
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
