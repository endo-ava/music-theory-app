// キーの型定義
export type Key = {
  name: string; // キー名（例: "C", "G", "D"）
  isMajor: boolean; // メジャーキーかどうか
  position: number; // 五度圏上の位置（0-11）
};

// 五度圏の状態管理用の型定義
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

// キーボタンのProps型定義
export interface KeyButtonProps {
  key: Key;
  isSelected: boolean;
  isHovered: boolean;
  onClick: (key: Key) => void;
  onMouseEnter: (key: Key) => void;
  onMouseLeave: () => void;
}

// キー情報表示用のProps型定義
export interface KeyInfoProps {
  selectedKey: Key | null;
}
