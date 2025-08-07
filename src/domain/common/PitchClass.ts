import { Interval } from './Interval';

/**
 * オクターブに依存しない音名（C, C#, D...）を表現する不変の値オブジェクト
 * エンハーモニック関係（C#=D♭など）に対応し、文脈に応じた適切な表記を提供する
 */
export class PitchClass {
  // 外部からの直接インスタンス化を防ぐためprivateにする
  private constructor(
    public readonly sharpName: string, // シャープ表記（例: 'C#'）
    public readonly flatName: string, // フラット表記（例: 'D♭'）
    public readonly index: number, // C=0, C#=1 ... B=11
    public readonly fifthsIndex: number // C=0, G=1 ... F=11
  ) {}

  /**
   * デフォルトの音名表記（後方互換性のため）
   * シャープ表記を使用
   */
  get name(): string {
    return this.sharpName;
  }

  /**
   * 文脈に応じた適切な音名表記を取得
   * @param context 表記の文脈
   * @returns 適切な音名表記
   */
  getDisplayName(context: 'major' | 'minor' | 'default' = 'default'): string {
    switch (context) {
      case 'major':
        return this.flatName;
      case 'minor':
        return this.sharpName;
      default:
        return this.sharpName;
    }
  }

  // 全ての音名を静的プロパティとして定義・保持（エンハーモニック対応）
  public static readonly C = new PitchClass('C', 'C', 0, 0);
  public static readonly CSharp = new PitchClass('C#', 'D♭', 1, 7);
  public static readonly D = new PitchClass('D', 'D', 2, 2);
  public static readonly DSharp = new PitchClass('D#', 'E♭', 3, 9);
  public static readonly E = new PitchClass('E', 'E', 4, 4);
  public static readonly F = new PitchClass('F', 'F', 5, 11);
  public static readonly FSharp = new PitchClass('F#', 'G♭', 6, 6);
  public static readonly G = new PitchClass('G', 'G', 7, 1);
  public static readonly GSharp = new PitchClass('G#', 'A♭', 8, 8);
  public static readonly A = new PitchClass('A', 'A', 9, 3);
  public static readonly ASharp = new PitchClass('A#', 'B♭', 10, 10);
  public static readonly B = new PitchClass('B', 'B', 11, 5);

  private static readonly ALL_PITCH_CLASSES = [
    PitchClass.C,
    PitchClass.CSharp,
    PitchClass.D,
    PitchClass.DSharp,
    PitchClass.E,
    PitchClass.F,
    PitchClass.FSharp,
    PitchClass.G,
    PitchClass.GSharp,
    PitchClass.A,
    PitchClass.ASharp,
    PitchClass.B,
  ];

  /**
   * 五度圏インデックスから対応するPitchClassインスタンスを生成する
   * @param index 五度圏インデックス (C=0, G=1, D=2...)
   */
  static fromCircleOfFifths(index: number): PitchClass {
    const targetChromaticIndex = (index * 7) % 12;
    const found = this.ALL_PITCH_CLASSES.find(p => p.index === targetChromaticIndex);
    if (!found) throw new Error('無効なインデックスです。');
    return found;
  }

  /**
   * 指定されたインターバル分だけ移調した新しいPitchClassを返す
   * @param interval 移調するインターバル
   */
  transposeBy(interval: Interval): PitchClass {
    const newIndex = (this.index + interval.semitones) % 12;
    // 負数の剰余対策
    const positiveIndex = (newIndex + 12) % 12;
    const found = PitchClass.ALL_PITCH_CLASSES.find(p => p.index === positiveIndex);
    if (!found) throw new Error('移調計算に失敗しました。');
    return found;
  }

  /**
   * 文字列表現を返す（Tone.js用）
   */
  toString(): string {
    return this.name;
  }
}
