/**
 * ScalePattern値オブジェクト
 *
 * あらゆる音階の純粋な「設計図（パターン）」を表現する。
 * 具体的な主音を持たず、音程の構造のみを定義する。
 *
 * 設計思想：
 * - 建築様式のカタログのように、パターンのみを保持
 * - メジャー、マイナー、モード等すべてが平等なパターン
 * - 不変オブジェクトとして安全性を保証
 */

import { Interval } from '@/domain';

/**
 * スケールパターンの種類
 */
export type ScalePatternType =
  | 'Major' // メジャースケール（イオニアン）
  | 'Minor' // ナチュラルマイナー（エオリアン）
  | 'Dorian' // ドリアン
  | 'Phrygian' // フリジアン
  | 'Lydian' // リディアン
  | 'Mixolydian' // ミクソリディアン
  | 'Locrian' // ロクリアン
  | 'HarmonicMinor' // ハーモニックマイナー
  | 'MelodicMinor' // メロディックマイナー
  | 'WholeTone' // 全音音階
  | 'Chromatic' // 半音階
  | 'Pentatonic' // ペンタトニック
  | 'BluesPentatonic'; // ブルースペンタトニック

/**
 * 音階パターンの値オブジェクト
 *
 * 音階の純粋な「設計図」として機能し、
 * 名前と音程構造のみを保持する。
 */
export class ScalePattern {
  constructor(
    private readonly _name: string,
    private readonly _type: ScalePatternType,
    private readonly _intervals: readonly Interval[]
  ) {
    this.validatePattern();
  }

  /**
   * パターン名を取得
   */
  get name(): string {
    return this._name;
  }

  /**
   * パターンタイプを取得
   */
  get type(): ScalePatternType {
    return this._type;
  }

  /**
   * 音程配列を取得
   */
  get intervals(): readonly Interval[] {
    return this._intervals;
  }

  /**
   * 音程数を取得
   */
  get length(): number {
    return this._intervals.length;
  }

  /**
   * セミトーンパターンを取得（分析用）
   */
  getSemitonePattern(): number[] {
    return this._intervals.map(interval => interval.semitones);
  }

  /**
   * 特定の度数の音程を取得
   */
  getInterval(degree: number): Interval {
    if (degree < 1 || degree > this._intervals.length) {
      throw new Error(`Invalid degree: ${degree}. Must be between 1 and ${this._intervals.length}`);
    }
    return this._intervals[degree - 1]; // 1-indexedから0-indexedに変換
  }

  /**
   * このパターンが7音階か判定
   */
  isHeptatonic(): boolean {
    return this._intervals.length === 7;
  }

  /**
   * このパターンがペンタトニックか判定
   */
  isPentatonic(): boolean {
    return this._intervals.length === 5;
  }

  /**
   * このパターンがモードか判定（7音階かつMajor/Minor以外）
   */
  isMode(): boolean {
    return this.isHeptatonic() && this._type !== 'Major' && this._type !== 'Minor';
  }

  /**
   * 等価性判定
   */
  equals(other: ScalePattern): boolean {
    return (
      this._type === other._type &&
      this._intervals.length === other._intervals.length &&
      this._intervals.every((interval, index) => interval.equals(other._intervals[index]))
    );
  }

  /**
   * パターンの表示名を取得
   */
  getDisplayName(): string {
    return this._name;
  }

  /**
   * 短縮表示名を取得
   */
  getShortName(): string {
    const shortNames: Partial<Record<ScalePatternType, string>> = {
      Major: 'Maj',
      Minor: 'Min',
      Dorian: 'Dor',
      Phrygian: 'Phr',
      Lydian: 'Lyd',
      Mixolydian: 'Mix',
      Locrian: 'Loc',
      HarmonicMinor: 'HMin',
      MelodicMinor: 'MMin',
      Pentatonic: 'Pent',
      BluesPentatonic: 'Blues',
    };
    return shortNames[this._type] || this._type;
  }

  /**
   * 文字列表現
   */
  toString(): string {
    return `${this._name} (${this.getSemitonePattern().join('-')})`;
  }

  /**
   * JSONシリアライゼーション用
   */
  toJSON(): {
    name: string;
    type: ScalePatternType;
    intervals: number[];
  } {
    return {
      name: this._name,
      type: this._type,
      intervals: this.getSemitonePattern(),
    };
  }

  /**
   * メジャースケールパターン
   */
  static readonly Major = new ScalePattern('Major Scale', 'Major', [
    Interval.unison(), // 1度
    Interval.majorSecond(), // 長2度
    Interval.majorThird(), // 長3度
    Interval.perfectFourth(), // 完全4度
    Interval.perfectFifth(), // 完全5度
    Interval.majorSixth(), // 長6度
    Interval.majorSeventh(), // 長7度
  ]);

  /**
   * ナチュラルマイナースケールパターン
   */
  static readonly Minor = new ScalePattern('Natural Minor Scale', 'Minor', [
    Interval.unison(), // 1度
    Interval.majorSecond(), // 長2度
    Interval.minorThird(), // 短3度
    Interval.perfectFourth(), // 完全4度
    Interval.perfectFifth(), // 完全5度
    Interval.minorSixth(), // 短6度
    Interval.minorSeventh(), // 短7度
  ]);

