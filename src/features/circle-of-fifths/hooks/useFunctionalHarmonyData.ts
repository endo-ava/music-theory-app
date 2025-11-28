import { useMemo } from 'react';
import { useLayerStore } from '@/stores/layerStore';
import type { IMusicalContext, IAnalysisResultWithFunction, Function } from '@/domain';
import type { Point } from '@/shared/types/graphics';
import { getCircleOfFifthsData } from '../utils/circleOfFifthsData';

/**
 * 機能和声レイヤーの色定義
 *
 * T（Tonic）、D（Dominant）、SD（Subdominant）を
 * それぞれ固有の色で表示するための定数
 */
const FUNCTIONAL_HARMONY_COLORS = {
  /** トニック（主和音）- 青系 */
  Tonic: 'hsl(200, 60%, 50%)',
  /** ドミナント（属和音）- オレンジ系 */
  Dominant: 'hsl(30, 80%, 50%)',
  /** サブドミナント（下属和音）- 紫系 */
  Subdominant: 'hsl(280, 60%, 50%)',
  Other: '',
} as const;

/**
 * 機能記号を取得
 * @param func - 和声機能
 * @returns 機能記号（T/D/SD）
 */
const getFunctionAbbreviation = (func: Function): string => {
  switch (func) {
    case 'Tonic':
      return 'T';
    case 'Dominant':
      return 'D';
    case 'Subdominant':
      return 'SD';
    default:
      return '';
  }
};

/**
 * 機能に応じた色を取得
 * @param func - 和声機能
 * @returns HSL色文字列
 */
const getFunctionalHarmonyColor = (func: Function): string => {
  return FUNCTIONAL_HARMONY_COLORS[func];
};

/**
 * 機能和声表示データ
 */
export interface FunctionalHarmonyDisplayData {
  /** 五度圏上の位置（0-11） */
  position: number;
  /** 和声機能 */
  function: Function;
  /** 機能記号（T/D/SD） */
  abbreviation: string;
  /** 機能色（HSL文字列） */
  color: string;
  /** テキスト表示位置 */
  textPosition: Point;
  /** メジャーキーかマイナーキーか */
  isMajor: boolean;
  /** 五度圏インデックス（keyDTOとの比較用） */
  fifthsIndex: number;
}

/**
 * 機能和声レイヤー用のデータを生成するカスタムフック
 *
 * 現在のキーのダイアトニック和音情報から、各和音の機能（T/D/SD）と
 * 五度圏上の表示位置を計算します。
 *
 * 責務:
 * - 機能和声データの計算ロジック（データ生成）
 * - 機能記号（abbreviation）と色（color）の計算
 * - 純粋関数（getFunctionAbbreviation, getFunctionalHarmonyColor）の提供
 *
 * コンポーネント（FunctionalHarmonyLayer）は、このフックから受け取ったデータを
 * そのまま描画するだけで、計算ロジックを持ちません。
 *
 * @param currentKey - 現在のキー
 * @returns 機能和声表示データの配列
 */
export const useFunctionalHarmonyData = (
  currentKey: IMusicalContext
): FunctionalHarmonyDisplayData[] => {
  const { isFunctionalHarmonyVisible } = useLayerStore();
  const { segments } = getCircleOfFifthsData();

  return useMemo(() => {
    if (!isFunctionalHarmonyVisible) {
      return [];
    }

    // 現在のキーのダイアトニック和音情報を取得（機能情報を含む）
    // Key クラスは IAnalysisResultWithFunction[] を返すが、IMusicalContext の型定義上は IAnalysisResult[]
    const diatonicChordsInfo = currentKey.getDiatonicChordsInfo() as IAnalysisResultWithFunction[];

    // 表示データを生成
    const displayData: FunctionalHarmonyDisplayData[] = [];

    diatonicChordsInfo.forEach(info => {
      // 和音のルート音のピッチクラスを取得
      const rootPitchClass = info.chord.rootNote.pitchClass;
      const chordIsMajor = info.chord.quality.quality === 'major';

      // 機能を変換（nullの場合はスキップ）
      if (!info.function) {
        return;
      }
      if (info.function === 'Other') {
        return; // 'Other'の場合はスキップ
      }

      // 五度圏上の対応するセグメントを見つける
      const segment = segments.find(seg => {
        const targetKey = chordIsMajor ? seg.segment.majorKey : seg.segment.minorKey;
        return targetKey.fifthsIndex === rootPitchClass.fifthsIndex;
      });

      if (!segment) {
        return; // セグメントが見つからない場合はスキップ
      }

      // テキスト位置を決定（メジャーはmajorTextPos、マイナーはminorTextPos）
      const textPosition = chordIsMajor
        ? segment.textPositions.majorTextPos
        : segment.textPositions.minorTextPos;

      displayData.push({
        position: segment.segment.position,
        function: info.function,
        abbreviation: getFunctionAbbreviation(info.function),
        color: getFunctionalHarmonyColor(info.function),
        textPosition,
        isMajor: chordIsMajor,
        fifthsIndex: rootPitchClass.fifthsIndex,
      });
    });

    return displayData;
  }, [currentKey, isFunctionalHarmonyVisible, segments]);
};
