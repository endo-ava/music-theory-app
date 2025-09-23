import { PitchClass } from './PitchClass';

/**
 * 2音間の距離（関係性）を表現する不変の値オブジェクト
 */
export class Interval {
  constructor(public readonly semitones: number) {
    Object.freeze(this);
  }

  /**
   * 音程の名前を取得する
   */
  get name(): string {
    const names = [
      'Root',
      'MinorSecond',
      'MajorSecond',
      'MinorThird',
      'MajorThird',
      'PerfectFourth',
      'Tritone',
      'PerfectFifth',
      'MinorSixth',
      'MajorSixth',
      'MinorSeventh',
      'MajorSeventh',
    ];
    const normalizedSemitones = PitchClass.modulo12(this.semitones);
    return names[normalizedSemitones] || `Unknown(${this.semitones})`;
  }

  // 便宜上の別名
  static readonly Half = new Interval(1); // 半音
  static readonly Whole = new Interval(2); // 全音

  // 基本的な12音程
  static readonly Root = new Interval(0); // 根音
  static readonly MinorSecond = new Interval(1); // 短2度
  static readonly MajorSecond = new Interval(2); // 長2度
  static readonly MinorThird = new Interval(3); // 短3度
  static readonly MajorThird = new Interval(4); // 長3度
  static readonly PerfectFourth = new Interval(5); // 完全4度
  static readonly Tritone = new Interval(6); // 増4度 / 減5度
  static readonly PerfectFifth = new Interval(7); // 完全5度
  static readonly MinorSixth = new Interval(8); // 短6度
  static readonly MajorSixth = new Interval(9); // 長6度
  static readonly MinorSeventh = new Interval(10); // 短7度
  static readonly MajorSeventh = new Interval(11); // 長7度
  static readonly Octave = new Interval(12); // 完全8度 (オクターブ)

  /**
   * インターバルの方向を反転させた新しいインスタンスを返す (例: +4 -> -4)
   * @returns 方向が反転したInterval
   */
  invert(): Interval {
    return new Interval(-this.semitones);
  }

  /**
   * 2つのPitchClass間のIntervalを計算する
   * @param from 開始音（PitchClass）
   * @param to 終了音（PitchClass）
   * @returns 2つの音間のInterval
   */
  static between(from: PitchClass, to: PitchClass): Interval {
    // 上行方向の半音数を計算（オクターブ内で正規化）
    let semitones = PitchClass.modulo12(to.index - from.index);
    if (semitones < 0) {
      semitones += 12;
    }

    return new Interval(semitones);
  }

  /**
   * 2つのIntervalが等しいかどうかを判定する
   * @param other 比較対象のInterval
   * @returns 等しい場合true
   */
  equals(other: Interval): boolean {
    return this.semitones === other.semitones;
  }

  /**
   * 2つのIntervalを半音数で比較する関数
   * @param a 比較対象のInterval1
   * @param b 比較対象のInterval2
   * @returns a < b なら負の値、a > b なら正の値、等しければ0
   */
  static compare(a: Interval, b: Interval): number {
    return a.semitones - b.semitones;
  }

  /**
   * Interval配列を半音数の昇順でソートする
   * @param intervals ソート対象のInterval配列
   * @returns ソートされた新しい配列
   */
  static sort(intervals: Interval[]): Interval[] {
    return [...intervals].sort(Interval.compare);
  }
}
