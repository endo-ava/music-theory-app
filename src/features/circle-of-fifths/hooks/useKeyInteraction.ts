/**
 * キーエリアインタラクションフック
 *
 * キーエリアのイベントハンドリング（クリック、ホバー）を管理する専用フック。
 * 責務をイベントハンドリングのみに限定し、状態計算とは分離している。
 */

import { useCallback } from 'react';
import type { KeyDTO } from '@/domain';
import { useLongPress } from './useLongPress';
import { useCurrentKeyStore } from '@/stores/currentKeyStore';
import { Key } from '@/domain/key';

/**
 * useKeyInteractionフックの引数型
 */
export interface UseKeyInteractionProps {
  /** 対象キーのDTO */
  keyDTO: KeyDTO;
  /** セグメントの位置 */
  position: number;
  /** キー選択状態を設定する関数 */
  setSelectedKey: (key: KeyDTO) => void;
  /** ホバー状態を設定する関数 */
  setHoveredKey: (key: KeyDTO | null) => void;
  /** メジャーコード再生関数 */
  playMajorChordAtPosition: (position: number) => Promise<void>;
  /** マイナーコード再生関数 */
  playMinorChordAtPosition: (position: number) => Promise<void>;
  /** リップルエフェクトトリガー関数 */
  onRippleTrigger?: () => void;
}

/**
 * キーエリアのイベントハンドラ群
 */
export interface KeyAreaHandlers {
  /** クリックハンドラ */
  readonly onClick: () => void;
  /** マウスエンターハンドラ */
  readonly onMouseEnter: () => void;
  /** マウスリーブハンドラ */
  readonly onMouseLeave: () => void;
  /** マウスダウンハンドラ（ロングプレス用） */
  readonly onMouseDown: (event: React.MouseEvent) => void;
  /** マウスアップハンドラ（ロングプレス用） */
  readonly onMouseUp: (event: React.MouseEvent) => void;
  /** マウスムーブハンドラ（ロングプレス用） */
  readonly onMouseMove: (event: React.MouseEvent) => void;
  /** タッチスタートハンドラ（ロングプレス用） */
  readonly onTouchStart: (event: React.TouchEvent) => void;
  /** タッチエンドハンドラ（ロングプレス用） */
  readonly onTouchEnd: (event: React.TouchEvent) => void;
  /** タッチムーブハンドラ（ロングプレス用） */
  readonly onTouchMove: (event: React.TouchEvent) => void;
}

/**
 * キーエリアのインタラクション処理を行うフック
 *
 * クリック時の選択処理・音響再生、ホバー時の状態変更を管理します。
 * すべてのハンドラはuseCallbackでメモ化され、不要な再レンダリングを防止します。
 *
 * @param props - フックの引数
 * @returns イベントハンドラ群
 */
export function useKeyInteraction({
  keyDTO,
  position,
  setSelectedKey,
  setHoveredKey,
  playMajorChordAtPosition,
  playMinorChordAtPosition,
  onRippleTrigger,
}: UseKeyInteractionProps): KeyAreaHandlers {
  const { setCurrentKey } = useCurrentKeyStore();

  // クリック時の処理をuseCallbackでメモ化
  const handleClick = useCallback(() => {
    setSelectedKey(keyDTO);

    // 音響再生: メジャーキーならメジャートライアド、マイナーキーならマイナートライアドを再生
    const playChordFunction = keyDTO.isMajor ? playMajorChordAtPosition : playMinorChordAtPosition;
    playChordFunction(position);
  }, [keyDTO, position, setSelectedKey, playMajorChordAtPosition, playMinorChordAtPosition]);

  // ロングプレス時の処理（ベースキー設定）
  const handleLongPress = useCallback(() => {
    const key = Key.fromCircleOfFifths(keyDTO.circleOfFifthsIndex, keyDTO.isMajor);
    setCurrentKey(key);
  }, [keyDTO, setCurrentKey]);

  // ロングプレス開始時の処理（リップルエフェクト用）
  const handleLongPressStart = useCallback(() => {
    // リップルエフェクトをトリガー
    onRippleTrigger?.();
  }, [onRippleTrigger]);

  // マウスエンター時の処理
  const handleMouseEnter = useCallback(() => {
    setHoveredKey(keyDTO);
  }, [setHoveredKey, keyDTO]);

  // マウスリーブ時の処理
  const handleMouseLeave = useCallback(() => {
    setHoveredKey(null);
  }, [setHoveredKey]);

  // ロングプレス機能の統合
  const longPressHandlers = useLongPress({
    onClick: handleClick,
    onLongPress: handleLongPress,
    onLongPressStart: handleLongPressStart,
    delay: 500,
  });

  // Combined mouse leave handler that handles both hover state and long press cancellation
  const combinedMouseLeave = useCallback(() => {
    handleMouseLeave(); // Clear hover state
    longPressHandlers.onMouseLeave(); // Cancel long press
  }, [handleMouseLeave, longPressHandlers]);

  return {
    // Standard React event handlers (properly named for DOM elements)
    onClick: handleClick,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: combinedMouseLeave,
    // Long press handlers
    onMouseDown: longPressHandlers.onMouseDown,
    onMouseUp: longPressHandlers.onMouseUp,
    onMouseMove: longPressHandlers.onMouseMove,
    onTouchStart: longPressHandlers.onTouchStart,
    onTouchEnd: longPressHandlers.onTouchEnd,
    onTouchMove: longPressHandlers.onTouchMove,
  };
}
