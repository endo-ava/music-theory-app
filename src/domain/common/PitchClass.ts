import { Interval } from './Interval';
import { KeySignature } from './KeySignature';
import { Accidental } from './Accidental';

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
  ) {
    Object.freeze(this);
  }

  /**
   * Key (Major)  KeySig   1  2  3  4  5  6  7
   * -------------------------------------------
   * - C    0      C  D  E  F  G  A  B
   * - G    1♯     G  A  B  C  D  E  F♯
   * - D    2♯     D  E  F♯ G  A  B  C♯
   * - A    3♯     A  B  C♯ D  E  F♯ G♯
   * - E    4♯     E  F♯ G♯ A  B  C♯ D♯
   * - B    5♯     B  C♯ D♯ E  F♯ G♯ A♯
   * - G♭   6♭     G♭ A♭ B♭ C♭ D♭ E♭ F
   * - D♭   5♭     D♭ E♭ F  G♭ A♭ B♭ C
   * - A♭   4♭     A♭ B♭ C  D♭ E♭ F  G
   * - E♭   3♭     E♭ F  G  A♭ B♭ C  D
   * - B♭   2♭     B♭ C  D  E♭ F  G  A
   * - F    1♭     F  G  A  B♭ C  D  E
   */
  public getNameFor(keySignature: KeySignature): string {
    // 調号に基づいて適切な表記を選択
    if (keySignature.primaryAccidental === Accidental.SHARP) return this.sharpName;
    if (keySignature.primaryAccidental === Accidental.FLAT) return this.flatName;
    // naturalの場合はデフォルトでsharp表記を使用
    return this.sharpName;
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

  /**
   * Circle of Fifths ordered pitch class array
   *
   * This ordering follows the Circle of Fifths progression (C-G-D-A-E-B-F#-C#-G#-D#-A#-F)
   * rather than chromatic ordering, which is essential for music theory calculations
   * and chord progression analysis.
   */
  public static readonly ALL_PITCH_CLASSES = [
    PitchClass.C,
    PitchClass.G,
    PitchClass.D,
    PitchClass.A,
    PitchClass.E,
    PitchClass.B,
    PitchClass.FSharp,
    PitchClass.CSharp,
    PitchClass.GSharp,
    PitchClass.DSharp,
    PitchClass.ASharp,
    PitchClass.F,
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
   * 任意の数値をピッチクラスの値（0-11）に正規化する
   * 数学的解釈：任意の数値を法12で正規化し、0-11の範囲に収める。負数にも正しく対応する数学的な剰余演算。
   * @param value 正規化したい数値
   * @returns 0-11の範囲に正規化された数値
   */
  public static modulo12 = (value: number): number => {
    return ((value % 12) + 12) % 12;
  };

  /**
   * 調号でシャープが付く順序（F, C, G, D, A, E, B）
   * 五度圏順序の末尾のF（fifthsIndex=11）から開始して7つの音名
   */
  public static readonly SHARP_KEY_ORDER: readonly PitchClass[] = (() => {
    const fifthsOrder = PitchClass.ALL_PITCH_CLASSES;
    // F（末尾） + C-B（先頭から6つ）
    return [fifthsOrder[11], ...fifthsOrder.slice(0, 6)];
  })();

  /**
   * 調号でフラットが付く順序（B, E, A, D, G, C, F）
   * シャープ順序の逆順（Bから逆方向）
   */
  public static readonly FLAT_KEY_ORDER: readonly PitchClass[] = (() => {
    // シャープ順序を逆にしてフラット順序を生成
    return [...PitchClass.SHARP_KEY_ORDER].reverse();
  })();

  /**
   * 指定されたインターバル分だけ移調した新しいPitchClassを返す
   * @param interval 移調するインターバル
   */
  transposeBy(interval: Interval): PitchClass {
    const newIndex = PitchClass.modulo12(this.index + interval.semitones);
    const found = PitchClass.ALL_PITCH_CLASSES.find(p => p.index === newIndex);
    if (!found) throw new Error('移調計算に失敗しました。');
    return found;
  }

  /**
   * 他のPitchClassとの等価性を判定する
   * @param other 比較対象のPitchClass
   * @returns 同じ音名クラスかどうか
   */
  equals(other: PitchClass): boolean {
    return this.index === other.index;
  }

  /**
   * 文字列表現
   */
  toString(): string {
    return this.sharpName;
  }
}
