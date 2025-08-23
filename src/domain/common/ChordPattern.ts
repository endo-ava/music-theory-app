import { Interval } from './Interval';

// コードパターンの基本的な性質を定義する型
type ChordQuality = 'major' | 'minor' | 'diminished' | 'augmented' | 'other';

/**
 * 和音の設計図（インターバルパターン）を表現する値オブジェクト
 *
 * このクラスは、あらゆるコードの構造を定義する「設計図」として機能する。
 * 名前とインターバルの配列を保持し、コードの基本的な性質を判定する責務を持つ。
 */
export class ChordPattern {
  public readonly quality: ChordQuality;

  constructor(
    public readonly nameSuffix: string,
    public readonly intervals: readonly Interval[]
  ) {
    // 渡された配列をソートして不変にする
    this.intervals = Object.freeze(Interval.sort(intervals as Interval[]));
    this.quality = this.determineQuality();
    Object.freeze(this);
  }

  /**
   * 与えられたインターバル配列がこのパターンと一致するか判定する
   */
  public matches(intervalsToCompare: Interval[]): boolean {
    if (this.intervals.length !== intervalsToCompare.length) {
      return false;
    }
    const sortedToCompare = Interval.sort(intervalsToCompare);
    return this.intervals.every((interval, i) => interval.equals(sortedToCompare[i]));
  }

  /**
   * インターバル配列から、合致するChordPatternを検索する
   */
  public static findByIntervals(intervals: Interval[]): ChordPattern | null {
    return this.patterns.find(pattern => pattern.matches(intervals)) || null;
  }

  /**
   * ローマ数字での表記を取得する
   * @param degreeName rootのディグリーネーム（Ⅰ ~ Ⅶ）
   * @returns コードのディグリーネーム
   */
  getChordDegreeName(degreeName: string): string {
    let roman = degreeName;

    // コード品質に応じて表記を調整する
    switch (this.nameSuffix) {
      case 'dim':
        roman += '°';
        break;
      case 'half-diminished':
        roman += 'ø';
        break;
      case 'aug':
        roman += '+';
        break;
      default:
        roman += this.nameSuffix;
    }

    return roman;
  }

  // --- アプリケーションが知っている全ての「設計図」を定義 ---

  static readonly MajorTriad = new ChordPattern('', [Interval.MajorThird, Interval.PerfectFifth]);
  static readonly MinorTriad = new ChordPattern('m', [Interval.MinorThird, Interval.PerfectFifth]);
  static readonly DominantSeventh = new ChordPattern('7', [
    Interval.MajorThird,
    Interval.PerfectFifth,
    Interval.MinorSeventh,
  ]);
  static readonly MajorSeventh = new ChordPattern('maj7', [
    Interval.MajorThird,
    Interval.PerfectFifth,
    Interval.MajorSeventh,
  ]);
  static readonly MinorSeventh = new ChordPattern('m7', [
    Interval.MinorThird,
    Interval.PerfectFifth,
    Interval.MinorSeventh,
  ]);
  static readonly DiminishedTriad = new ChordPattern('dim', [
    Interval.MinorThird,
    Interval.Tritone,
  ]);

  /** 全てのパターン */
  private static readonly patterns: readonly ChordPattern[] = [
    this.MajorTriad,
    this.MinorTriad,
    this.DominantSeventh,
    this.MajorSeventh,
    this.MinorSeventh,
    this.DiminishedTriad,
  ];

  /**
   * インターバル配列から自身の基本的な性質（Major/Minorなど）を判定する
   */
  private determineQuality(): ChordQuality {
    // ルートからの各音のインターバル（半音数）をセットに格納する
    const intervalsFromRoot = new Set<number>();
    for (const interval of this.intervals) {
      intervalsFromRoot.add(interval.semitones);
    }

    // セットに特定のインターバルが含まれているかチェックする
    const hasMajorThird = intervalsFromRoot.has(Interval.MajorThird.semitones);
    const hasMinorThird = intervalsFromRoot.has(Interval.MinorThird.semitones);
    const hasPerfectFifth = intervalsFromRoot.has(Interval.PerfectFifth.semitones);
    const hasDiminishedFifth = intervalsFromRoot.has(Interval.Tritone.semitones);
    const hasAugmentedFifth = intervalsFromRoot.has(Interval.MinorSixth.semitones); // 8半音 = 増5度

    if (hasMajorThird && hasAugmentedFifth) return 'augmented';
    if (hasMajorThird && hasPerfectFifth) return 'major';
    if (hasMinorThird && hasPerfectFifth) return 'minor';
    if (hasMinorThird && hasDiminishedFifth) return 'diminished';

    return 'other'; // 上記のいずれでもない場合
  }
}
