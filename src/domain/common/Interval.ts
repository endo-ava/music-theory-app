/**
 * 2音間の距離（関係性）を表現する不変の値オブジェクト
 */
export class Interval {
  constructor(public readonly semitones: number) {
    Object.freeze(this);
  }

  // --- 12音程の定義 ---

  // 便宜上の別名
  static readonly Half = new Interval(1); // 半音
  static readonly Whole = new Interval(2); // 全音

  // 基本的な12音程
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
}
