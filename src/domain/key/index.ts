import { Interval, PitchClass, ScalePattern, ScaleQuality } from '../common';
import { Scale } from '../scale';
import { Chord } from '../chord';
import { ChordPattern } from '../common';
import type { IAnalysisResult, IMusicalContext } from '../common/IMusicalContext';

/** 調号 */
type keySignature = 'sharp' | 'flat' | 'natural';

/** 和声機能（調性音楽における） */
type Function = 'Tonic' | 'Dominant' | 'Subdominant' | 'Other';

/** keyの品質（major or minor） */
type KeyQuality = Omit<ScaleQuality, 'diminished' | 'other'>;

/** ディグリー情報の戻り値型 */
type DegreeResult = {
  degree: number;
  degreeName: string;
};

/**
 * 調性的分析結果
 */
export interface TonalChordAnalysisResult extends IAnalysisResult {
  function: Function | null;
}

/** ノンダイアトニック音のディグリーネームマップの型 */
type NonDiatonicDegreeMap = Record<string, Record<number, string>>;

/** 軽量なプレーンオブジェクト */
export interface KeyDTO {
  shortName: string;
  keyName: string;
  fifthsIndex: number;
  isMajor: boolean;
}

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
export class Key implements IMusicalContext<TonalChordAnalysisResult> {
  public readonly centerPitch: PitchClass;
  public readonly scale: Scale;
  public readonly keyQuality: KeyQuality;
  /** 調号，五度圏の右側がシャープ */
  public readonly keySignature: keySignature;
  // Keyのダイアトニックコード情報をキャッシュ 最初は空
  private _diatonicChordsCache: readonly Chord[] | null = null;

  // === 静的定数 ===
  // ローマ数字定数
  private static readonly ROMAN_NUMERALS = ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ', 'Ⅵ', 'Ⅶ'] as const;

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

  // ノンダイアトニック音のディグリーネームマップ
  public static readonly NON_DIATONIC_DEGREE_MAP: NonDiatonicDegreeMap = {
    Major: {
      1: '♭Ⅱ', // 2と同じ
      2: '♭Ⅱ', // ナポリの和音
      3: '♭Ⅲ', // マイナーの借用
      4: '♯Ⅳ', //
      5: '♯Ⅳ', // 4と同じ
      6: '♭Ⅵ', // マイナーの借用
      7: '♭Ⅶ', // マイナーの借用
    },
    Aeolian: {
      1: '♭Ⅱ', // 2と同じ
      2: '♭Ⅱ', // ナポリの和音
      3: '♭Ⅳ', // 4と同じ
      4: '♭Ⅳ', // sharpもあり
      5: '♭Ⅴ', // sharpもあり
      6: '♯Ⅵ', // メロディックマイナー
      7: '♯Ⅶ', // ハーモニックマイナー
    },
  } as const;

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

