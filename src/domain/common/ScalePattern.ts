import { Interval } from './Interval';

/**
 * 音階の設計図（インターバルパターン）を表現する値オブジェクト
 */
export class ScalePattern {
  constructor(
    public readonly name: string,
    public readonly intervals: readonly Interval[]
  ) {
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
}
