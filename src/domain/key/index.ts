import { Interval, PitchClass, ScalePattern } from '../common';
import { Scale } from '../scale';
import { Chord, ChordQuality } from '../chord';

/** 調号 */
type keySignature = 'sharp' | 'flat' | 'natural';

/** ディグリー情報の戻り値型 */
type DegreeResult = {
  degree: number;
  degreeName: string;
};

/** ノンダイアトニック音のディグリーネームマップの型 */
type NonDiatonicDegreeMap = Record<string, Record<number, string>>;

/** 軽量なプレーンオブジェクト */
export interface KeyDTO {
  shortName: string;
  keyName: string;
  fifthsIndex: number;
  isMajor: boolean;
}

// そのKeyにおけるChord分析結果
export interface ChordAnalysisResult {
  /** ローマ数字表記のディグリーネーム（例: "III", "bV7", "#ivø"） */
  romanDegreeName: string;
  /** このコードがダイアトニックコードか */
  isDiatonic: boolean;
  /** ダイアトニックである場合にのみ、その機能を持つ */
  function: 'Tonic' | 'Dominant' | 'Subdominant' | 'Other' | null;
}

// ダイアトニックコードの情報を保持する型
export interface DiatonicChordInfo extends ChordAnalysisResult {
  chord: Chord;
}

/**
 * 調性を表現する集約（Aggregate Root）
 * 和声機能（Harmonic Function）に関する知識と責務を持つ
 */
export class Key {
  public readonly tonic: PitchClass;
  public readonly scale: Scale;
  /** 調号，五度圏の右側がシャープ */
  public readonly keySignature: keySignature;
  // Keyのダイアトニックコード情報をキャッシュ 最初は空
  private _diatonicChordsCache: readonly DiatonicChordInfo[] | null = null;

  // === 静的定数 ===
  // ローマ数字定数
  private static readonly ROMAN_NUMERALS = ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ', 'Ⅵ', 'Ⅶ'] as const;

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
   * Keyを生成する
   * @param tonic 主音となる音名
   * @param scalePattern 主要なスケールパターン（例: Major, Aeolian）
   */
  constructor(tonic: PitchClass, scalePattern: ScalePattern) {
    this.tonic = tonic;
    this.scale = new Scale(tonic, scalePattern);
    // 五度圏でのシャープ系とフラット系の判定
    // C(0)からB(5)まではシャープ系、F#/G♭(6)からF(11)まではフラット系
    this.keySignature = this.tonic.fifthsIndex < 6 ? 'sharp' : 'flat';
  }

  /**
   * Keyの名前（"C Major", "A Minor"など）を取得する
   * @returns フルネーム表記の調名
   */
  get keyName(): string {
    // 音楽理論慣習に従い、メジャーは♭表記、マイナーは#表記を使用
    return this.scale.pattern.quality === 'major'
      ? `${this.tonic.flatName} ${this.scale.pattern.name}`
      : `${this.tonic.sharpName} ${this.scale.pattern.name}`;
  }

  /**
   * UI表示用の短いシンボル名（"C", "Am" など）を取得する
   * @returns 短縮表記の調名
   */
  get shortName(): string {
    const pattern = this.scale.pattern;
    // 音楽理論慣習に従い、メジャーは♭表記、マイナーは#表記を使用
    const tonicName = pattern.quality === 'major' ? this.tonic.flatName : this.tonic.sharpName;

    // パターンの性質に基づいて分岐する
    switch (pattern.quality) {
      case 'major':
        return tonicName;

      case 'minor':
        return `${tonicName}m`;

      case 'diminished':
        return `${tonicName}dim`;

      default:
        return `${tonicName} ${pattern.name}`;
    }
  }

  /**
   * isMajorプロパティのゲッター
   * @returns メジャーキーかどうか
   */
  get isMajor(): boolean {
    return this.scale.pattern.quality === 'major';
  }

  // === B. 静的ファクトリーメソッド・ユーティリティ ===