  /**
   * ハーモニックマイナーパターン
   */
  static readonly HarmonicMinor = new ScalePattern('Harmonic Minor Scale', 'HarmonicMinor', [
    Interval.unison(), // 1度
    Interval.majorSecond(), // 長2度
    Interval.minorThird(), // 短3度
    Interval.perfectFourth(), // 完全4度
    Interval.perfectFifth(), // 完全5度
    Interval.minorSixth(), // 短6度
    Interval.majorSeventh(), // 長7度
  ]);

  /**
   * メジャーペンタトニックパターン
   */
  static readonly Pentatonic = new ScalePattern('Pentatonic Scale', 'Pentatonic', [
    Interval.unison(), // 1度
    Interval.majorSecond(), // 長2度
    Interval.majorThird(), // 長3度
    Interval.perfectFifth(), // 完全5度
    Interval.majorSixth(), // 長6度
  ]);

  /**
   * デフォルトパターン（メジャー）を取得
   */
  static getDefault(): ScalePattern {
    return ScalePattern.Major;
  }

  /**
   * 後方互換性のためのファクトリーメソッド
   */
  static major(): ScalePattern {
    return ScalePattern.Major;
  }

  static minor(): ScalePattern {
    return ScalePattern.Minor;
  }

  static dorian(): ScalePattern {
    return ScalePattern.Dorian;
  }

  static phrygian(): ScalePattern {
    return ScalePattern.Phrygian;
  }

  static lydian(): ScalePattern {
    return ScalePattern.Lydian;
  }

  static mixolydian(): ScalePattern {
    return ScalePattern.Mixolydian;
  }

  static locrian(): ScalePattern {
    return ScalePattern.Locrian;
  }

  static harmonicMinor(): ScalePattern {
    return ScalePattern.HarmonicMinor;
  }

  static pentatonic(): ScalePattern {
    return ScalePattern.Pentatonic;
  }

  /**
   * JSONから復元
   */
  static fromJSON(json: {
    name: string;
    type: ScalePatternType;
    intervals: number[];
  }): ScalePattern {
    const intervals = json.intervals.map(semitones => Interval.fromSemitones(semitones));
    return new ScalePattern(json.name, json.type, intervals);
  }

  /**
   * パターンの妥当性検証
   */
  private validatePattern(): void {
    if (this._intervals.length === 0) {
      throw new Error('ScalePattern must have at least one interval');
    }

    // 最初の音程はユニゾンでなければならない
    if (this._intervals[0].semitones !== 0) {
      throw new Error('First interval must be unison (0 semitones)');
    }

    // 音程は昇順でなければならない
    for (let i = 1; i < this._intervals.length; i++) {
      if (this._intervals[i].semitones <= this._intervals[i - 1].semitones) {
        throw new Error('Intervals must be in ascending order');
      }
    }

    // オクターブを超えてはならない（12セミトーン未満）
    const maxSemitones = Math.max(...this._intervals.map(i => i.semitones));
    if (maxSemitones >= 12) {
      throw new Error('Scale pattern intervals must not exceed an octave (12 semitones)');
    }
  }
}

/**
 * ドリアンモードパターン（メジャースケールの2度から）
 */
ScalePattern.Dorian = new ScalePattern('Dorian Mode', 'Dorian', [
  Interval.unison(), // 1度
  Interval.majorSecond(), // 長2度
  Interval.minorThird(), // 短3度
  Interval.perfectFourth(), // 完全4度
  Interval.perfectFifth(), // 完全5度
  Interval.majorSixth(), // 長6度
  Interval.minorSeventh(), // 短7度
]);

/**
 * フリジアンモードパターン（メジャースケールの3度から）
 */
ScalePattern.Phrygian = new ScalePattern('Phrygian Mode', 'Phrygian', [
  Interval.unison(), // 1度
  Interval.minorSecond(), // 短2度
  Interval.minorThird(), // 短3度
  Interval.perfectFourth(), // 完全4度
  Interval.perfectFifth(), // 完全5度
  Interval.minorSixth(), // 短6度
  Interval.minorSeventh(), // 短7度
]);

/**
 * リディアンモードパターン（メジャースケールの4度から）
 */
ScalePattern.Lydian = new ScalePattern('Lydian Mode', 'Lydian', [
  Interval.unison(), // 1度
  Interval.majorSecond(), // 長2度
  Interval.majorThird(), // 長3度
  Interval.augmentedFourth(), // 増4度
  Interval.perfectFifth(), // 完全5度
  Interval.majorSixth(), // 長6度
  Interval.majorSeventh(), // 長7度
]);

/**
 * ミクソリディアンモードパターン（メジャースケールの5度から）
 */
ScalePattern.Mixolydian = new ScalePattern('Mixolydian Mode', 'Mixolydian', [
  Interval.unison(), // 1度
  Interval.majorSecond(), // 長2度
  Interval.majorThird(), // 長3度
  Interval.perfectFourth(), // 完全4度
  Interval.perfectFifth(), // 完全5度
  Interval.majorSixth(), // 長6度
  Interval.minorSeventh(), // 短7度
]);

/**
 * ロクリアンモードパターン（メジャースケールの7度から）
 */
ScalePattern.Locrian = new ScalePattern('Locrian Mode', 'Locrian', [
  Interval.unison(), // 1度
  Interval.minorSecond(), // 短2度
  Interval.minorThird(), // 短3度
  Interval.perfectFourth(), // 完全4度
  Interval.diminishedFifth(), // 減5度
  Interval.minorSixth(), // 短6度
  Interval.minorSeventh(), // 短7度
]);
