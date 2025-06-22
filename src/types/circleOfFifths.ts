/**
 * 五度圏関連のグローバル型定義
 * 
 * このファイルには、アプリケーション全体で使用される
 * 五度圏関連の型定義が含まれています。
 */

import { Variants } from 'motion/react';

// ============================================================================
// 基本型定義（グローバルで使用）
// ============================================================================

/**
 * キーの基本情報
 * 
 * アプリケーション全体で使用される基本的なキー情報
 */
export interface Key {
  /** キー名（例: 'C', 'Am'） */
  name: string;
  /** メジャーキーかどうか */
  isMajor: boolean;
  /** 五度圏上の位置（0-11） */
  position: number;
}

/**
 * 五度圏のセグメント情報
 * 
 * アプリケーション全体で使用されるセグメント情報
 */
export interface CircleSegment {
  /** セグメントの位置（0-11） */
  position: number;
  /** マイナーキー名 */
  minorKey: string;
  /** メジャーキー名 */
  majorKey: string;
  /** 調号（現在は文字列、後でSVGに変更予定） */
  keySignature: string;
}

// ============================================================================
// 状態管理型定義（Zustandストア）
// ============================================================================

/**
 * 五度圏の状態のZustandストア型定義
 * 
 * アプリケーション全体で共有される状態
 */
export interface CircleOfFifthsStore {
  /** 現在選択されているキー */
  selectedKey: Key | null;
  /** 現在ホバーされているキー */
  hoveredKey: Key | null;
  /** 再生状態 */
  isPlaying: boolean;
  /** キー選択のセッター */
  setSelectedKey: (key: Key | null) => void;
  /** キーホバーのセッター */
  setHoveredKey: (key: Key | null) => void;
  /** 再生状態のセッター */
  setIsPlaying: (isPlaying: boolean) => void;
}

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
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'CircleOfFifthsError';
  }
}
