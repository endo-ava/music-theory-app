/**
 * キーエリア統合フック
 *
 * useKeyStateとuseKeyInteractionを組み合わせたcomposition hook。
 * 状態計算とイベントハンドリングの責務を分離しつつ、
 * 既存のAPIとの互換性を保持している。
 */

import { useCircleOfFifthsStore } from '@/features/circle-of-fifths/store';
import type { KeyDTO } from '@/domain/key';
import type { CircleSegmentDTO } from '@/domain/services/CircleOfFifths';
import { useAudio } from './useAudio';
import { useKeyState, type KeyAreaStates } from './useKeyState';
import { useKeyInteraction, type KeyAreaHandlers } from './useKeyInteraction';
import { useRippleEffect } from './useRippleEffect';

/**
 * useKeyAreaフックの引数型
 */
export interface UseKeyAreaProps {
  /** キーのDTO */
  keyDTO: KeyDTO;
  /** セグメントの情報 */
  segment: CircleSegmentDTO;
}

/**
 * useKeyAreaフックの戻り値型
 */
export interface UseKeyAreaResult {
  /** キーエリアの状態情報 */
  states: KeyAreaStates;
  /** イベントハンドラ群 */
  handlers: KeyAreaHandlers;
  /** リップルエフェクトの状態 */
  ripple: {
    isRippleActive: boolean;
    triggerRipple: () => void;
    resetRipple: () => void;
  };
}

/**
 * キーエリアの状態管理とインタラクション処理を統合するcomposition hook
 *
 * 状態計算（useKeyState）とイベントハンドリング（useKeyInteraction）を
 * 組み合わせて、キーエリアに必要なすべての機能を提供します。
 *
 * 責務分離により：
 * - テスタビリティの向上
 * - 個別フックの再利用性向上
 * - コードの可読性・保守性向上
 *
 * @param props - フックの引数
 * @returns キーエリアの状態とハンドラ
 */
export const useKeyArea = ({ keyDTO, segment }: UseKeyAreaProps): UseKeyAreaResult => {
  const { position } = segment;
  const { selectedKey, hoveredKey, setSelectedKey, setHoveredKey } = useCircleOfFifthsStore();
  const { playChordAtPosition, playScaleAtPosition } = useAudio();

  // リップルエフェクトの状態管理
  const ripple = useRippleEffect();

  // 状態計算（選択・ホバー状態、クラス名）
  const states = useKeyState({
    keyDTO,
    selectedKey,
    hoveredKey,
  });

  // イベントハンドリング（クリック、ホバー）
  const handlers = useKeyInteraction({
    keyDTO,
    position,
    setSelectedKey,
    setHoveredKey,
    playChordAtPosition,
    playScaleAtPosition,
    onRippleTrigger: ripple.triggerRipple,
  });

  return {
    states,
    handlers,
    ripple,
  };
};
