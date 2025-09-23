import { KeySignature, PitchClass, ScalePattern, ScaleQuality } from '../common';
import { Scale } from '../scale';
import { Chord } from '../chord';
import { AbstractMusicalContext } from '../common/AbstractMusicalContext';
import type { IAnalysisResult, IMusicalContext, KeyDTO } from '../common/IMusicalContext';

/** 和声機能（調性音楽における） */
type Function = 'Tonic' | 'Dominant' | 'Subdominant' | 'Other';

/** keyの品質（major or minor） */
type KeyQuality = Omit<ScaleQuality, 'diminished' | 'other'>;

/**
 * 調性的分析結果
 */
export interface IAnalysisResultWithFunction extends IAnalysisResult {
  function: Function | null;
}

/** 軽量なプレーンオブジェクト */

/**
 * Key（調性）集約
 *
 * 音楽の調性（キー）を表現する集約ルート。IMusicalContextを実装し、
 * 機能和声（Functional Harmony）のルールセットに基づき、音楽の調性的な文脈と機能的関係性を管理する。
 * 特定のPitchClassをトニック（主音）とするメジャー・マイナー調性を管理し、
 * ダイアトニック和音の生成、和声機能分析、関連調の導出などの責務を持つ。
 *
 * 音楽理論的背景:
 * - メジャー、またはマイナー（和声的短音階を含む）スケールに限定される
 * - 調的重力場（Tonal Gravity）の概念
 * - ダイアトニック和音の機能（トニック、ドミナント、サブドミナント）
 * - 関係調（平行調・同主調・属調・下属調）の体系
 */
export class Key extends AbstractMusicalContext {
  public readonly keyQuality: KeyQuality;
  /** 調号，五度圏の右側がシャープ */
  public readonly keySignature: KeySignature;

  // === 静的定数 ===

  // 日本語度数名定数（メジャーキー用）
  private static readonly JAPANESE_SCALE_DEGREE_NAMES_MAJOR = [
    '主音',
    '上主音',
    '中音',
    '下属音',
    '属音',
    '下中音',
    '導音',
  ] as const;

  // 日本語度数名定数（マイナーキー用）
  private static readonly JAPANESE_SCALE_DEGREE_NAMES_MINOR = [
    '主音',
    '上主音',
    '中音',
    '下属音',
    '属音',
    '下中音',
    '下主音', // ナチュラルマイナーの場合、第7音は「下主音」になる
  ] as const;

  // 五度圏でのシャープ系とフラット系の境界
  private static readonly SHARP_FLAT_BOUNDARY = 6; // F#/G♭(6)が境界

  // === A. 基本構造 ===

  /**
   * Keyを生成する（メジャー・マイナーのみサポート）
   * 外部からの直接生成は禁止。ファクトリーメソッドを使用すること
   * @param centerPitch 主音となる音名
   * @param scalePattern Major または Aeolian のみ許可
   * @throws {Error} Major/Aeolian以外が指定された場合
   */
  private constructor(centerPitch: PitchClass, scalePattern: ScalePattern) {
    // メジャー・マイナーのみに制限
    if (scalePattern !== ScalePattern.Major && scalePattern !== ScalePattern.Aeolian) {
      throw new Error('Key supports only Major and Minor (Aeolian) scales');
    }

    super(centerPitch, new Scale(centerPitch, scalePattern));
    this.keyQuality = this.scale.pattern.quality === 'major' ? 'major' : 'minor';
    // 五度圏でのシャープ系とフラット系の判定
    // C(0)からB(5)まではシャープ系、F#/G♭(6)からF(11)まではフラット系
    const normalizedIndex =
      this.keyQuality === 'major'
        ? this.centerPitch.fifthsIndex
        : PitchClass.modulo12(this.centerPitch.fifthsIndex - 3);
    this.keySignature = normalizedIndex < Key.SHARP_FLAT_BOUNDARY ? 'sharp' : 'flat';
  }

  /**
   * isMajorプロパティのゲッター
   * @returns メジャーキーかどうか
   */
  get isMajor(): boolean {
    return this.keyQuality === 'major';
  }

  /**
   * 日本語の音度名を取得する静的メソッド（オーバーロード）
   * メジャーキーでは第7音は「導音」、マイナーキーでは「下主音」となる
   * @param isMajor メジャーキーかどうか（省略時はメジャーキーとして扱う）
   * @returns 日本語の度数名配列
   */
  get japaneseScaleDegreeNames(): readonly string[] {
    return this.isMajor
      ? Key.JAPANESE_SCALE_DEGREE_NAMES_MAJOR
      : Key.JAPANESE_SCALE_DEGREE_NAMES_MINOR;
  }

  // === B. 静的ファクトリーメソッド・ユーティリティ ===

  /**
   * メジャーキーを生成する便利なファクトリーメソッド
   * @param centerPitch 主音となる音名
   * @returns メジャーキーのインスタンス
   */
  static major(tonic: PitchClass): Key {
    return new Key(tonic, ScalePattern.Major);
  }

  /**
   * マイナーキーを生成する便利なファクトリーメソッド
   * @param centerPitch 主音となる音名
   * @returns マイナーキーのインスタンス
   */
  static minor(centerPitch: PitchClass): Key {
    return new Key(centerPitch, ScalePattern.Aeolian);
  }

