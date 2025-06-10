import { Variants } from 'framer-motion';

// キーの型定義
export interface Key {
  name: string;
  isMajor: boolean;
  position: number;
}

// 新しい五度圏の構造用の型定義
export interface CircleSegment {
  position: number; // 0-11の位置
  minorKey: string; // マイナーキー名
  majorKey: string; // メジャーキー名
  keySignature: string; // 調号（現在は文字列、後でSVGに変更予定）
}

// 五度圏の状態のZustandストア型定義
export interface CircleOfFifthsStore {
  selectedKey: Key | null;
  hoveredKey: Key | null;
  isPlaying: boolean;
  setSelectedKey: (key: Key | null) => void;
  setHoveredKey: (key: Key | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
}

// コンポーネントのProps型定義
export interface KeyButtonProps {
  keyData: Key;
  isSelected: boolean;
  onClick: (key: Key) => void;
  onMouseEnter: (key: Key) => void;
  onMouseLeave: () => void;
  style: React.CSSProperties;
}

export interface KeyInfoProps {
  selectedKey: Key | null;
}

// 新しいピザ型ブロック用のProps型定義
export interface CircleSegmentProps {
  segment: CircleSegment;
  selectedKey: Key | null;
  hoveredKey: Key | null;
  onKeyClick: (keyName: string, isMajor: boolean, position: number) => void;
  onKeyHover: (keyName: string, isMajor: boolean, position: number) => void;
  onKeyLeave: () => void;
}

// 個別のキーエリア用のProps型定義
export interface KeyAreaProps {
  keyName: string;
  isMajor: boolean;
  position: number;
  path: string;
  textPosition: { x: number; y: number };
  textRotation: number;
  fontSize: string;
  isSelected: boolean;
  isHovered: boolean;
  onClick: (keyName: string, isMajor: boolean, position: number) => void;
  onMouseEnter: (keyName: string, isMajor: boolean, position: number) => void;
  onMouseLeave: () => void;
}

// アニメーションの型定義
export type AnimationVariants = Variants;

// スタイルの定数
export const STYLES = {
  CIRCLE: {
    WIDTH: '70%',
    MAX_WIDTH: '800px',
    BACKGROUND: {
      FROM: '#1a1a1a',
      TO: '#2a2a2a',
    },
  },
  KEY_BUTTON: {
    WIDTH: 70,
    HEIGHT: 70,
    FONT_SIZE: '1.2rem',
    PADDING: '1rem',
    BORDER_RADIUS: '8px',
    BACKGROUND: {
      DEFAULT: 'rgba(255, 255, 255, 0.05)',
      HOVER: 'rgba(255, 255, 255, 0.1)',
      ACTIVE: 'rgba(255, 255, 255, 0.15)',
    },
  },
  // 新しいピザ型ブロック用のスタイル
  CIRCLE_SEGMENT: {
    RADIUS: 300, // 外側の半径
    INNER_RADIUS: 170, // 内側の半径（マイナーキーエリア）
    MIDDLE_RADIUS: 250, // 中間の半径（メジャーキーエリア）
    FONT_SIZE: {
      MINOR: '1rem',
      MAJOR: '1.2rem',
      SIGNATURE: '0.7rem',
    },
    COLORS: {
      MINOR: 'rgba(255, 255, 255, 0.1)',
      MAJOR: 'rgba(255, 255, 255, 0.15)',
      SIGNATURE: 'rgba(255, 255, 255, 0.2)',
      HOVER: 'rgba(255, 255, 255, 0.25)',
      SELECTED: 'rgba(255, 255, 255, 0.3)',
    },
  },
} as const;
