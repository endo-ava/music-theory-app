import { useMemo } from 'react';
import { useCurrentKeyStore } from '@/stores/currentKeyStore';
import type { RelatedKeysInfo } from '../types';

/**
 * 現在のキーに関連するデータを提供するカスタムフック
 *
 * 現在アクティブなキーに関連するすべての情報をメモ化した形で提供する。
 * ダイアトニックスケール、コード進行、関連調などの
 * 音楽理論分析結果をパフォーマンス最適化された状態で提供。
 *
 * @returns 現在のキーに関連するデータセット
 * @returns currentKey - 現在のキーオブジェクト
 * @returns scaleNotes - ダイアトニックスケールの音符配列
 * @returns diatonicChords - ダイアトニックコード情報配列
 * @returns relatedKeys - 関連調情報（平行調、同主調、属調、下属調）
 * @returns japaneseScaleDegreeNames - 日本語の音度名配列（ド、レ、ミなど）
 *
 * @example
 * const { currentKey, scaleNotes, diatonicChords, relatedKeys } = useCurrentKeyData();
 *
 * // Cメジャーキーの場合
 * console.log(currentKey.contextName); // "C Major"
 * console.log(scaleNotes[0].name); // "C"
 * console.log(diatonicChords[0].romanDegreeName); // "I"
 * console.log(relatedKeys.relative.contextName); // "A minor"
 */
export const useCurrentKeyData = () => {
  const { currentKey } = useCurrentKeyStore();

  /**
   * ダイアトニックスケールの音符配列
   */
  const scaleNotes = useMemo(() => currentKey.scale.getNotes(), [currentKey]);

  /**
   * ダイアトニックコード情報配列
   */
  const diatonicChords = useMemo(() => currentKey.getDiatonicChordsInfo(), [currentKey]);

  /**
   * 関連調情報
   */
  const relatedKeys = useMemo<RelatedKeysInfo>(
    () => ({
      relative: currentKey.getRelativeKey(),
      parallel: currentKey.getParallelKey(),
      dominant: currentKey.getDominantKey(),
      subdominant: currentKey.getSubdominantKey(),
    }),
    [currentKey]
  );

  /**
   * 日本語音度名配列
   */
  const japaneseScaleDegreeNames = useMemo(() => currentKey.japaneseScaleDegreeNames, [currentKey]);

  return {
    currentKey,
    scaleNotes,
    diatonicChords,
    relatedKeys,
    japaneseScaleDegreeNames,
  };
};
