import { useMemo } from 'react';
import { LAYOUT_OFFSETS } from '../constants';
import { useLayerStore } from '@/stores/layerStore';
import { useDiatonicChordHighlight } from './useDiatonicChordHighlight';
import { useFunctionalHarmonyData } from './useFunctionalHarmonyData';
import { getMusicColorVariable } from '@/shared/utils/musicColorSystem';
import type { Point } from '@/shared/types/graphics';
import type { IMusicalContext, KeyDTO } from '@/domain';

/**
 * キーエリアプレゼンテーション統合フック
 *
 * 以下の表示関連機能を統合:
 * - ダイアトニックハイライト判定
 * - 機能和声表示判定
 * - レイアウト計算（テキスト位置調整）
 * - 色計算（リップル色等）
 *
 * 責務を描画・表示に特化することで、関連する計算を一箇所にまとめ、
 * コンポーネントのprops数を削減し、保守性を向上させる。
 */

/**
 * useKeyAreaPresentationフックの引数型
 */
export interface UseKeyAreaPresentationProps {
  /** 対象キーのDTO */
  keyDTO: KeyDTO;
  /** テキストの基準位置 */
  textPosition: Point;
  /** 現在のキー */
  currentKey: IMusicalContext;
}

/**
 * キーエリアプレゼンテーション情報
 */
export interface KeyAreaPresentationInfo {
  /** ダイアトニックハイライト表示するべきか */
  readonly shouldHighlight: boolean;
  /** ローマ数字表記（ダイアトニック度数） */
  readonly romanNumeral: string | null;
  /** 各keyAreaの色（CSS変数形式） */
  readonly keyAreaColor: string;
  /** テキストレイアウト計算結果 */
  readonly layout: {
    /** プライマリテキストのY座標 */
    readonly primaryTextY: number;
    /** ローマ数字テキストのY座標 */
    readonly romanTextY: number;
    /** ローマ数字テキストのX座標（デュアルレイヤー対応） */
    readonly romanNumeralX: number;
  };
}

/**
 * キーエリアの表示関連情報を統合計算するフック
 *
 * ダイアトニックハイライト状態、レイアウト調整、色情報を
 * 一括で計算し、メモ化して提供します。
 *
 * 従来の以下を統合:
 * - useDiatonicChordHighlight().getHighlightInfo()
 * - useKeyAreaLayout()
 * - getMusicColorVariable()
 *
 * 責務分離の原則に従い、外部状態(currentKey)は注入により受け取る。
 *
 * @param props - フックの引数
 * @returns キーエリアプレゼンテーション情報
 */
export const useKeyAreaPresentation = ({
  keyDTO,
  textPosition,
  currentKey,
}: UseKeyAreaPresentationProps): KeyAreaPresentationInfo => {
  // ダイアトニックハイライト情報を取得
  const { getHighlightInfo } = useDiatonicChordHighlight(currentKey);

  // 機能和声データを取得
  const functionalHarmonyData = useFunctionalHarmonyData(currentKey);

  // レイヤー表示状態を取得
  const { isDiatonicVisible, isFunctionalHarmonyVisible } = useLayerStore();

  return useMemo(() => {
    // ダイアトニックハイライト判定
    const { shouldHighlight, romanNumeral } = getHighlightInfo(keyDTO);

    // 機能和声表示判定（このkeyDTOが機能和声表示対象か）
    const hasFunctionalHarmony = functionalHarmonyData.some(
      data => data.fifthsIndex === keyDTO.fifthsIndex && data.isMajor === keyDTO.isMajor
    );

    // 色計算（音楽色相システム）
    const keyAreaColor = getMusicColorVariable(keyDTO);

    // デュアルレイヤー判定（両方のレイヤーが表示されているか）
    const bothLayersVisible = isDiatonicVisible && isFunctionalHarmonyVisible;

    // レイアウト計算（ローマ数字または機能和声表示時の位置調整）
    // ダイアトニックレイヤーまたは機能和声レイヤーが表示される場合、キー名を上に移動
    const shouldOffsetText = (shouldHighlight && romanNumeral) || hasFunctionalHarmony;

    const layout = {
      primaryTextY: shouldOffsetText
        ? textPosition.y + LAYOUT_OFFSETS.PRIMARY_Y_OFFSET
        : textPosition.y,
      romanTextY: textPosition.y + LAYOUT_OFFSETS.ROMAN_Y_OFFSET,
      // 両方のレイヤーがONの場合、ローマ数字を左にオフセット
      romanNumeralX: bothLayersVisible
        ? textPosition.x - LAYOUT_OFFSETS.DUAL_LAYER_X_OFFSET
        : textPosition.x,
    };

    return {
      shouldHighlight,
      romanNumeral,
      keyAreaColor,
      layout,
    };
  }, [
    keyDTO.shortName,
    keyDTO.isMajor,
    keyDTO.fifthsIndex,
    textPosition.x,
    textPosition.y,
    getHighlightInfo,
    currentKey?.shortName,
    functionalHarmonyData,
    isDiatonicVisible,
    isFunctionalHarmonyVisible,
  ]);
};
