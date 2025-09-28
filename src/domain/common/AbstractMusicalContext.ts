import { PitchClass } from './PitchClass';
import { DegreeAnalysisResult, DegreeWithAccidental, Scale } from '../scale';
import { Chord } from '../chord';
import { ChordPattern } from './ChordPattern';
import { Interval } from './Interval';
import type { IMusicalContext, IAnalysisResult, KeyDTO } from './IMusicalContext';
import { KeySignature } from './KeySignature';

/**
 * 音楽的文脈の抽象基底クラス
 *
 * Key（調性音楽）とModalContext（旋法音楽）の共通機能を提供。
 * 音楽理論の基本概念（度数、ローマ数字表記、基本的な和音構築）を実装。
 */
export abstract class AbstractMusicalContext implements IMusicalContext {
  /** 中心音（調性音楽のトニック、旋法音楽の中心音） */
  public readonly centerPitch: PitchClass;

  /** この文脈で使用されるスケール */
  public readonly scale: Scale;

  /** この文脈に対応する調号 */
  public readonly keySignature: KeySignature;

  /** ダイアトニックコードのキャッシュ（初回計算時に保存） */
  protected _diatonicChordsCache: readonly Chord[] | null = null;

  // ローマ数字定数
  private static readonly ROMAN_NUMERALS = ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ', 'Ⅵ', 'Ⅶ'] as const;

  /**
   * 抽象基底クラスのコンストラクタ
   * @param centerPitch 中心音となる音名
   * @param scale この文脈で使用されるスケール
   * @param keySignature この文脈に対応する調号（依存性注入）
   */
  protected constructor(centerPitch: PitchClass, scale: Scale, keySignature: KeySignature) {
    this.centerPitch = centerPitch;
    this.scale = scale;
    this.keySignature = keySignature;
  }

  // === 静的ユーティリティメソッド ===

  /**
   * 度数からローマ数字表記を取得する共通ユーティリティ関数
   * @param degree 度数（1-7）
   * @returns 度数名（ローマ数字）（例: "Ⅰ", "Ⅱ", "Ⅲ"）
   * @throws {Error} degree が 1-7 の範囲外の場合
   */
  public static getDegreeNameFromNumber(degreeWithAccidental: DegreeWithAccidental): string {
    const { degree, accidental } = degreeWithAccidental;
    if (degree < 1 || degree > 7) {
      throw new Error('度数は1から7の間で指定してください。');
    }

    return accidental.getSymbol() + AbstractMusicalContext.ROMAN_NUMERALS[degree - 1];
  }

  // === 共通インスタンスメソッド ===

  /**
   * 指定された度数の三和音を構築する共通メソッド
   * スケール内の音で構成された三和音を返す
   * @param degree 度数（1から7）
   * @returns 対応するChord
   * @throws {Error} 度数が1-7の範囲外の場合
   */
  public buildTriad(degree: number): Chord {
    if (degree < 1 || degree > 7) {
      throw new Error('度数は1から7の間で指定してください。');
    }

    const scaleNotes = this.scale.getNotes(); // 7音の配列
    const root = scaleNotes[degree - 1];
    if (!root) {
      throw new Error(`${degree}度の音が見つかりませんでした。`);
    }

    // スケール内で3度・5度を取得
    const third = scaleNotes[(degree + 1) % 7];
    const fifth = scaleNotes[(degree + 3) % 7];

    // 半音距離を計算
    const interval3 = Interval.between(root._pitchClass, third._pitchClass);
    const interval5 = Interval.between(root._pitchClass, fifth._pitchClass);

    const quality = ChordPattern.findByIntervals([interval3, interval5]);
    if (!quality) throw new Error('未知のコード品質');

    return Chord.from(root, quality);
  }

  /**
   * 音楽的文脈の完全名を取得する
   * hasMajorThirdの結果に基づいて調号を選択
   * @returns 音楽的文脈の完全名（例: "C Major", "D Dorian", "A Minor"）
   */
  get contextName(): string {
    const pitchName = this.scale.pattern.hasMajorThird
      ? this.centerPitch.flatName
      : this.centerPitch.sharpName;
    return `${pitchName} ${this.scale.pattern.name}`;
  }

