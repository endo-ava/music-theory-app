import { create } from 'zustand';
import { KeyDTO, PitchClass } from '@/domain';

/**
 * 五度圏の状態のZustandストア型定義
 *
 * アプリケーション全体で共有される状態
 */
export interface CircleOfFifthsStore {
  /** 現在選択されているキー */
  selectedKey: KeyDTO | null;
  /** 現在ホバーされているキー */
  hoveredKey: KeyDTO | null;
  /** 再生状態 */
  isPlaying: boolean;
  /** キー選択のセッター */
  setSelectedKey: (key: KeyDTO | null) => void;
  /** キーホバーのセッター */
  setHoveredKey: (key: KeyDTO | null) => void;
  /** 再生状態のセッター */
  setIsPlaying: (isPlaying: boolean) => void;
  /** 回転インデックス（0-11） */
  rotationIndex: number;
  /** 右回転（時計回り：次のキーへ） */
  rotateRight: () => void;
  /** 左回転（反時計回り：前のキーへ） */
  rotateLeft: () => void;
  /** 回転インデックスを直接設定（ドラッグ操作用） */
  setRotationIndex: (index: number) => void;
  /** 回転を初期位置（C = 0）にリセット */
  resetRotation: () => void;
}

// ストアの作成
export const useCircleOfFifthsStore = create<CircleOfFifthsStore>(set => ({
  // 初期状態
  selectedKey: null,
  hoveredKey: null,
  isPlaying: false,

  setSelectedKey: (key: KeyDTO | null) =>
    set(() => ({
      selectedKey: key,
      isPlaying: false,
    })),
  setHoveredKey: (key: KeyDTO | null) =>
    set(() => ({
      hoveredKey: key,
      isPlaying: key !== null,
    })),
  setIsPlaying: (isPlaying: boolean) => set(() => ({ isPlaying })),

  rotationIndex: 0,
  // 右ボタン：時計回りに回転（視覚的に円が右に回る）
  rotateRight: () =>
    set(state => ({
      rotationIndex: PitchClass.modulo12(state.rotationIndex - 1),
    })),
  // 左ボタン：反時計回りに回転（視覚的に円が左に回る）
  rotateLeft: () =>
    set(state => ({
      rotationIndex: PitchClass.modulo12(state.rotationIndex + 1),
    })),
  // 回転インデックスを直接設定（ドラッグ操作で使用）
  setRotationIndex: (index: number) =>
    set(() => ({
      rotationIndex: PitchClass.modulo12(index),
    })),
  // 初期位置（C = 0）にリセット
  resetRotation: () =>
    set(() => ({
      rotationIndex: 0,
    })),
}));
