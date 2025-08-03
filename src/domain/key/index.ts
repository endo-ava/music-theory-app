import { PitchClass, ScalePattern } from '../common';
import { Scale } from '../scale';
import { Chord, ChordQuality } from '../chord';

/** 軽量なプレーンオブジェクト */
export interface KeyDTO {
  shortName: string;
  keyName: string;
  circleIndex: number;
  isMajor: boolean;
}

/**
 * 調性を表現する集約（Aggregate Root）
 * 和声機能（Harmonic Function）に関する知識と責務を持つ
 */
export class Key {
  public readonly tonic: PitchClass;
  public readonly pattern: ScalePattern;
  public readonly primaryScale: Scale;

  /**
   * Keyを生成する
   * @param tonic 主音となる音名
   * @param pattern 主要なスケールパターン（例: Major, Aeolian）
   */
  constructor(tonic: PitchClass, pattern: ScalePattern) {
    this.tonic = tonic;
    this.pattern = pattern;
    // Keyは自身の主要なスケールを内部に保持する
    this.primaryScale = new Scale(tonic, pattern);
    Object.freeze(this);
  }

  /**
   * Keyの名前（"C Major", "A Minor"など）を取得する
   */
  get keyName(): string {
    return `${this.tonic.name} ${this.pattern.name}`;
  }

  /**
   * UI表示用の短いシンボル名（"C", "Am" など）を取得する
   */
  get shortName(): string {
    const pattern = this.pattern;
    const tonicName = this.tonic.name;

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
    return this.pattern.quality === 'major';
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

    const rootNoteOfChord = this.primaryScale.getNoteForDegree(degree);
    if (!rootNoteOfChord) {
      throw new Error(`${degree}度の音が見つかりませんでした。`);
    }

    // ダイアトニックコードの品質を決定する（メジャースケールの場合）
    // TODO: 他のスケールパターンにも対応させる
    const qualities = [
      ChordQuality.MajorTriad,
      ChordQuality.MinorTriad,
      ChordQuality.MinorTriad,
      ChordQuality.MajorTriad,
      ChordQuality.MajorTriad,
      ChordQuality.MinorTriad,
      ChordQuality.DiminishedTriad,
    ];

    const quality = qualities[degree - 1];

    return Chord.from(rootNoteOfChord, quality);
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
   * @param isMinor マイナーキーかどうか
   */
  static fromCircleOfFifths(circleIndex: number, isMinor: boolean): Key {
    // マイナーの場合、五度圏のインデックスを短3度下にずらす (C Major -> A Minor)
    const tonicIndex = isMinor ? circleIndex + 3 : circleIndex;
    const tonic = PitchClass.fromCircleOfFifths(tonicIndex);
    const pattern = isMinor ? ScalePattern.Aeolian : ScalePattern.Major;

    return new Key(tonic, pattern);
  }

  /**
   * サーバー/クライアント間で受け渡すためのプレーンオブジェクトに変換する
   */
  toJSON(): KeyDTO {
    return {
      shortName: this.shortName,
      keyName: this.keyName,
      circleIndex: this.tonic.circleOfFifthsIndex,
      isMajor: this.isMajor,
    };
  }
}