  /**
   * 五度圏インデックスからKeyを生成するファクトリーメソッド
   * @param circleIndex 五度圏インデックス (C=0, G=1, D=2, ..., F=5, Bb=6, Eb=7, ...)
   * @param isMajor メジャーキーかどうか（true: Major, false: 相対マイナー）
   * @returns 生成されたKeyインスタンス
   */
  static fromCircleOfFifths(circleIndex: number, isMajor: boolean): Key {
    return new Key(
      PitchClass.fromCircleOfFifths(circleIndex),
      isMajor ? ScalePattern.Major : ScalePattern.Aeolian
    );
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

  // === C. ダイアトニックコード関連（集約の主要責務） ===

  /**
   * このKeyのダイアトニックコード一覧を返す。計算は初回アクセス時に一度だけ実行。
   * @returns ダイアトニックコード情報の配列（I, ii, iii, IV, V, vi, vii°など）
   */
  get diatonicChords(): readonly DiatonicChordInfo[] {
    // 1. キャッシュが既に計算済みならそれを返す
    if (this._diatonicChordsCache !== null) {
      return this._diatonicChordsCache;
    }
    // 2. キャッシュが空ならここで初めて計算する
    const calculatedChords: DiatonicChordInfo[] = this.scale
      .getNotes()
      .slice(0, 7)
      .map((_, index) => {
        const degree = index + 1;
        const chord = this.getDiatonicChord(degree);
        return {
          chord,
          romanDegreeName: chord.quality.getChordDegreeName(Key.getDegreeNameFromNumber(degree)),
          isDiatonic: true,
          function: this.deriveFunction(degree),
        };
      });

    // 3. 計算結果をキャッシュに保存し、返す
    this._diatonicChordsCache = Object.freeze(calculatedChords);
    return this._diatonicChordsCache;
  }

  /**
   * 指定された度数のダイアトニックコード（その調の音だけで作られる和音）を生成する
   * スケール内の音で構成された三和音を返す
   * @param degree 度数（1から7）
   * @returns 対応するChord
   * @throws {Error} 度数が1-7の範囲外の場合
   */
  getDiatonicChord(degree: number): Chord {
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

    const quality = ChordQuality.findByIntervals([interval3, interval5]);
    if (!quality) throw new Error('未知のコード品質');

    return Chord.from(root, quality);
  }

  /**
   * 主和音（トニックコード）を取得する
   * @returns メジャーキーのI、マイナーキーのiコード
   */
  getTonicChord(): Chord {
    return this.getDiatonicChord(1);
  }

  /**
   * 属和音（ドミナントコード）を取得する
   * @returns メジャーキーのV、マイナーキーのVコード
   */
  getDominantChord(): Chord {
    return this.getDiatonicChord(5);
  }

  /**
   * 下属和音（サブドミナントコード）を取得する
   * @returns メジャーキーのIV、マイナーキーのivコード
   */
  getSubdominantChord(): Chord {
    return this.getDiatonicChord(4);
  }

  // === D. 分析・判定メソッド（外部向けAPI） ===

  /**
   * あらゆるコードとこのKeyとの関係性を分析する
   * ダイアトニックコードかどうか、ローマ数字表記、和声機能を判定する
   * @param chordToAnalyze 分析したいChordオブジェクト
   * @returns コード分析結果（ローマ数字、ダイアトニック判定、機能）
   */
  public analyzeChord(chordToAnalyze: Chord): ChordAnalysisResult {
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
    const baseLetter = pitchClassToAnalyze.getNameFor(this).charAt(0);
    const baseLetterIndex = scaleNotes.findIndex(
      note => note._pitchClass.getNameFor(this).charAt(0) === baseLetter
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
      const diatonicChord = this.getDiatonicChord(degree);
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
  private deriveFunction(degree: number): 'Tonic' | 'Dominant' | 'Subdominant' | 'Other' {
    // メジャーキーとマイナーキーでの機能分類マッピング
    const functionMappings = {
      major: {
        1: 'Tonic', // I
        2: 'Subdominant', // ii (IVの代理)
        3: 'Tonic', // iii (Iの代理)
        4: 'Subdominant', // IV
        5: 'Dominant', // V
        6: 'Tonic', // vi (トニックマイナー)
        7: 'Dominant', // vii° (Vの代理)
      },
      minor: {
        1: 'Tonic', // i
        2: 'Subdominant', // ii° (ivの代理)
        3: 'Tonic', // III (iの代理)
        4: 'Subdominant', // iv
        5: 'Dominant', // v (弱い)
        6: 'Subdominant', // VI (iv系)
        7: 'Dominant', // VII
      },
    } as const;

    const keyType = this.isMajor ? 'major' : 'minor';
    const functionMap = functionMappings[keyType];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (functionMap as any)[degree] || 'Other';
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
      fifthsIndex: this.tonic.fifthsIndex,
      isMajor: this.isMajor,
    };
  }
}
