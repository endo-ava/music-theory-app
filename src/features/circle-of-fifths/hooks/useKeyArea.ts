import { useCallback, useMemo } from 'react';
import { useCircleOfFifthsStore } from '@/features/circle-of-fifths/store';
import { Key, CircleSegment as CircleSegmentType } from '@/features/circle-of-fifths/types';
import { useAudio } from './useAudio';
import { FifthsIndex } from '@/domain';

// フックが必要とするProps
export interface UseKeyAreaProps {
  keyName: string;
  isMajor: boolean;
  segment: CircleSegmentType;
}

/**
 * KeyAreaコンポーネントのロジックを集約したカスタムフック。
 * 状態管理、イベントハンドリング、派生状態の計算を担当する。
 * @param props - コンポーネントから受け取るプロパティ
 * @returns {object} ビューのレンダリングに必要な状態とハンドラー
 */
export const useKeyArea = ({ keyName, isMajor, segment }: UseKeyAreaProps) => {
  const { position } = segment;
  const { selectedKey, hoveredKey, setSelectedKey, setHoveredKey } = useCircleOfFifthsStore();
  const { playMajorChordAtPosition, playMinorChordAtPosition } = useAudio();

  // 派生状態（選択、ホバー）をまとめて計算し、メモ化
  const states = useMemo(() => {
    const isSelected = selectedKey?.name === keyName && selectedKey?.isMajor === isMajor;
    const isHovered = hoveredKey?.name === keyName && hoveredKey?.isMajor === isMajor;

    let fillClassName = isMajor ? 'fill-key-area-major' : 'fill-key-area-minor';
    if (isSelected) {
      fillClassName = 'fill-key-area-selected';
    } else if (isHovered) {
      fillClassName = 'fill-key-area-hover';
    }

    const textClassName = isMajor
      ? 'text-key-major font-key-major'
      : 'text-key-minor font-key-minor';

    return {
      isSelected,
      isHovered,
      fillClassName,
      textClassName,
    };
  }, [selectedKey, hoveredKey, keyName, isMajor]);

  // propsからkeyDataをメモ化
  const keyData = useMemo<Key>(
    () => ({ name: keyName, isMajor, position }),
    [keyName, isMajor, position]
  );

  // クリック時の処理をuseCallbackでメモ化
  const handleClick = useCallback(() => {
    setSelectedKey(keyData);
    // 音響再生: メジャーキーならメジャートライアド、マイナーキーならマイナートライアドを再生
    if (isMajor) {
      playMajorChordAtPosition(position as FifthsIndex);
    } else {
      playMinorChordAtPosition(position as FifthsIndex);
    }
  }, [
    keyData,
    isMajor,
    position,
    setSelectedKey,
    playMajorChordAtPosition,
    playMinorChordAtPosition,
  ]);

  // マウスエンター時の処理
  const handleMouseEnter = useCallback(() => {
    setHoveredKey(keyData);
  }, [setHoveredKey, keyData]);

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
