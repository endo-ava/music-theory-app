/**
 * スケール（音階）の値オブジェクト
 *
 * 音楽理論における音階の音程構造を表現する。
 * 特定の主音に依存しない、純粋な音程パターンとして定義される。
 * チャーチモードや様々な音階に対応できる汎用的な設計。
 */

import { Interval } from './Interval';

/**
 * スケールの種類
 */
export type ScaleType =
  | 'major' // メジャースケール
  | 'minor'; // ナチュラルマイナースケール

/**
 * スケール（音階）の値オブジェクト
 *
 * 音程の構造のみを表現し、特定の主音を持たない。
 * 音楽理論的に正確な音階の定義を提供する。
 */
export class Scale {
  private readonly _intervals: ReadonlyArray<Interval>;

  private constructor(
    private readonly _type: ScaleType,
    intervals: Interval[]
  ) {
    this._intervals = intervals;
    this.validateIntervals();
  }

  /**
   * メジャースケール（イオニアンモード）を作成
   */
  static major(): Scale {
    return new Scale('major', [
      Interval.unison(), // 1度
      Interval.majorSecond(), // 長2度
      Interval.majorThird(), // 長3度
      Interval.perfectFourth(), // 完全4度
      Interval.perfectFifth(), // 完全5度
      Interval.majorSixth(), // 長6度
      Interval.majorSeventh(), // 長7度
    ]);
  }

  /**
   * ナチュラルマイナースケール（エオリアンモード）を作成
   */
  static minor(): Scale {
    return new Scale('minor', [
      Interval.unison(), // 1度
      Interval.majorSecond(), // 長2度
      Interval.minorThird(), // 短3度
      Interval.perfectFourth(), // 完全4度
      Interval.perfectFifth(), // 完全5度
      Interval.minorSixth(), // 短6度
      Interval.minorSeventh(), // 短7度
    ]);
  }

  /**
   * デフォルトのスケール（メジャースケール）を取得
   */
  static getDefault(): Scale {
    return Scale.major();
  }

  /**
   * スケールタイプを取得
   */
  get type(): ScaleType {
    return this._type;
  }

  /**
   * 音程配列を取得
   */
  get intervals(): ReadonlyArray<Interval> {
    return this._intervals;
  }

  /**
   * メジャースケールかどうか判定
   */
  get isMajor(): boolean {
    return this._type === 'major';
  }

  /**
   * マイナースケールかどうか判定
   */
  get isMinor(): boolean {
    return this._type === 'minor';
  }

  /**
   * 表示用の名前を取得
   */
  getDisplayName(): string {
    const displayNames: Record<ScaleType, string> = {
      major: 'Major Scale',
      minor: 'Natural Minor Scale',
    };
    return displayNames[this._type];
  }

  /**
   * 省略表記を取得
   */
  getShortName(): string {
    const shortNames: Record<ScaleType, string> = {
      major: 'Maj',
      minor: 'Min',
    };
    return shortNames[this._type];
  }

  /**
   * セミトーン数の配列を取得（デバッグ・分析用）
   */
  getSemitonePattern(): number[] {
    return this._intervals.map(interval => interval.semitones);
  }

  /**
   * 同じスケールかどうか判定
   */
  equals(other: Scale): boolean {
    return (
      this._type === other._type &&
      this._intervals.length === other._intervals.length &&
      this._intervals.every((interval, index) => interval.equals(other._intervals[index]))
    );
  }

  /**
   * 文字列表現を取得（デバッグ用）
   */
  toString(): string {
    return this.getDisplayName();
  }

  /**
   * JSONシリアライゼーション用
   */
  toJSON(): { type: ScaleType; intervals: number[] } {
    return {
      type: this._type,
      intervals: this.getSemitonePattern(),
    };
  }

  /**
   * JSONから復元
   */
  static fromJSON(json: { type: ScaleType; intervals: number[] }): Scale {
    const intervals = json.intervals.map(semitones => Interval.fromSemitones(semitones));
    return new Scale(json.type, intervals);
  }

  /**
   * 音程配列の妥当性検証
   */
  private validateIntervals(): void {
    if (this._intervals.length === 0) {
      throw new Error('Scale must have at least one interval');
    }

    // 最初の音程はユニゾン（0度）でなければならない
    if (this._intervals[0].semitones !== 0) {
      throw new Error('First interval must be unison (0 semitones)');
    }

    // 音程は昇順でなければならない
    for (let i = 1; i < this._intervals.length; i++) {
      if (this._intervals[i].semitones <= this._intervals[i - 1].semitones) {
        throw new Error('Intervals must be in ascending order');
      }
    }

    // オクターブを超えない（12セミトーン未満）
    const maxSemitones = Math.max(...this._intervals.map(i => i.semitones));
    if (maxSemitones >= 12) {
      throw new Error('Scale intervals must not exceed an octave (12 semitones)');
    }
  }
}
