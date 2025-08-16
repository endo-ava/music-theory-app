import { Interval, PitchClass, ScalePattern } from '../common';
import { Scale } from '../scale';
import { Chord, ChordQuality } from '../chord';

/** 軽量なプレーンオブジェクト */
export interface KeyDTO {
  shortName: string;
  keyName: string;
  fifthsIndex: number;
  isMajor: boolean;
}

// そのKeyにおけるChord分析結果
export interface ChordAnalysisResult {
  /** 基準となる度数（1-7） */
  degree: number;
  /** 臨時記号（シャープ、フラット、ナチュラル） */
  alteration: 'sharp' | 'flat' | 'natural';
  /** 最終的なローマ数字表記（例: "III", "bV7", "#ivø"） */
  roman: string;
  /** このコードが、このKeyにとって自然なダイアトニックコードか否か */
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
  // Keyのダイアトニックコード情報をキャッシュ 最初は空
  private _diatonicChordsCache: readonly DiatonicChordInfo[] | null = null;

  /**
   * Keyを生成する
   * @param tonic 主音となる音名
   * @param pattern 主要なスケールパターン（例: Major, Aeolian）
   */
  constructor(tonic: PitchClass, scalePattern: ScalePattern) {
    this.tonic = tonic;
    this.scale = new Scale(tonic, scalePattern);
  }

  /**
   * Keyの名前（"C Major", "A Minor"など）を取得する
   */
  get keyName(): string {
    // 音楽理論慣習に従い、メジャーは♭表記、マイナーは#表記を使用
    const context = this.scale.pattern.quality === 'major' ? 'major' : 'minor';
    const tonicName = this.tonic.getDisplayName(context);
    return `${tonicName} ${this.scale.pattern.name}`;
  }

  /**
   * UI表示用の短いシンボル名（"C", "Am" など）を取得する
   */
  get shortName(): string {
    const pattern = this.scale.pattern;
    // 音楽理論慣習に従い、メジャーは♭表記、マイナーは#表記を使用
    const context = pattern.quality === 'major' ? 'major' : 'minor';
    const tonicName = this.tonic.getDisplayName(context);

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

  get isMajor(): boolean {
    return this.scale.pattern.quality === 'major';
  }

  /**
   * このKeyのダイアトニックコード一覧を返す。計算は初回アクセス時に一度だけ実行。
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
      .map((rootNote, index) => {
        const degree = index + 1;
        const chord = this.getDiatonicChord(degree);
        return {
          chord,
          degree,
          alteration: 'natural',
          roman: chord.quality.toRomanNumeral(degree),
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
   * @param degree 度数（1から7）
   * @returns 対応するChord
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

  /** 主和音（トニックコード）を取得する */
  getTonicChord(): Chord {
    return this.getDiatonicChord(1);
  }

  /** 属和音（ドミナントコード）を取得する */
  getDominantChord(): Chord {
    return this.getDiatonicChord(5);
  }

  /** 下属和音（サブドミナントコード）を取得する */
  getSubdominantChord(): Chord {
    return this.getDiatonicChord(4);
  }

  // ファクトリメソッド

  /**
   * 五度圏インデックスからKeyを生成する
   * @param circleIndex 五度圏インデックス (C=0, G=1...)
   * @param isMajor メジャーキーかどうか
   */
  static fromCircleOfFifths(circleIndex: number, isMajor: boolean): Key {
    return new Key(
      PitchClass.fromCircleOfFifths(circleIndex),
      isMajor ? ScalePattern.Major : ScalePattern.Aeolian
    );
  }

  /**
   * あらゆるコードとこのKeyとの関係性を分析する
   * @param chordToAnalyze 分析したいChordオブジェクト
   */
  public analyzeChord(chordToAnalyze: Chord): ChordAnalysisResult {
    // 1. ルート音がスケールの何度にあたるかを計算する
    const { degree, alteration } = this.scale.getDegreeInfo(chordToAnalyze.rootNote._pitchClass);
    // 2. 実際のコードクオリティに基づいてローマ数字を生成する
    const roman = this._buildRomanNumeral(degree, alteration, chordToAnalyze.quality);
    // 3. このコードが「ダイアトニックかどうか」を判定する
    const diatonicChord = this.getDiatonicChord(degree);
    const isDiatonic = diatonicChord.equals(chordToAnalyze);

    return {
      degree,
      alteration,
      roman,
      isDiatonic,
      function: isDiatonic ? this.deriveFunction(degree) : null,
    };
  }

  /**
   * 度数、変化記号、実際の品質からローマ数字を組み立てる
   */
  private _buildRomanNumeral(
    degree: number,
    alteration: 'sharp' | 'flat' | 'natural',
    quality: ChordQuality
  ): string {
    let prefix = '';
    if (alteration === 'sharp') prefix = '#';
    if (alteration === 'flat') prefix = 'b';

    return prefix + quality.toRomanNumeral(degree);
  }

  /**
   * ディグリーから和声機能を決定する
   * @private
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

  /**
   * サーバー/クライアント間で受け渡すためのプレーンオブジェクトに変換する
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
