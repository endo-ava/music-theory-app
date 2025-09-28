import { Accidental } from './Accidental';
import { PitchClass } from './PitchClass';

/**
 * 調号（Key Signature）を表すクラス。
 *
 * 調号を、五度圏（Circle of fifthsIndex）上の相対的な位置を示す数値 `fifthsIndex` によって定義します。
 * Cメジャー（Aマイナー）を基準(0)とします。
 *
 * このクラスは特定の調（例: Gメジャー）や旋法（例: ドリアン）について関知しません。
 * それは`Key`クラスの責務です。`KeySignature`は、純粋に「どの音にどの変化記号が付くか」
 * というルールセットのみをカプセル化します。
 *
 * @example
 * // Gメジャーの調号 (F#)
 * const gMajorSignature = KeySignature.fromFifthsIndex(1);
 * console.log(gMajorSignature.accidentals.get(PitchClass.F)); // Accidental.SHARP
 *
 * @example
 * // B♭メジャーの調号 (B♭, E♭)
 * const bbMajorSignature = KeySignature.fromFifthsIndex(10);
 * console.log(bbMajorSignature.accidentals.get(PitchClass.B)); // Accidental.FLAT
 * console.log(bbMajorSignature.accidentals.get(PitchClass.E)); // Accidental.FLAT
 */
export class KeySignature {
  /** 五度圏インデックス（0 ~ 11） */
  public readonly fifthsIndex: number;
  /** this.fifthsIndexのキーにおける変化記号（null=調号なし） */
  public readonly primaryAccidental: Accidental | null;
  /** この調号に含まれる変化記号のマップ。キーは音名({@link PitchClass})、バリューは変化記号({@link Accidental}) */
  public readonly accidentals: ReadonlyMap<PitchClass, Accidental>;
  /**
   * 生成されたインスタンスをキャッシュするためのMap。
   * これにより、同じfifths値に対して常に同じインスタンスが返されることを保証します（Flyweightパターン）。
   * @private
   */
  private static cache = new Map<number, KeySignature>();

  /** 調号なし */
  public static readonly NO_KEYSIGNATURE = 0 as const;
  /** シャープフラットどちらも */
  public static readonly SAME_KEYSIGNATURE = 6 as const;
  /** シャープ系の五度圏インデックス範囲 */
  public static readonly SHARP_RANGE = { min: 1, max: this.SAME_KEYSIGNATURE } as const;
  /** フラット系の五度圏インデックス範囲 */
  public static readonly FLAT_RANGE = { min: this.SAME_KEYSIGNATURE, max: 11 } as const;

  /**
   * 指定されたfifthsIndexがシャープ系かどうかを判定
   */
  public static isSharpSystem(fifthsIndex: number): boolean {
    return fifthsIndex >= this.SHARP_RANGE.min && fifthsIndex <= this.SHARP_RANGE.max;
  }

  /**
   * 指定されたfifthsIndexがフラット系かどうかを判定
   */
  public static isFlatSystem(fifthsIndex: number): boolean {
    return fifthsIndex >= this.FLAT_RANGE.min && fifthsIndex <= this.FLAT_RANGE.max;
  }

  /**
   * fifthsIndexから主要変化記号を決定する
   * @private
   */
  private determinePrimaryAccidental(fifthsIndex: number): Accidental | null {
    if (KeySignature.isFlatSystem(fifthsIndex)) {
      return Accidental.FLAT;
    } else if (KeySignature.isSharpSystem(fifthsIndex)) {
      return Accidental.SHARP;
    } else {
      return null;
    }
  }

  /**
   * `KeySignature`のインスタンスを生成します。
   * コンストラクタはprivateであり、外部からは`fromFifthsIndex`ファクトリメソッドを使用してください。
   * @param fifthsIndex - 五度圏インデックス（0 ~ 11）。
   */
  private constructor(fifthsIndex: number) {
    if (!Number.isInteger(fifthsIndex) || fifthsIndex < 0 || fifthsIndex > 11) {
      throw new Error('fifthsIndex must be an integer between 0 and 11');
    }
    this.fifthsIndex = fifthsIndex;
    this.primaryAccidental = this.determinePrimaryAccidental(fifthsIndex);
    this.accidentals = this.calculateAccidentals();
    Object.freeze(this);
  }

  /**
   * 五度圏上の位置を指定して、対応する`KeySignature`のインスタンスを取得します。
   *
   * @param fifthsIndex - 五度圏インデックス（0 ~ 11）。
   * @returns 対応する`KeySignature`のシングルトンインスタンス。
   */
  public static fromFifthsIndex(fifthsIndex: number): KeySignature {
    if (!this.cache.has(fifthsIndex)) {
      this.cache.set(fifthsIndex, new KeySignature(fifthsIndex));
    }
    return this.cache.get(fifthsIndex)!;
  }

  /**
   * `fifthsIndex`の値に基づいて、調号の変化記号マップを計算します。
   *
   * 音楽理論に従い、以下の順序で変化記号を付与します：
   * - シャープ系(1-6): F, C, G, D, A, E, B の順
   * - フラット系(7-11): B, E, A, D, G, C, F の順
   *
   * fifthsIndexと調号の対応：
   * - 0: 変化記号なし (C Major / A minor)
   * - 1-6: シャープ系 (G, D, A, E, B, F# Major)
   * - 7-11: フラット系 (Gb/F, Db/Cs, Ab/Gs, Eb/Ds, Bb/As Major)
   *
   * @private
   */
  private calculateAccidentals(): ReadonlyMap<PitchClass, Accidental> {
    const map = new Map<PitchClass, Accidental>();

    if (this.primaryAccidental === Accidental.FLAT) {
      // フラット系: PitchClassの定数を使用
      const numFlats = 12 - this.fifthsIndex;
      for (let i = 0; i < numFlats; i++) {
        map.set(PitchClass.FLAT_KEY_ORDER[i], Accidental.FLAT);
      }
    } else if (this.primaryAccidental === Accidental.SHARP) {
      // シャープ系: PitchClassの定数を使用
      for (let i = 0; i < this.fifthsIndex; i++) {
        map.set(PitchClass.SHARP_KEY_ORDER[i], Accidental.SHARP);
      }
    } else if (this.primaryAccidental === null) {
      // 変化記号なし (C Major / A minor)
      return map;
    }

    return map;
  }
}
