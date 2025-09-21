import type { PitchClass } from './PitchClass';
import type { Scale } from '../scale';
import type { Chord } from '../chord';

/**
 * 度数分析の結果を表すインターフェース
 */
export interface DegreeResult {
  /** 度数（1-7） */
  degree: number;
  /** 度数名（ローマ数字表記、変化記号含む） */
  degreeName: string;
}

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
 *
 * @template T 分析結果の型（TonalChordAnalysisResult または ModalChordAnalysisResult）
 */
export interface IMusicalContext<T extends IAnalysisResult = IAnalysisResult> {
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
   * 指定された和音をこの文脈で分析する
   * @param chord 分析対象の和音
   * @returns 文脈固有の分析結果
   */
  analyzeChord(chord: Chord): T;

  /**
   * 指定された度数の三和音を構築する
   * @param degree 度数（1から7）
   * @returns 対応するChord
   */
  buildTriad(degree: number): Chord;

  /**
   * この文脈でPitchClassを分析し、度数と度数名を取得する
   * @param pitchClassToAnalyze 分析対象のPitchClass
   * @returns 度数（1-7）と度数名（ローマ数字表記）
   */
  analyzePitchClassInContext(pitchClassToAnalyze: PitchClass): DegreeResult;

  /**
   * このコンテキストのダイアトニックコードの情報一覧を返す
   * @returns ダイアトニックコード情報の配列（分析結果とコードオブジェクトを含む）
   */
  getDiatonicChordsInfo(): (IAnalysisResult & { chord: Chord })[];
}
