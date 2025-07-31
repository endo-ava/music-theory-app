/**
 * 音程の値オブジェクト
 */

/**
 * セミトーン数による音程定義
 */
export type Semitones = number;

/**
 * 音程の種類
 */
export type IntervalType =
  | 'unison' // 1度（0セミトーン）
  | 'minor2nd' // 短2度（1セミトーン）
  | 'major2nd' // 長2度（2セミトーン）
  | 'minor3rd' // 短3度（3セミトーン）
  | 'major3rd' // 長3度（4セミトーン）
  | 'perfect4th' // 完全4度（5セミトーン）
  | 'tritone' // 増4度/減5度（6セミトーン）
  | 'perfect5th' // 完全5度（7セミトーン）
  | 'minor6th' // 短6度（8セミトーン）
  | 'major6th' // 長6度（9セミトーン）
  | 'minor7th' // 短7度（10セミトーン）
  | 'major7th' // 長7度（11セミトーン）
  | 'octave'; // オクターブ（12セミトーン）

/**
 * 音程を表現する値オブジェクト
 *
 * 二つの音の間の距離を表現し、和音構築に使用される。
 */
export class Interval {
  private static readonly INTERVAL_MAP: Record<IntervalType, Semitones> = {
    unison: 0,
    minor2nd: 1,
    major2nd: 2,
    minor3rd: 3,
    major3rd: 4,
    perfect4th: 5,
    tritone: 6,
    perfect5th: 7,
    minor6th: 8,
    major6th: 9,
    minor7th: 10,
    major7th: 11,
    octave: 12,
  };

  constructor(private readonly _type: IntervalType) {
    this.validateInterval(_type);
  }

  /**
   * 音程の種類
   */
  get type(): IntervalType {
    return this._type;
  }

  /**
   * セミトーン数
   */
  get semitones(): Semitones {
    return Interval.INTERVAL_MAP[this._type];
  }

  /**
   * 表示用名称
   */
  getDisplayName(): string {
    const displayNames: Record<IntervalType, string> = {
      unison: '1度',
      minor2nd: '短2度',
      major2nd: '長2度',
      minor3rd: '短3度',
      major3rd: '長3度',
      perfect4th: '完全4度',
      tritone: '増4度',
      perfect5th: '完全5度',
      minor6th: '短6度',
      major6th: '長6度',
      minor7th: '短7度',
      major7th: '長7度',
      octave: 'オクターブ',
    };
    return displayNames[this._type];
  }

  /**
   * 他の音程との等価性をチェック
   */
  equals(other: Interval): boolean {
    return this._type === other._type;
  }

  /**
   * 文字列表現
   */
  toString(): string {
    return `${this.getDisplayName()} (${this.semitones}半音)`;
  }

  /**
   * 音程の妥当性検証
   */
  private validateInterval(type: IntervalType): void {
    if (!(type in Interval.INTERVAL_MAP)) {
      throw new Error(`Invalid interval type: ${type}`);
    }
  }

  /**
   * トライアド構築に必要な音程のファクトリーメソッド
   */
  static unison(): Interval {
    return new Interval('unison');
  }

  static majorThird(): Interval {
    return new Interval('major3rd');
  }

  static minorThird(): Interval {
    return new Interval('minor3rd');
  }

  static perfectFifth(): Interval {
    return new Interval('perfect5th');
  }

  static minorSeventh(): Interval {
    return new Interval('minor7th');
  }

  static majorSeventh(): Interval {
    return new Interval('major7th');
  }

  static minorSecond(): Interval {
    return new Interval('minor2nd');
  }

  static majorSecond(): Interval {
    return new Interval('major2nd');
  }

  static perfectFourth(): Interval {
    return new Interval('perfect4th');
  }

  static augmentedFourth(): Interval {
    return new Interval('tritone');
  }

  static diminishedFifth(): Interval {
    return new Interval('tritone');
  }

  static minorSixth(): Interval {
    return new Interval('minor6th');
  }

  static majorSixth(): Interval {
    return new Interval('major6th');
  }

  /**
   * セミトーン数から音程を作成するファクトリーメソッド
   */
  static fromSemitones(semitones: number): Interval {
    const typeEntry = Object.entries(Interval.INTERVAL_MAP).find(
      ([, value]) => value === semitones
    );

    if (!typeEntry) {
      throw new Error(`No interval type found for ${semitones} semitones`);
    }

    return new Interval(typeEntry[0] as IntervalType);
  }
}
