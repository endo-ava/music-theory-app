/**
 * キーエリアインタラクションフック
 *
 * キーエリアのイベントハンドリング（クリック、ホバー）を管理する専用フック。
 * 責務をイベントハンドリングのみに限定し、状態計算とは分離している。
 */

import { useCallback } from 'react';
import type { KeyDTO } from '@/domain';

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
}

/**
 * キーエリアのイベントハンドラ群
 */
export interface KeyAreaHandlers {
  /** クリックハンドラ */
  readonly handleClick: () => void;
  /** マウスエンターハンドラ */
  readonly handleMouseEnter: () => void;
  /** マウスリーブハンドラ */
  readonly handleMouseLeave: () => void;
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
}: UseKeyInteractionProps): KeyAreaHandlers {
  // クリック時の処理をuseCallbackでメモ化
  const handleClick = useCallback(() => {
    setSelectedKey(keyDTO);

    // 音響再生: メジャーキーならメジャートライアド、マイナーキーならマイナートライアドを再生
    const playChordFunction = keyDTO.isMajor ? playMajorChordAtPosition : playMinorChordAtPosition;
    playChordFunction(position);
  }, [keyDTO, position, setSelectedKey, playMajorChordAtPosition, playMinorChordAtPosition]);

  // マウスエンター時の処理
  const handleMouseEnter = useCallback(() => {
    setHoveredKey(keyDTO);
  }, [setHoveredKey, keyDTO]);

  // マウスリーブ時の処理
  const handleMouseLeave = useCallback(() => {
    setHoveredKey(null);
  }, [setHoveredKey]);

  return {
    handleClick,
    handleMouseEnter,
    handleMouseLeave,
  };
}
