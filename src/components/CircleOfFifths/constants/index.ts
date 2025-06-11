/**
 * 五度圏コンポーネントの定数定義
 * 
 * このファイルには、五度圏コンポーネントで使用される
 * すべての定数が含まれています。
 */

import { Key, CircleSegment } from '@/types/circleOfFifths';

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
    { position: 1, minorKey: 'Em', majorKey: 'G', keySignature: '#' },
    { position: 2, minorKey: 'Bm', majorKey: 'D', keySignature: '##' },
    { position: 3, minorKey: 'F#m', majorKey: 'A', keySignature: '###' },
    { position: 4, minorKey: 'C#m', majorKey: 'E', keySignature: '####' },
    { position: 5, minorKey: 'G#m', majorKey: 'B', keySignature: '#####' },
    { position: 6, minorKey: 'D#m', majorKey: 'F#/G♭', keySignature: '###### /\n♭♭♭♭♭♭' },
    { position: 7, minorKey: 'A#m', majorKey: 'D♭', keySignature: '♭♭♭♭♭' },
    { position: 8, minorKey: 'Fm', majorKey: 'A♭', keySignature: '♭♭♭♭' },
    { position: 9, minorKey: 'Cm', majorKey: 'E♭', keySignature: '♭♭♭' },
    { position: 10, minorKey: 'Gm', majorKey: 'B♭', keySignature: '♭♭' },
    { position: 11, minorKey: 'Dm', majorKey: 'F', keySignature: '♭' },
];
// ============================================================================
// レイアウト定数
// ============================================================================

/**
 * 円のレイアウト定数
 */
export const CIRCLE_LAYOUT = {
    /** 外側の半径（ピクセル） */
    RADIUS: 200,
    /** 内側の半径（マイナーキーエリア） */
    INNER_RADIUS: 120,
    /** 中間の半径（メジャーキーエリア） */
    MIDDLE_RADIUS: 170,
    /** 中心の半径（調号エリア） */
    CENTER_RADIUS: 80,
} as const;

/**
 * フォントサイズ定数
 */
export const FONT_SIZES = {
    /** マイナーキーのフォントサイズ */
    MINOR: '0.8rem',
    /** メジャーキーのフォントサイズ */
    MAJOR: '1rem',
    /** 調号のフォントサイズ */
    SIGNATURE: '0.5rem',
} as const;

/**
 * フォントウェイト定数
 */
export const FONT_WEIGHTS = {
    /** マイナーキーのフォントウェイト */
    MINOR: '50',
    /** メジャーキーのフォントウェイト */
    MAJOR: '80',
    /** 調号のフォントウェイト */
    SIGNATURE: '50',
} as const;

/**
 * 色定数
 */
export const COLORS = {
    /** マイナーキーエリアの色 */
    MINOR: 'rgba(255, 255, 255, 0.1)',
    /** メジャーキーエリアの色 */
    MAJOR: 'rgba(255, 255, 255, 0.15)',
    /** 調号エリアの色 */
    SIGNATURE: 'rgba(255, 255, 255, 0.2)',
    /** ホバー時の色 */
    HOVER: 'rgba(255, 255, 255, 0.25)',
    /** 選択時の色 */
    SELECTED: 'rgba(255, 255, 255, 0.3)',
    /** 境界線の色 */
    BORDER: 'rgba(255, 255, 255, 0.1)',
    /** テキストの色 */
    TEXT: 'white',
} as const;

// ============================================================================
// アニメーション定数
// ============================================================================

/**
 * アニメーション定数
 */
export const ANIMATION = {
    /** 基本の遅延時間（秒） */
    BASE_DELAY: 0.05,
    /** フェードイン時間（秒） */
    FADE_DURATION: 0.3,
    /** ホバー時のスケール */
    HOVER_SCALE: 1.02,
    /** タップ時のスケール */
    TAP_SCALE: 0.98,
} as const;

// ============================================================================
// バリデーション関数
// ============================================================================

/**
 * 位置が有効かどうかをチェック
 * @param position チェックする位置
 * @returns 有効な位置かどうか
 */
export const isValidPosition = (position: number): boolean => {
    return Number.isInteger(position) && position >= 0 && position < SEGMENT_COUNT;
};

/**
 * キーが有効かどうかをチェック
 * @param key チェックするキー
 * @returns 有効なキーかどうか
 */
export const isValidKey = (key: Key): boolean => {
    return (
        typeof key.name === 'string' &&
        key.name.length > 0 &&
        typeof key.isMajor === 'boolean' &&
        isValidPosition(key.position)
    );
};

// ============================================================================
// SVG定数
// ============================================================================

/**
 * SVG関連の定数
 */
export const SVG = {
    /** 背景円のストローク幅 */
    BACKGROUND_STROKE_WIDTH: '2',
    /** 境界円のストローク幅 */
    BORDER_STROKE_WIDTH: '1',
    /** SVGの表示スタイル */
    DISPLAY: 'block',
    /** 円の中心X座標 */
    CENTER_X: '0',
    /** 円の中心Y座標 */
    CENTER_Y: '0',
    /** SVGの表示スタイル */
    DISPLAY_MODE: 'block',
} as const; 