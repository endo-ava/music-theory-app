import { useMemo } from 'react';
import { useLayerStore } from '@/stores/layerStore';
import { IMusicalContext } from '@/domain';

/**
 * ダイアトニックコード構成音ハイライト用のカスタムフック
 *
 * 現在のキーとレイヤー設定に基づいて、
 * ダイアトニックコードのルート音（= ダイアトニックスケール構成音）を
 * 半音インデックス（0-11）のSetとして返す。
 *
 * @param currentKey - 現在のキー（IMusicalContext）
 * @returns ハイライト対象のピッチクラス位置（0-11）のSet
 */
export const useDiatonicHighlight = (currentKey: IMusicalContext) => {
  const { isDiatonicChordsVisible } = useLayerStore();

  // ダイアトニックコードのルート音を半音インデックスのSetに変換
  const highlightPositions = useMemo(() => {
    const positions = new Set<number>();

    if (!isDiatonicChordsVisible) {
      return positions;
    }

    // 現在のキーのダイアトニックコード情報を取得
    const diatonicChordInfo = currentKey.getDiatonicChordsInfo();

    // 各ダイアトニックコードのルート音を抽出
    diatonicChordInfo.forEach(info => {
      const rootPitchClass = info.chord.rootNote._pitchClass;
      // 半音インデックス（0-11）をSetに追加
      positions.add(rootPitchClass.index);
    });

    return positions;
  }, [currentKey, isDiatonicChordsVisible]);

  // トニック（CurrentKeyの中心音）の位置
  const tonicPosition = useMemo(() => {
    if (!isDiatonicChordsVisible) {
      return null;
    }
    return currentKey.centerPitch.index;
  }, [currentKey, isDiatonicChordsVisible]);

  return {
    highlightPositions,
    tonicPosition,
    isVisible: isDiatonicChordsVisible,
  };
};
