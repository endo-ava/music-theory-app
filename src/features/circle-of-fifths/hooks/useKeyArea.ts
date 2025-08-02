import { useCallback, useMemo } from 'react';
import { useCircleOfFifthsStore } from '@/features/circle-of-fifths/store';
import { KeyDTO } from '@/domain/key';

import { useAudio } from './useAudio';
import { CircleSegmentDTO } from '../../../domain/services/CircleOfFifths';

/**
 * useKeyAreaフックが必要とするプロパティの型定義
 * @interface UseKeyAreaProps
 */
export interface UseKeyAreaProps {
  /** キーの名前（例: "C", "F#", "Bb"など） */
  keyDTO: KeyDTO;
  /** 五度圏上のセグメント情報（位置やスタイル情報を含む） */
  segment: CircleSegmentDTO;
}

/**
 * KeyAreaコンポーネントのロジックを集約したカスタムフック。
 * 五度圏上のキーエリアの状態管理、イベントハンドリング、派生状態の計算を担当する。
 *
 * @param props - フックの設定オプション
 * @param props.key - Key軽量ドメインオブジェクト
 * @param props.segment - 五度圏上のセグメント情報（位置、スタイル等）
 *
 * @returns フックの戻り値
 * @returns returns.states - UIの表示状態
 * @returns returns.states.isSelected - このキーが選択されているかどうか
 * @returns returns.states.isHovered - このキーがホバーされているかどうか
 * @returns returns.states.fillClassName - キーエリアの背景色クラス名
 * @returns returns.states.textClassName - キーテキストのスタイルクラス名
 * @returns returns.handlers - イベントハンドラー群
 * @returns returns.handlers.handleClick - クリック時の処理（キー選択＋音響再生）
 * @returns returns.handlers.handleMouseEnter - マウスエンター時の処理（ホバー状態設定）
 * @returns returns.handlers.handleMouseLeave - マウスリーブ時の処理（ホバー状態解除）
 *
 */
export const useKeyArea = ({ keyDTO: key, segment }: UseKeyAreaProps) => {
  const { position } = segment;
  const { selectedKey, hoveredKey, setSelectedKey, setHoveredKey } = useCircleOfFifthsStore();
  const { playMajorChordAtPosition, playMinorChordAtPosition } = useAudio();

  // 派生状態（選択、ホバー）をまとめて計算し、メモ化
  const states = useMemo(() => {
    const isSelected =
      selectedKey?.shortName === key.shortName && selectedKey?.isMajor === key.isMajor;
    const isHovered =
      hoveredKey?.shortName === key.shortName && hoveredKey?.isMajor === key.isMajor;

    let fillClassName = key.isMajor ? 'fill-key-area-major' : 'fill-key-area-minor';
    if (isSelected) {
      fillClassName = 'fill-key-area-selected';
    } else if (isHovered) {
      fillClassName = 'fill-key-area-hover';
    }

    const textClassName = key.isMajor
      ? 'text-key-major font-key-major'
      : 'text-key-minor font-key-minor';

    return {
      isSelected,
      isHovered,
      fillClassName,
      textClassName,
    };
  }, [selectedKey, hoveredKey, key.shortName, key.isMajor]);

  // クリック時の処理をuseCallbackでメモ化
  const handleClick = useCallback(() => {
    setSelectedKey(key);
    // 音響再生: メジャーキーならメジャートライアド、マイナーキーならマイナートライアドを再生
    const playChordFunction = key.isMajor ? playMajorChordAtPosition : playMinorChordAtPosition;
    playChordFunction(position);
  }, [key, position, setSelectedKey, playMajorChordAtPosition, playMinorChordAtPosition]);

  // マウスエンター時の処理
  const handleMouseEnter = useCallback(() => {
    setHoveredKey(key);
  }, [setHoveredKey, key]);

  // マウスリーブ時の処理
  const handleMouseLeave = useCallback(() => {
    setHoveredKey(null);
  }, [setHoveredKey]);

  return {
    states,
    handlers: {
      handleClick,
      handleMouseEnter,
      handleMouseLeave,
    },
  };
};
