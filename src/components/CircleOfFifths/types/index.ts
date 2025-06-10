/**
 * 五度圏コンポーネント専用の型定義
 * 
 * このファイルには、五度圏コンポーネントで使用される
 * コンポーネント固有の型定義が含まれています。
 * 
 * グローバル型は @/types/circleOfFifths からインポートします。
 */

// グローバル型をインポート
import type { Key, CircleSegment, Point } from '@/types/circleOfFifths';

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
 * セグメントコンポーネントのProps
 */
export interface CircleSegmentProps {
    /** セグメントの情報 */
    segment: CircleSegment;
    /** 現在選択されているキー */
    selectedKey: Key | null;
    /** 現在ホバーされているキー */
    hoveredKey: Key | null;
    /** キークリック時のコールバック */
    onKeyClick: (keyName: string, isMajor: boolean, position: number) => void;
    /** キーホバー時のコールバック */
    onKeyHover: (keyName: string, isMajor: boolean, position: number) => void;
    /** キーからマウスが離れた時のコールバック */
    onKeyLeave: () => void;
}

/**
 * 個別キーエリアコンポーネントのProps
 */
export interface KeyAreaProps {
    /** キー名 */
    keyName: string;
    /** メジャーキーかどうか */
    isMajor: boolean;
    /** 位置 */
    position: number;
    /** SVGパス */
    path: string;
    /** テキスト位置 */
    textPosition: Point;
    /** テキスト回転角度 */
    textRotation: number;
    /** フォントサイズ */
    fontSize: string;
    /** 選択状態かどうか */
    isSelected: boolean;
    /** ホバー状態かどうか */
    isHovered: boolean;
    /** クリック時のコールバック */
    onClick: (keyName: string, isMajor: boolean, position: number) => void;
    /** ホバー時のコールバック */
    onMouseEnter: (keyName: string, isMajor: boolean, position: number) => void;
    /** マウスが離れた時のコールバック */
    onMouseLeave: () => void;
}

/**
 * キー情報表示コンポーネントのProps
 */
export interface KeyInfoDisplayProps {
    /** ホバーされているキー */
    hoveredKey: Key | null;
}

// ============================================================================
// グローバル型の再エクスポート（コンポーネント内での使用のため）
// ============================================================================

// グローバル型を再エクスポート（コンポーネント内での使用のため）
export type {
    Key,
    CircleSegment,
    Point,
} from '@/types/circleOfFifths'; 