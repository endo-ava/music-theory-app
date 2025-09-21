import { Interval } from './Interval';

// スケールパターンの基本的な性質を定義する型
export type ScaleQuality = 'major' | 'minor' | 'diminished' | 'other';

/**
 * 音階の設計図（インターバルパターン）を表現する値オブジェクト
 */
export class ScalePattern {
  public readonly quality: ScaleQuality;
  constructor(
    public readonly name: string,
    public readonly intervals: readonly Interval[],
    public readonly shortSymbol: string
  ) {
    this.quality = this.determineQuality();
    Object.freeze(this);
  }

  /**
   * 自身のパターンと開始度数から、新しいモードのスケールパターンを導出する
   * @param startDegree 開始度数（1から始まる）
   * @param newName 新しいパターンの名前
   * @param newShortSymbol 新しいパターンの短縮記号
   * @returns 導出された新しいScalePattern
   */
  derive(startDegree: number, newName: string, newShortSymbol: string): ScalePattern {
    if (startDegree < 1 || startDegree > this.intervals.length) {
      throw new Error('開始度数がパターンの音数を超えています。');
    }
    const startIndex = startDegree - 1;
    const rotatedIntervals = [
      ...this.intervals.slice(startIndex),
      ...this.intervals.slice(0, startIndex),
    ];
    return new ScalePattern(newName, rotatedIntervals, newShortSymbol);
  }

  // --- アプリケーションが知っている全ての「設計図」を定義 ---

  // 1. 基盤となるパターンを定義
  static readonly Major = new ScalePattern(
    'Major',
    [
      Interval.Whole,
      Interval.Whole,
      Interval.Half,
      Interval.Whole,
      Interval.Whole,
      Interval.Whole,
      Interval.Half,
    ],
    ''
  );

  static readonly HarmonicMinor = new ScalePattern(
    'Harmonic Minor',
    [
      Interval.Whole,
      Interval.Half,
      Interval.Whole,
      Interval.Whole,
      Interval.Half,
      Interval.MinorThird,
      Interval.Half,
    ],
    'hm'
  );

  // 2. Majorパターンのインスタンスメソッドを呼び出して各モードを導出
  static readonly Dorian = ScalePattern.Major.derive(2, 'Dorian', 'dor');
  static readonly Phrygian = ScalePattern.Major.derive(3, 'Phrygian', 'phr');
  static readonly Lydian = ScalePattern.Major.derive(4, 'Lydian', 'lyd');
  static readonly Mixolydian = ScalePattern.Major.derive(5, 'Mixolydian', 'mix');
  static readonly Aeolian = ScalePattern.Major.derive(6, 'Minor', 'm');
  static readonly Locrian = ScalePattern.Major.derive(7, 'Locrian', 'loc');

  /**
   * このスケールパターンが長3度を含むかどうか
   * keyName生成時の調号選択（♭ vs #）の基準として使用
   */
  get hasMajorThird(): boolean {
    const intervalsFromRoot = this.getIntervalsFromRoot();
    return intervalsFromRoot.has(Interval.MajorThird.semitones);
  }

  /**
   * ルートからの各音のインターバル（半音数）をセットとして取得
   * hasMajorThirdとdetermineQualityで共通利用
   */
  private getIntervalsFromRoot(): Set<number> {
    const intervalsFromRoot = new Set<number>();
    let cumulativeSemitones = 0;
    for (const interval of this.intervals) {
      cumulativeSemitones += interval.semitones;
      intervalsFromRoot.add(cumulativeSemitones);
    }
    return intervalsFromRoot;
  }

  /**
   * インターバル配列から自身の基本的な性質（Major/Minorなど）を判定する
   */
  private determineQuality(): ScaleQuality {
    const intervalsFromRoot = this.getIntervalsFromRoot();

    // セットに特定のインターバルが含まれているかチェックする
    const hasMajorThird = intervalsFromRoot.has(Interval.MajorThird.semitones);
    const hasMinorThird = intervalsFromRoot.has(Interval.MinorThird.semitones);
    const hasPerfectFifth = intervalsFromRoot.has(Interval.PerfectFifth.semitones);
    const hasDiminishedFifth = intervalsFromRoot.has(Interval.Tritone.semitones);

    if (hasMajorThird && hasPerfectFifth) return 'major';
    if (hasMinorThird && hasPerfectFifth) return 'minor';
    if (hasMinorThird && hasDiminishedFifth) return 'diminished';

    return 'other'; // 上記のいずれでもない場合
  }
}
