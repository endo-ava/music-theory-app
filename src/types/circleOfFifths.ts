import { Variants } from 'framer-motion';

// キーの型定義
export interface Key {
  name: string;
  isMajor: boolean;
  position: number;
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
    WIDTH: '70',
    HEIGHT: '70',
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
