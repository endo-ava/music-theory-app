import { useMemo, useCallback } from 'react';
import { useLayerStore } from '@/stores/layerStore';
import { Key, KeyDTO } from '@/domain';

/**
 * ダイアトニックコード識別用の複合キー型
 * fifthsIndex と isMajor を組み合わせた一意識別子
 */
type CompositeKey = string & { readonly __brand: unique symbol };

/**
 * 五度圏インデックスとメジャー/マイナー情報から複合キーを生成
 * @param fifthsIndex - 五度圏上のインデックス
 * @param isMajor - メジャーキーかどうか
 * @returns 一意の複合キー
 */
const createCompositeKey = (fifthsIndex: number, isMajor: boolean): CompositeKey =>
  `${fifthsIndex}-${isMajor}` as CompositeKey;

/**
 * ダイアトニックコードハイライト用のカスタムフック
 *
 * 現在のキーとレイヤー設定に基づいて、
 * 指定されたキーがダイアトニックコードとしてハイライト表示されるべきかを判定する。
 */
export const useDiatonicChordHighlight = (currentKey: Key) => {
  const { isDiatonicChordsVisible } = useLayerStore();

  // ダイアトニックコード情報を一括計算してMapで管理
  const diatonicChordMap = useMemo(() => {
    const chordMap = new Map<CompositeKey, { romanNumeral: string; shouldHighlight: boolean }>();

    if (!isDiatonicChordsVisible) {
      return chordMap;
    }

    // 現在のキーのダイアトニックコード情報を取得
    const diatonicChordInfo = currentKey.getDiatonicChordsInfo();

    diatonicChordInfo.forEach(info => {
      const chordRootFifthsIndex = info.chord.rootNote._pitchClass.fifthsIndex;
      const chordIsMajor = info.chord.quality.quality === 'major';

      // 型安全な複合キー生成
      const compositeKey = createCompositeKey(chordRootFifthsIndex, chordIsMajor);

      chordMap.set(compositeKey, {
        romanNumeral: info.flatDegreeName,
        shouldHighlight: true,
      });
    });

    return chordMap;
  }, [currentKey, isDiatonicChordsVisible]);

  // KeyAreaが呼び出すための関数を提供
  const getHighlightInfo = useCallback(
    (keyDTO: KeyDTO) => {
      const keyFifthsIndex = keyDTO.fifthsIndex;
      const keyIsMajor = keyDTO.isMajor;

      // 型安全な複合キー生成で検索
      const compositeKey = createCompositeKey(keyFifthsIndex, keyIsMajor);
      const chordData = diatonicChordMap.get(compositeKey);

      if (chordData) {
        return {
          shouldHighlight: chordData.shouldHighlight,
          romanNumeral: chordData.romanNumeral,
        };
      }

      return {
        shouldHighlight: false,
        romanNumeral: null,
      };
    },
    [diatonicChordMap]
  );

  return {
    getHighlightInfo,
  };
};