  /**
   * UI表示用の短縮名を取得する
   * shortSymbolを活用した汎用的な実装
   * @returns UI表示用の短縮名（例: "C", "Ddor", "Am"）
   */
  get shortName(): string {
    const pitchName = this.scale.pattern.hasMajorThird
      ? this.centerPitch.flatName
      : this.centerPitch.sharpName;
    return `${pitchName}${this.scale.pattern.shortSymbol}`;
  }

  /**
   * このコンテキストのダイアトニックコードの情報一覧を返す
   * ベース実装では和声機能分析を含まない基本的な情報のみ提供
   * @returns ダイアトニックコード情報の配列（分析結果とコードオブジェクトを含む）
   */
  public getDiatonicChordsInfo(): IAnalysisResult[] {
    return this.diatonicChords.map(chord => {
      return {
        ...this.analyzeChord(chord),
      };
    });
  }

  /**
   * ダイアトニック和音一覧を返す（キャッシュ機能付き共通実装）
   * 計算は初回アクセス時に一度だけ実行される
   * @returns この文脈におけるダイアトニック和音の配列
   */
  get diatonicChords(): readonly Chord[] {
    // キャッシュが既に計算済みならそれを返す
    if (this._diatonicChordsCache !== null) {
      return this._diatonicChordsCache;
    }

    // キャッシュが空ならここで初めて計算する
    const chords: Chord[] = [];

    // 1度から7度まで各度数の三和音を生成
    for (let degree = 1; degree <= 7; degree++) {
      try {
        const chord = this.buildTriad(degree);
        chords.push(chord);
      } catch {
        // 認識できないコード品質の場合はスキップ
        continue;
      }
    }

    // 計算結果をキャッシュに保存し、返す
    this._diatonicChordsCache = Object.freeze(chords);
    return this._diatonicChordsCache;
  }

  /**
   * 指定された和音をこの文脈で分析する（共通実装）
   * 基本的な度数分析とダイアトニック判定を提供
   * @param chord 分析対象の和音
   * @returns 基本分析結果（ローマ数字、ダイアトニック判定）
   */
  public analyzeChord(chord: Chord): IAnalysisResult {
    const steps = PitchClass.modulo12(chord.rootNote._pitchClass.index - this.centerPitch.index);
    const degreeAnalysisResult: DegreeAnalysisResult = this.scale.getDegreeFromSteps(steps);
    const [flatDegreeName, sharpDegreeName] = [
      chord.quality.getChordDegreeName(
        AbstractMusicalContext.getDegreeNameFromNumber(degreeAnalysisResult.flatNotation)
      ),
      chord.quality.getChordDegreeName(
        AbstractMusicalContext.getDegreeNameFromNumber(degreeAnalysisResult.sharpNotation)
      ),
    ];
    return {
      ...degreeAnalysisResult,
      chord,
      isDiatonic: this.isDiatonicChord(chord),
      sharpDegreeName,
      flatDegreeName,
      perfectDegreeName: degreeAnalysisResult.isScaleDegree
        ? flatDegreeName
        : sharpDegreeName + ' / ' + flatDegreeName,
    };
  }

  /**
   * 指定されたコードがこの文脈においてダイアトニックかどうかを判定する
   * @param chord 判定対象のコード
   * @returns ダイアトニックの場合true
   */
  public isDiatonicChord(chord: Chord): boolean {
    return this.diatonicChords.some(diatonicChord => chord.equals(diatonicChord));
  }

  /**
   * この文脈の相対的メジャートニックを返す
   * 抽象メソッド - サブクラスで具体的な実装を提供する
   * @returns 相対的メジャートニックのPitchClass
   */
  public abstract getRelativeMajorTonic(): PitchClass;

  /**
   * JSON形式で出力（共通実装）
   */
  public toJSON(): KeyDTO {
    return {
      shortName: this.shortName,
      contextName: this.contextName,
      fifthsIndex: this.centerPitch.fifthsIndex,
      type: 'modal', // デフォルト値
      isMajor: false, // デフォルト値（Keyクラスでオーバーライド）
    };
  }
}
