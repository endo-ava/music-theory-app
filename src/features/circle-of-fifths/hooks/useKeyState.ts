/**
 * キーエリア状態計算フック
 *
 * キーエリアの表示状態（選択/ホバー/クラス名）を計算する専用フック。
 * 責務を状態計算のみに限定し、イベントハンドリングとは分離している。
 */

import { useMemo } from 'react';
import type { KeyDTO } from '@/domain';
import type { FillClassName, TextClassName } from '../types';
import { calculateFillClassName, calculateTextClassName, isKeyMatch } from '../utils/classNames';

/**
 * useKeyStateフックの引数型
 */
export interface UseKeyStateProps {
  /** 対象キーのDTO */
  keyDTO: KeyDTO;
  /** 現在選択されているキー */
  selectedKey: KeyDTO | null;
  /** 現在ホバーされているキー */
  hoveredKey: KeyDTO | null;
}

/**
 * キーエリアの状態情報
 */
export interface KeyAreaStates {
  /** 選択状態かどうか */
  readonly isSelected: boolean;
  /** ホバー状態かどうか */
  readonly isHovered: boolean;
  /** 塗りつぶし用クラス名 */
  readonly fillClassName: FillClassName;
  /** テキスト用クラス名 */
  readonly textClassName: TextClassName;
}

/**
 * キーエリアの状態計算を行うフック
 *
 * キーの選択状態、ホバー状態、および適切なCSSクラス名を計算します。
 * 計算結果はuseMemoでメモ化され、依存値が変更された場合のみ再計算されます。
 *
 * @param props - フックの引数
 * @returns キーエリアの状態情報
 */
export function useKeyState({ keyDTO, selectedKey, hoveredKey }: UseKeyStateProps): KeyAreaStates {
  return useMemo(() => {
    const isSelected = isKeyMatch(keyDTO, selectedKey);
    const isHovered = isKeyMatch(keyDTO, hoveredKey);

    return {
      isSelected,
      isHovered,
      fillClassName: calculateFillClassName(keyDTO, isSelected, isHovered),
      textClassName: calculateTextClassName(keyDTO),
    };
  }, [selectedKey, hoveredKey, keyDTO.shortName, keyDTO.isMajor]);
}
