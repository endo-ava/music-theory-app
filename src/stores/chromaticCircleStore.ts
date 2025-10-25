import { create } from 'zustand';
import type { ChromaticSegmentDTO } from '@/domain/services/ChromaticCircle';

/**
 * クロマチックサークルの状態のZustandストア型定義
 *
 * アプリケーション全体で共有される状態
 */
export interface ChromaticCircleStore {
  /** 現在選択されているピッチクラス */
  selectedPitchClass: ChromaticSegmentDTO | null;
  /** 現在ホバーされているピッチクラス */
  hoveredPitchClass: ChromaticSegmentDTO | null;
  /** ピッチクラス選択のセッター */
  setSelectedPitchClass: (pitchClass: ChromaticSegmentDTO | null) => void;
  /** ピッチクラスホバーのセッター */
  setHoveredPitchClass: (pitchClass: ChromaticSegmentDTO | null) => void;
}

// ストアの作成
export const useChromaticCircleStore = create<ChromaticCircleStore>(set => ({
  // 初期状態
  selectedPitchClass: null,
  hoveredPitchClass: null,

  setSelectedPitchClass: (pitchClass: ChromaticSegmentDTO | null) =>
    set(() => ({
      selectedPitchClass: pitchClass,
    })),
  setHoveredPitchClass: (pitchClass: ChromaticSegmentDTO | null) =>
    set(() => ({
      hoveredPitchClass: pitchClass,
    })),
}));