    this.centerPitch = centerPitch;
    this.scale = new Scale(centerPitch, scalePattern);
    this.keyQuality = this.scale.pattern.quality === 'major' ? 'major' : 'minor';
    // 五度圏でのシャープ系とフラット系の判定
    // C(0)からB(5)まではシャープ系、F#/G♭(6)からF(11)まではフラット系
    const normalizedIndex =
      this.keyQuality === 'major'
        ? this.centerPitch.fifthsIndex
        : Key.normalizeIndex(this.centerPitch.fifthsIndex - 3);
    this.keySignature = normalizedIndex < Key.SHARP_FLAT_BOUNDARY ? 'sharp' : 'flat';
  }

  /**
   * Keyの名前（"C Major", "A Minor"など）を取得する
   * @returns フルネーム表記の調名
   */
  get keyName(): string {
    // 音楽理論慣習に従い、メジャーは♭表記、マイナーは#表記を使用
    return this.isMajor
      ? `${this.centerPitch.flatName} ${this.scale.pattern.name}`
      : `${this.centerPitch.sharpName} ${this.scale.pattern.name}`;
  }

  /**
   * UI表示用の短いシンボル名（"C", "Am" など）を取得する
   * @returns 短縮表記の調名
   */
  get shortName(): string {
    return this.isMajor ? `${this.centerPitch.flatName}` : `${this.centerPitch.sharpName}m`;
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

  /**
   * 度数から度数名（ローマ数字）を導出するユーティリティ関数
   * ドメイン全体で再利用される共通関数
   * @param degree 度数（1-7）
   * @returns 度数名（ローマ数字）（例: "Ⅰ", "Ⅱ", "Ⅲ"）
   * @throws {Error} degreeが1-7の範囲外の場合（暗黙的にエラー）
   */
  public static getDegreeNameFromNumber(degree: number): string {
    return Key.ROMAN_NUMERALS[degree - 1];
  }

  /**
   * 五度圏インデックスを0-11の範囲に正規化する
   * 五度圏計算で使用される共通ユーティリティ関数
   * @param index 正規化したいインデックス
   * @returns 0-11の範囲に正規化されたインデックス
   */
  public static normalizeIndex(index: number): number {
    return ((index % 12) + 12) % 12;
  }

  // === C. ダイアトニックコード関連（集約の主要責務） ===

  /**
   * このKeyのダイアトニックコード一覧を返す。計算は初回アクセス時に一度だけ実行。
   * @returns ダイアトニック和音の配列
   */
  get diatonicChords(): readonly Chord[] {
    // キャッシュが既に計算済みならそれを返す
    if (this._diatonicChordsCache !== null) {
      return this._diatonicChordsCache;
    }
    // キャッシュが空ならここで初めて計算する
    const calculatedChords: Chord[] = this.scale
      .getNotes()
      .slice(0, 7)
      .map((_, index) => this.buildTriad(index + 1));

    // 計算結果をキャッシュに保存し、返す
    this._diatonicChordsCache = Object.freeze(calculatedChords);
    return this._diatonicChordsCache;
  }

  /**
   * このKeyのダイアトニックコードの情報一覧を返す
   * @returns ダイアトニックコード情報の配列（I, ii, iii, IV, V, vi, vii°など）
   */
  getDiatonicChordsInfo(): (TonalChordAnalysisResult & { chord: Chord })[] {
    return this.diatonicChords.map((chord, index) => {
      const degree = index + 1;
      return {
        chord,
        romanDegreeName: chord.quality.getChordDegreeName(Key.getDegreeNameFromNumber(degree)),
        isDiatonic: true,
        function: this.deriveFunction(degree),
      };
    });
  }

  /**
   * 指定された度数のダイアトニック三和音を生成する
   * スケール内の音で構成された三和音を返す（より音楽的な表現）
   * @param degree 度数（1から7）
   * @returns 対応するChord
   * @throws {Error} 度数が1-7の範囲外の場合
   */
  buildTriad(degree: number): Chord {
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
   * あらゆるコードとこのKeyとの関係性を分析する（IMusicalContextインターフェース実装）
   * ダイアトニックコードかどうか、ローマ数字表記、和声機能を判定する
   * @param chordToAnalyze 分析したいChordオブジェクト
   * @returns 調性的コード分析結果（ローマ数字、ダイアトニック判定、機能）
   */
  public analyzeChord(chordToAnalyze: Chord): TonalChordAnalysisResult {
    const degreeResult = this.analyzePitchClassInKey(chordToAnalyze.rootNote._pitchClass);
    const isDiatonic = this.isDiatonicChord(chordToAnalyze, degreeResult.degree);

    return {
      romanDegreeName: chordToAnalyze.quality.getChordDegreeName(degreeResult.degreeName),
      isDiatonic,
      function: isDiatonic ? this.deriveFunction(degreeResult.degree) : null,
    };
  }

  /**
   * このKeyの文脈で指定されたPitchClassを分析し、度数と度数名を取得する
   * ダイアトニック音の場合は基本的な度数、ノンダイアトニック音の場合は変化記号付きの度数を返す
   * 例: C MajorでF#を分析すると { degree: 4, degreeName: "#Ⅳ" }
   * @param pitchClassToAnalyze 分析対象のPitchClass
   * @returns 度数（1-7）と度数名（ローマ数字表記）
   */
  public analyzePitchClassInKey(pitchClassToAnalyze: PitchClass): DegreeResult {
    // スケール音との照合とベースレター分析
    const scaleNotes = this.scale.getNotes();
    const diatonicIndex = scaleNotes.findIndex(note =>
      note._pitchClass.equals(pitchClassToAnalyze)
    );

    // ベースレターから度数を特定
    const baseLetter = pitchClassToAnalyze.getNameFor(this.keySignature).charAt(0);
    const baseLetterIndex = scaleNotes.findIndex(
      note => note._pitchClass.getNameFor(this.keySignature).charAt(0) === baseLetter
    );
    const baseDegree = baseLetterIndex + 1;

    // ダイアトニック音の場合
    if (diatonicIndex !== -1) {
      return {
        degree: diatonicIndex + 1,
        degreeName: Key.getDegreeNameFromNumber(diatonicIndex + 1),
      };
    }
    // ノンダイアトニック音の場合
    else {
      const nonDiatonicMap = Key.NON_DIATONIC_DEGREE_MAP[this.scale.pattern.name];
      const mappedDegreeName = nonDiatonicMap?.[baseDegree];

      // マップに定義されていない場合は基本的なローマ数字をフォールバックとして使用
      const degreeName = mappedDegreeName || Key.getDegreeNameFromNumber(baseDegree);

      return {
        degree: baseDegree,
        degreeName,
      };
    }
  }

  /**
   * 平行調（相対調）を取得する
   * メジャーキーの場合は相対マイナー、マイナーキーの場合は相対メジャーを返す
   * @returns 平行調のKeyインスタンス
   */
  public getRelativeKey(): Key {
    const relativeCenterPitch = this.isMajor
      ? PitchClass.fromCircleOfFifths(Key.normalizeIndex(this.centerPitch.fifthsIndex + 3))
      : PitchClass.fromCircleOfFifths(Key.normalizeIndex(this.centerPitch.fifthsIndex - 3));

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
      Key.normalizeIndex(this.centerPitch.fifthsIndex + 1)
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
      Key.normalizeIndex(this.centerPitch.fifthsIndex - 1)
    );
    return this.isMajor ? Key.major(subdominantCenterPitch) : Key.minor(subdominantCenterPitch);
  }

  /**
   * 関連調を一括取得するメソッド（後方互換性のため保持）
   * @returns 関連調の情報（平行調、同主調、属調、下属調）
   * @deprecated 個別メソッド（getRelativeKey, getParallelKey等）の使用を推奨
   */
  public getRelatedKeys(): {
    relative: Key; // 平行調
    parallel: Key; // 同主調
    dominant: Key; // 属調
    subdominant: Key; // 下属調
  } {
    return {
      relative: this.getRelativeKey(),
      parallel: this.getParallelKey(),
      dominant: this.getDominantKey(),
      subdominant: this.getSubdominantKey(),
    };
  }

  // === E. 内部ヘルパーメソッド ===

  /**
   * 指定されたコードがダイアトニックコードかどうかを判定する内部メソッド
   * 指定された度数のダイアトニックコードと正確に一致するかを確認する
   * @param chord 判定したいコード
   * @param degree 度数（1-7）
   * @returns ダイアトニックコードかどうか
   */
  private isDiatonicChord(chord: Chord, degree: number): boolean {
    if (degree < 1 || degree > 7) return false;

    try {
      const diatonicChord = this.buildTriad(degree);
      return diatonicChord.equals(chord);
    } catch {
      return false;
    }
  }

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
   * サーバー/クライアント間で受け渡すためのプレーンオブジェクトに変換する
   * @returns Keyの基本情報を含むシリアライズ可能なオブジェクト
   */
  toJSON(): KeyDTO {
    return {
      shortName: this.shortName,
      keyName: this.keyName,
      fifthsIndex: this.centerPitch.fifthsIndex,
      isMajor: this.isMajor,
    };
  }
}
