/** 変化記号の型 */
export type AccidentalType = 'sharp' | 'flat' | 'natural';

/**
 * 変化記号を表現する値オブジェクト
 *
 * 個別の音符に付与される♯（シャープ）、♭（フラット）、♮（ナチュラル）記号を表現する。
 * 調号（Key Signature）とは明確に区別され、楽譜上で特定の音符の音高を変更する記号として機能する。
 *
 * @example
 * ```typescript
 * // 静的インスタンスの使用
 * const sharp = Accidental.SHARP;
 * console.log(sharp.getSymbol()); // "♯"
 *
 * // 度数表記での使用
 * const degreeWithAccidental = { degree: 4, accidental: Accidental.SHARP };
 * const degreeName = AbstractMusicalContext.getDegreeNameFromNumber(degreeWithAccidental); // "♯Ⅳ"
 * ```
 */
export class Accidental {
  /** 変化記号の種類 */
  public readonly value: AccidentalType;

  /**
   * 変化記号を作成する
   * @param value 変化記号の種類（sharp/flat/natural）
   */
  constructor(value: AccidentalType) {
    this.value = value;
  }

  /**
   * 変化記号の表示用記号を取得する
   * @returns 変化記号記号（♯/♭/空文字）
   */
  public getSymbol(): string {
    if (this.value === 'sharp') return '♯';
    if (this.value === 'flat') return '♭';
    return '';
  }

  /** シャープ記号の静的インスタンス */
  public static readonly SHARP = new Accidental('sharp');
  /** フラット記号の静的インスタンス */
  public static readonly FLAT = new Accidental('flat');
  /** ナチュラル記号の静的インスタンス */
  public static readonly NATURAL = new Accidental('natural');
}