  /**
   * 五度圏インデックスからKeyを生成するファクトリーメソッド
   * @param circleIndex 五度圏インデックス (C=0, G=1, D=2, ..., F=5, Bb=6, Eb=7, ...)
   * @param isMajor メジャーキーかどうか（true: Major, false: 相対マイナー）
   * @returns 生成されたKeyインスタンス
   */
  static fromCircleOfFifths(circleIndex: number, isMajor: boolean): Key {
    const centerPitch = PitchClass.fromCircleOfFifths(circleIndex);
    return isMajor ? Key.major(centerPitch) : Key.minor(centerPitch);
  }

  // === C. ダイアトニックコード関連（集約の主要責務） ===

  /**
   * 主和音（トニックコード）を取得する
   * @returns メジャーキーのI、マイナーキーのiコード
   */
  getTonicChord(): Chord {
    return this.buildTriad(1);
  }

  /**
   * 属和音（ドミナントコード）を取得する
   * @returns メジャーキーのV、マイナーキーのVコード
   */
  getDominantChord(): Chord {
    return this.buildTriad(5);
  }

  /**
   * 下属和音（サブドミナントコード）を取得する
   * @returns メジャーキーのIV、マイナーキーのivコード
   */
  getSubdominantChord(): Chord {
    return this.buildTriad(4);
  }

  // === D. 分析・判定メソッド（外部向けAPI） ===

  /**
   * あらゆるコードとこのKeyとの関係性を分析する（調性音楽特有の拡張実装）
   * 基本分析に加えて和声機能分析を含む
   * @param chordToAnalyze 分析したいChordオブジェクト
   * @returns 調性的コード分析結果（ローマ数字、ダイアトニック判定、機能）
   */
  public override analyzeChord(chordToAnalyze: Chord): IAnalysisResultWithFunction {
    const baseResult = super.analyzeChord(chordToAnalyze);
    return {
      ...baseResult,
      function: baseResult.isDiatonic ? this.deriveFunction(baseResult.flatNotation.degree) : null,
    };
  }

  /**
   * 平行調（相対調）を取得する
   * メジャーキーの場合は相対マイナー、マイナーキーの場合は相対メジャーを返す
   * @returns 平行調のKeyインスタンス
   */
  public getRelativeKey(): Key {
    const relativeCenterPitch = this.isMajor
      ? PitchClass.fromCircleOfFifths(PitchClass.modulo12(this.centerPitch.fifthsIndex + 3))
      : PitchClass.fromCircleOfFifths(PitchClass.modulo12(this.centerPitch.fifthsIndex - 3));

    return this.isMajor ? Key.minor(relativeCenterPitch) : Key.major(relativeCenterPitch);
  }

  /**
   * 同主調を取得する
   * 同じトニックでメジャー・マイナーを切り替えた調
   * @returns 同主調のKeyインスタンス
   */
  public getParallelKey(): Key {
    return this.isMajor ? Key.minor(this.centerPitch) : Key.major(this.centerPitch);
  }

  /**
   * 属調（ドミナント調）を取得する
   * 五度圏で時計回りに1つ進んだ調
   * @returns 属調のKeyインスタンス
   */
  public getDominantKey(): Key {
    const dominantCenterPitch = PitchClass.fromCircleOfFifths(
      PitchClass.modulo12(this.centerPitch.fifthsIndex + 1)
    );
    return this.isMajor ? Key.major(dominantCenterPitch) : Key.minor(dominantCenterPitch);
  }

  /**
   * 下属調（サブドミナント調）を取得する
   * 五度圏で反時計回りに1つ進んだ調
   * @returns 下属調のKeyインスタンス
   */
  public getSubdominantKey(): Key {
    const subdominantCenterPitch = PitchClass.fromCircleOfFifths(
      PitchClass.modulo12(this.centerPitch.fifthsIndex - 1)
    );
    return this.isMajor ? Key.major(subdominantCenterPitch) : Key.minor(subdominantCenterPitch);
  }

  // === E. 内部ヘルパーメソッド ===

  /**
   * 度数から和声機能を決定する内部メソッド
   * メジャーキーとマイナーキーで異なる機能分類を適用する
   * @param degree 度数（1-7）
   * @returns 和声機能（Tonic, Dominant, Subdominant, Other）
   */
  private deriveFunction(degree: number): Function {
    if (degree < 1 || degree > 7) return 'Other';

    const functions: Record<number, Function> = {
      1: 'Tonic', // I
      2: 'Subdominant', // ii (IVの代理)
      3: 'Tonic', // iii (Iの代理)
      4: 'Subdominant', // IV
      5: 'Dominant', // V
      6: this.isMajor ? 'Tonic' : 'Subdominant', // vi (トニックマイナー) / VI (iv系)
      7: 'Dominant', // vii° (Vの代理)
    };
    return functions[degree];
  }

  // === F. シリアライゼーション ===

  /**
   * JSON形式で出力（Keyクラス固有の実装）
   * isMajorプロパティを含める
   */
  public override toJSON(): KeyDTO {
    return {
      ...super.toJSON(),
      type: 'key',
      isMajor: this.isMajor,
    };
  }
}

/**
 * 型ガード: IMusicalContextがKeyクラスのインスタンスかどうかを判定
 * @param context 判定したいIMusicalContext
 * @returns Keyクラスのインスタンスかどうか
 */
export function isKey(context: IMusicalContext): context is Key {
  return context instanceof Key;
}
