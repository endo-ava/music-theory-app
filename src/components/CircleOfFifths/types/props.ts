/**
 * 五度圏コンポーネント専用の型定義
 *
 * このファイルには、五度圏コンポーネントで使用される
 * コンポーネント固有の型定義が含まれています。
 *
 * グローバル型は @/types/circleOfFifths からインポートします。
 */

// グローバル型をインポート
import type { CircleSegment, Point, SegmentPaths } from '@/types/circleOfFifths';

// ============================================================================
// コンポーネントProps型定義
// ============================================================================

/**
 * 五度圏メインコンポーネントのProps
 */
export interface CircleOfFifthsProps {
  /** カスタムクラス名 */
  className?: string;
  /** カスタムスタイル */
  style?: React.CSSProperties;
}

/**
 * SVG描画コンポーネント
 */
export interface CircleSvgCanvasProps {
  radius: number;
  segments: CircleSegment[];
}

/**
 * セグメントコンポーネントのProps
 */
export interface CircleSegmentProps {
  /** セグメントの情報 */
  segment: CircleSegment;
  paths: SegmentPaths;
  textPositions: {
    minorTextPos: Point;
    majorTextPos: Point;
    signatureTextPos: Point;
  };
  textRotation: number;
}

/**
 * 個別キーエリアコンポーネントのProps
 */
export interface KeyAreaProps {
  /** キー名 */
  keyName: string;
  /** メジャーキーかどうか */
  isMajor: boolean;
  /** セグメントの情報 */
  segment: CircleSegment;
  /** SVGパス */
  path: string;
  /** テキスト位置 */
  textPosition: Point;
  /** テキスト回転角度 */
  textRotation: number;
}

// ============================================================================
// グローバル型の再エクスポート（コンポーネント内での使用のため）
// ============================================================================

// グローバル型を再エクスポート（コンポーネント内での使用のため）
export type { Key, CircleSegment, Point } from '@/types/circleOfFifths';
