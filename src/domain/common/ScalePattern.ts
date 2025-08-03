import { Interval } from './Interval';

// スケールパターンの基本的な性質を定義する型
type ScaleQuality = 'major' | 'minor' | 'diminished' | 'other';

/**
 * 音階の設計図（インターバルパターン）を表現する値オブジェクト
 */
export class ScalePattern {
  public readonly quality: ScaleQuality;
  constructor(
    public readonly name: string,
    public readonly intervals: readonly Interval[]
  ) {
    this.quality = this.determineQuality();
    Object.freeze(this);
  }

  /**
   * 自身のパターンと開始度数から、新しいモードのスケールパターンを導出する
   * @param startDegree 開始度数（1から始まる）
   * @param newName 新しいパターンの名前
   * @returns 導出された新しいScalePattern
   */
  derive(startDegree: number, newName: string): ScalePattern {
    if (startDegree < 1 || startDegree > this.intervals.length) {
      throw new Error('開始度数がパターンの音数を超えています。');
    }
    const startIndex = startDegree - 1;
    const rotatedIntervals = [
      ...this.intervals.slice(startIndex),
      ...this.intervals.slice(0, startIndex),
    ];
    return new ScalePattern(newName, rotatedIntervals);
  }

  // --- アプリケーションが知っている全ての「設計図」を定義 ---

  // 1. 基盤となるパターンを定義
  static readonly Major = new ScalePattern('Major', [
    Interval.Whole,
    Interval.Whole,
    Interval.Half,
    Interval.Whole,
    Interval.Whole,
    Interval.Whole,
    Interval.Half,
  ]);

  static readonly HarmonicMinor = new ScalePattern('Harmonic Minor', [
    Interval.Whole,
    Interval.Half,
    Interval.Whole,
    Interval.Whole,
    Interval.Half,
    Interval.MinorThird,
    Interval.Half,
  ]);

  // 2. Majorパターンのインスタンスメソッドを呼び出して各モードを導出
  static readonly Dorian = ScalePattern.Major.derive(2, 'Dorian');
  static readonly Phrygian = ScalePattern.Major.derive(3, 'Phrygian');
  static readonly Lydian = ScalePattern.Major.derive(4, 'Lydian');
  static readonly Mixolydian = ScalePattern.Major.derive(5, 'Mixolydian');
  static readonly Aeolian = ScalePattern.Major.derive(6, 'Aeolian (Natural Minor)');
  static readonly Locrian = ScalePattern.Major.derive(7, 'Locrian');

  /**
   * インターバル配列から自身の基本的な性質（Major/Minorなど）を判定する
   */
  private determineQuality(): ScaleQuality {
    // ルートからの各音のインターバル（半音数）をセットに格納する
    const intervalsFromRoot = new Set<number>();
    let cumulativeSemitones = 0;
    for (const interval of this.intervals) {
      cumulativeSemitones += interval.semitones;
      intervalsFromRoot.add(cumulativeSemitones);
    }

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
