/**
 * キーエリアインタラクションフック
 *
 * キーエリアのイベントハンドリング（クリック、ホバー）を管理する専用フック。
 * 責務をイベントハンドリングのみに限定し、状態計算とは分離している。
 */

import { useCallback } from 'react';
import { KeyDTO, ScalePattern } from '@/domain';
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
  /** コード再生関数 */
  playChordAtPosition: (position: number, isMajor: boolean) => Promise<void>;
  /** スケール再生関数 */
  playScaleAtPosition: (position: number, scalePattern: ScalePattern) => Promise<void>;
  /** リップルエフェクトトリガー関数 */
  onRippleTrigger?: () => void;
}

/**
 * キーエリアのイベントハンドラ群
 */
export interface KeyAreaHandlers {
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
  playChordAtPosition,
  playScaleAtPosition,
  onRippleTrigger,
}: UseKeyInteractionProps): KeyAreaHandlers {
  const { setCurrentKey } = useCurrentKeyStore();

  // "ショートクリック" のアクション
  const handleClick = useCallback(() => {
    setSelectedKey(keyDTO);
    playChordAtPosition(position, keyDTO.isMajor);
  }, [keyDTO, position, setSelectedKey, playChordAtPosition]);

  // "ロングプレス" のアクション
  const handleLongPress = useCallback(() => {
    const key = Key.fromCircleOfFifths(keyDTO.fifthsIndex, keyDTO.isMajor);
    setSelectedKey(keyDTO);
    setCurrentKey(key);
    playScaleAtPosition(position, keyDTO.isMajor ? ScalePattern.Major : ScalePattern.Aeolian);
  }, [keyDTO, position, setSelectedKey, setCurrentKey, playScaleAtPosition]);

  // ロングプレス開始時の処理
  const handleLongPressStart = useCallback(() => {
    onRippleTrigger?.();
  }, [onRippleTrigger]);

  // ホバー時の処理
  const handleMouseEnter = useCallback(() => {
    setHoveredKey(keyDTO);
  }, [setHoveredKey, keyDTO]);

  // すべての判定を useLongPress に委ねる
  const longPressHandlers = useLongPress({
    onClick: handleClick,
    onLongPress: handleLongPress,
    onLongPressStart: handleLongPressStart,
    delay: 500,
  });

  const handleMouseLeave = useCallback(() => {
    setHoveredKey(null);
  }, [setHoveredKey]);

  return {
    onMouseEnter: handleMouseEnter,
    ...longPressHandlers,
    onMouseLeave: handleMouseLeave, // longPressHandlersのonMouseLeaveを上書き
  };
}
