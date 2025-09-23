/**
 * キーエリア動作統合フック
 *
 * useKeyStateとuseKeyInteractionを組み合わせたcomposition hook。
 * 動作・インタラクション・状態管理の責務に特化し、
 * 表示関連の処理は useKeyAreaPresentation に分離している。
 */

import { useCircleOfFifthsStore } from '@/stores/circleOfFifthsStore';
import type { KeyDTO } from '@/domain/common/IMusicalContext';
import type { CircleSegmentDTO } from '@/domain/services/CircleOfFifths';
import { useAudio } from './useAudio';
import { useKeyState, type KeyAreaStates } from './useKeyState';
import { useKeyInteraction, type KeyAreaHandlers } from './useKeyInteraction';
import { useRippleEffect } from './useRippleEffect';

/**
 * useKeyAreaBehaviorフックの引数型
 */
export interface UseKeyAreaBehaviorProps {
  /** キーのDTO */
  keyDTO: KeyDTO;
  /** セグメントの情報 */
  segment: CircleSegmentDTO;
}

/**
 * useKeyAreaBehaviorフックの戻り値型
 */
export interface UseKeyAreaBehaviorResult {
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
 * キーエリアの動作管理とインタラクション処理を統合するcomposition hook
 *
 * 状態計算（useKeyState）とイベントハンドリング（useKeyInteraction）を
 * 組み合わせて、キーエリアの動作に必要な機能を提供します。
 * 表示関連の処理は useKeyAreaPresentation で分離されています。
 *
 * 責務分離により：
 * - 動作と表示の明確な分離
 * - テスタビリティの向上
 * - 個別フックの再利用性向上
 * - コードの可読性・保守性向上
 *
 * @param props - フックの引数
 * @returns キーエリアの動作状態とハンドラ
 */
export const useKeyAreaBehavior = ({
  keyDTO,
  segment,
}: UseKeyAreaBehaviorProps): UseKeyAreaBehaviorResult => {
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
