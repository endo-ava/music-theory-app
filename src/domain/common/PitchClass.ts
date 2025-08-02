import { Interval } from './Interval';

/**
 * オクターブに依存しない音名（C, C#, D...）を表現する不変の値オブジェクト
 */
export class PitchClass {
  // 外部からの直接インスタンス化を防ぐためprivateにする
  private constructor(
    public readonly name: string,
    public readonly chromaticIndex: number, // C=0, C#=1 ... B=11
    public readonly circleOfFifthsIndex: number // C=0, G=1 ... F=11
  ) {}

  // 全ての音名を静的プロパティとして定義・保持
  private static readonly C = new PitchClass('C', 0, 0);
  private static readonly CSharp = new PitchClass('C#', 1, 7);
  private static readonly D = new PitchClass('D', 2, 2);
  private static readonly DSharp = new PitchClass('D#', 3, 9);
  private static readonly E = new PitchClass('E', 4, 4);
  private static readonly F = new PitchClass('F', 5, 11);
  private static readonly FSharp = new PitchClass('F#', 6, 6);
  private static readonly G = new PitchClass('G', 7, 1);
  private static readonly GSharp = new PitchClass('G#', 8, 8);
  private static readonly A = new PitchClass('A', 9, 3);
  private static readonly ASharp = new PitchClass('A#', 10, 10);
  private static readonly B = new PitchClass('B', 11, 5);

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
    const found = this.ALL_PITCH_CLASSES.find(p => p.chromaticIndex === targetChromaticIndex);
    if (!found) throw new Error('無効なインデックスです。');
    return found;
  }

  /**
   * 指定されたインターバル分だけ移調した新しいPitchClassを返す
   * @param interval 移調するインターバル
   */
  transposeBy(interval: Interval): PitchClass {
    const newIndex = (this.chromaticIndex + interval.semitones) % 12;
    // 負数の剰余対策
    const positiveIndex = (newIndex + 12) % 12;
    const found = PitchClass.ALL_PITCH_CLASSES.find(p => p.chromaticIndex === positiveIndex);
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
