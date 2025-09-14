import type { PitchClass } from './PitchClass';
import type { Scale } from '../scale';
import type { Chord } from '../chord';

/**
 * 音楽的文脈インターフェース
 *
 * あらゆる音楽的「世界」が持つべき共通の契約を定義する。
 * KeyやModalContextなどの具体的な音楽的文脈が実装する。
 *
 * このインターフェースにより、アプリケーションは具体的な文脈
 * （調性か旋法か）を意識することなく、抽象的な「音楽的文脈」として
 * 一貫して扱えるようになる。
 */

/**
 * 分析結果の基底インターフェース
 */
export interface IAnalysisResult {
  /** ローマ数字表記の度数名 */
  romanDegreeName: string;
  /** ダイアトニックコードかどうか */
  isDiatonic: boolean;
}

/**
 * 音楽的文脈インターフェース
 *
 * @template T 分析結果の型（TonalChordAnalysisResult または ModalChordAnalysisResult）
 */
export interface IMusicalContext<T extends IAnalysisResult = IAnalysisResult> {
  /** 中心音（調性音楽のトニック、旋法音楽の中心音） */
  readonly centerPitch: PitchClass;

  /** この文脈で使用されるスケール */
  readonly scale: Scale;

  /**
   * ダイアトニック和音一覧を取得する
   * @returns この文脈におけるダイアトニック和音の配列
   */
  get diatonicChords(): readonly Chord[];

  /**
   * 指定された和音をこの文脈で分析する
   * @param chord 分析対象の和音
   * @returns 文脈固有の分析結果
   */
  analyzeChord(chord: Chord): T;
}
