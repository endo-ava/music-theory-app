import { useMemo } from 'react';
import { useCurrentKeyStore } from '@/stores/currentKeyStore';
import { useCircleOfFifthsStore } from '@/features/circle-of-fifths/stores/circleOfFifthsStore';
import { createChordInfo } from '../utils';

/**
 * 選択されたコード情報を提供するカスタムフック
 *
 * Circle of Fifths上で選択されたキーからコード情報を生成し、
 * 現在のキーコンテキストでの音楽理論分析結果を提供する。
 * ユーザーの選択操作に対してリアルタイムで更新される。
 *
 * @returns 選択されたコードの分析結果と選択状態
 * @returns selectedChordInfo - 選択されたコードの詳細情報（nullの場合は未選択）
 * @returns hasSelection - コードが選択されているかどうかのブールフラグ
 *
 */
export const useSelectedChordInfo = () => {
  const { currentKey } = useCurrentKeyStore();
  const { selectedKey } = useCircleOfFifthsStore();

  /**
   * 選択されたコード情報のメモ化
   */
  const selectedChordInfo = useMemo(
    () => createChordInfo(selectedKey, currentKey),
    [selectedKey, currentKey]
  );

  return {
    selectedChordInfo,
    hasSelection: selectedChordInfo !== null,
  };
};
