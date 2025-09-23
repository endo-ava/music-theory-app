import type { PitchClass } from './PitchClass';
import type { DegreeAnalysisResult, Scale } from '../scale';
import type { Chord } from '../chord';

/**
 * 音楽的文脈のDTO型
 */
export interface KeyDTO {
  shortName: string;
  contextName: string;
  fifthsIndex: number;
  type: 'key' | 'modal';
  /** メジャーキーかどうか（デフォルト: false） */
  isMajor: boolean;
}

/**
 * 分析結果の基底インターフェース
 */
export type IAnalysisResult = DegreeAnalysisResult & {
  /** 分析対象の和音 */
  chord: Chord;
  /**ダイアトニックコードかどうか */
  isDiatonic: boolean;
  /** 完全な度数名（例：Diatonic: Ⅱ, not diatonic: '♯Ⅳ / ♭Ⅴ'） */
  perfectDegreeName: string;
  /** シャープ表記の度数名（♯Ⅱ，Ⅴ など） */
  sharpDegreeName: string;
  /** フラット表記の度数名 */
  flatDegreeName: string;
};

/**
 * 音楽的文脈インターフェース
 *
 * あらゆる音楽的「世界」が持つべき共通の契約を定義する。
 * KeyやModalContextなどの具体的な音楽的文脈が実装する。
 *
 * ## インターフェース設計方針
 *
 * ### 🟢 インターフェースに定義すべきもの
 * - **外部API**: フロントエンド層が直接利用する可能性のある機能
 * - **共通機能**: 調性・旋法を問わず全ての音楽的文脈で必要な基本機能
 * - **データアクセス**: 文脈の基本プロパティ（centerPitch, scale, contextName等）
 * - **主要分析機能**: 和音分析、度数分析、三和音構築など
 *
 * ### 🔶 実装クラスに留めるべきもの（protectedメソッド）
 * - **内部ユーティリティ**: サブクラス実装でのみ使用される補助的機能
 * - **実装の詳細**: より粒度の細かい制御を行う低レベル機能
 * - **中間処理**: 公開APIを構築するための部品的な機能
 *
 * ### 🔴 静的メソッド
 * - **クラスレベル機能**: インスタンスに依存しないユーティリティ
 * - **ファクトリメソッド**: インスタンス生成に関わる機能
 *
 */
export interface IMusicalContext {
  /** 中心音（調性音楽のトニック、旋法音楽の中心音） */
  readonly centerPitch: PitchClass;

  /** この文脈で使用されるスケール */
  readonly scale: Scale;

  /**
   * 音楽的文脈の完全名（例: "C Major", "D Dorian"）
   */
  readonly contextName: string;

  /**
   * UI表示用の短縮名（例: "C", "Ddor", "Am"）
   */
  readonly shortName: string;

  /**
   * ダイアトニック和音一覧を取得する
   * @returns この文脈におけるダイアトニック和音の配列
   */
  get diatonicChords(): readonly Chord[];

  /**
   * 指定された度数の三和音を構築する
   * @param degree 度数（1から7）
   * @returns 対応するChord
   */
  buildTriad(degree: number): Chord;

  /**
   * 指定された和音をこの文脈で分析する
   * @param chord 分析対象の和音
   * @returns 文脈固有の分析結果
   */
  analyzeChord(chord: Chord): IAnalysisResult;

  /**
   * このコンテキストのダイアトニックコードの情報一覧を返す
   * @returns ダイアトニックコード情報の配列（分析結果とコードオブジェクトを含む）
   */
  getDiatonicChordsInfo(): IAnalysisResult[];

  /**
   * 指定されたコードがこの文脈においてダイアトニックコードかどうかを判定する
   * @param chord 判定対象のコード
   * @returns ダイアトニックの場合true
   */
  isDiatonicChord(chord: Chord): boolean;

  /**
   * JSON形式で出力する
   * @returns KeyDTO形式のオブジェクト
   */
  toJSON(): KeyDTO;
}
