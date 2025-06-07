import { Variants } from 'framer-motion';

// キーの型定義
export interface Key {
  name: string;
  isMajor: boolean;
  position: number;
}

// 五度圏の状態管理の型定義
export interface CircleOfFifthsState {
  selectedKey: Key | null;
  hoveredKey: Key | null;
  isPlaying: boolean;
}

// Zustandストアの型定義
export interface CircleOfFifthsStore {
  state: CircleOfFifthsState;
  setSelectedKey: (key: Key | null) => void;
  setHoveredKey: (key: Key | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
}

// コンポーネントのProps型定義
export interface KeyButtonProps {
  keyData: Key;
  isSelected: boolean;
  isHovered: boolean;
  onClick: (key: Key) => void;
  onMouseEnter: (key: Key) => void;
  onMouseLeave: () => void;
  style: React.CSSProperties;
}

export interface KeyInfoProps {
  selectedKey: Key | null;
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
    FONT_SIZE: '1.2rem',
    PADDING: '1rem',
    BORDER_RADIUS: '8px',
    BACKGROUND: {
      DEFAULT: 'rgba(255, 255, 255, 0.05)',
      HOVER: 'rgba(255, 255, 255, 0.1)',
      ACTIVE: 'rgba(255, 255, 255, 0.15)',
    },
  },
} as const;
