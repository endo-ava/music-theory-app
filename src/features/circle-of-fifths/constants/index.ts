/**
 * 五度圏コンポーネントの定数定義
 *
 * このファイルには、五度圏コンポーネントで使用される
 * 計算に必要な定数のみが含まれています。
 * スタイル値はTailwind CSSで管理されます。
 */

import { Key, CircleSegment } from '@/features/circle-of-fifths/types';

// ============================================================================
// 基本定数
// ============================================================================

/** 五度圏のセグメント数 */
export const SEGMENT_COUNT = 12;

/** 角度の基本オフセット（Cが一番上に来るように調整） */
export const ANGLE_OFFSET = -105;

/** 1セグメントあたりの角度（度） */
export const ANGLE_PER_SEGMENT = 360 / SEGMENT_COUNT;

// ============================================================================
// 五度圏のキー定義
// ============================================================================

/**
 * 五度圏のキー定義
 *
 * メジャーキーとマイナーキーの両方を含む完全なキーセット
 */
export const KEYS: Key[] = [
  // メジャーキー（外側）
  { name: 'C', isMajor: true, position: 0 },
  { name: 'G', isMajor: true, position: 1 },
  { name: 'D', isMajor: true, position: 2 },
  { name: 'A', isMajor: true, position: 3 },
  { name: 'E', isMajor: true, position: 4 },
  { name: 'B', isMajor: true, position: 5 },
  { name: 'F#', isMajor: true, position: 6 },
  { name: 'C#', isMajor: true, position: 7 },
  { name: 'G#', isMajor: true, position: 8 },
  { name: 'D#', isMajor: true, position: 9 },
  { name: 'A#', isMajor: true, position: 10 },
  { name: 'F', isMajor: true, position: 11 },

  // マイナーキー（内側）
  { name: 'Am', isMajor: false, position: 0 },
  { name: 'Em', isMajor: false, position: 1 },
  { name: 'Bm', isMajor: false, position: 2 },
  { name: 'F#m', isMajor: false, position: 3 },
  { name: 'C#m', isMajor: false, position: 4 },
  { name: 'G#m', isMajor: false, position: 5 },
  { name: 'D#m', isMajor: false, position: 6 },
  { name: 'A#m', isMajor: false, position: 7 },
  { name: 'Fm', isMajor: false, position: 8 },
  { name: 'Cm', isMajor: false, position: 9 },
  { name: 'Gm', isMajor: false, position: 10 },
  { name: 'Dm', isMajor: false, position: 11 },
];

/**
 * 五度圏のセグメント定義
 *
 * 各セグメントには、マイナーキー、メジャーキー、調号の情報が含まれます
 */
export const CIRCLE_SEGMENTS: CircleSegment[] = [
  { position: 0, minorKey: 'Am', majorKey: 'C', keySignature: '' },
  { position: 1, minorKey: 'Em', majorKey: 'G', keySignature: '#1' },
  { position: 2, minorKey: 'Bm', majorKey: 'D', keySignature: '#2' },
  { position: 3, minorKey: 'F#m', majorKey: 'A', keySignature: '#3' },
  { position: 4, minorKey: 'C#m', majorKey: 'E', keySignature: '#4' },
  { position: 5, minorKey: 'G#m', majorKey: 'B', keySignature: '#5' },
  { position: 6, minorKey: 'D#m', majorKey: 'F#/G♭', keySignature: '#6 / ♭6' },
  { position: 7, minorKey: 'A#m', majorKey: 'D♭', keySignature: '♭5' },
  { position: 8, minorKey: 'Fm', majorKey: 'A♭', keySignature: '♭4' },
  { position: 9, minorKey: 'Cm', majorKey: 'E♭', keySignature: '♭3' },
  { position: 10, minorKey: 'Gm', majorKey: 'B♭', keySignature: '♭2' },
  { position: 11, minorKey: 'Dm', majorKey: 'F', keySignature: '♭1' },
];

// ============================================================================
// レイアウト定数（計算に必要な値のみ）
// ============================================================================

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

// ============================================================================
// アニメーション定数（Framer Motion用）
// ============================================================================

/**
 * アニメーション定数
 * Framer Motionのアニメーション設定に使用
 */
export const ANIMATION = {
  /** 基本の遅延時間（秒） */
  BASE_DELAY: 0.02,
  /** フェードイン時間（秒） */
  FADE_DURATION: 0.3,
  /** ホバー時のスケール */
  HOVER_SCALE: 1.03,
  /** タップ時のスケール */
  TAP_SCALE: 0.9,
} as const;
