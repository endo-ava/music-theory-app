/**
 * PitchClass値オブジェクト
 *
 * オクターブに依存しない12の音名を表現する基本要素。
 * 音楽理論における「音高クラス」の概念を実装。
 *
 * 設計思想：
 * - 色の名前のように、具体的な高さを持たない純粋な音名
 * - すべての音楽的構造の基礎となる原子的要素
 * - 半音階インデックス（0-11）と五度圏インデックス（0-11）を内部で管理
 */

/**
 * 音高クラス名の型定義
 */
export type PitchClassName =
  | 'C'
  | 'C#'
  | 'D'
  | 'D#'
  | 'E'
  | 'F'
  | 'F#'
  | 'G'
  | 'G#'
  | 'A'
  | 'A#'
  | 'B';

/**
 * 半音階インデックス（0-11）の型定義
 * C=0, C#=1, D=2, D#=3, E=4, F=5, F#=6, G=7, G#=8, A=9, A#=10, B=11
 */
export type ChromaticIndexValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

/**
 * 五度圏インデックス（0-11）の型定義
 * 五度ずつ上行する順序での音の位置を表現する。
 * 0 = C, 1 = G, 2 = D, 3 = A, 4 = E, 5 = B, 6 = F#, 7 = C#, 8 = G#, 9 = D#, 10 = A#, 11 = F
 */
export type FifthsIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

/**
 * 半音階インデックスが有効な範囲内かどうかをチェック
 */
export function isValidChromaticIndex(index: number): index is ChromaticIndexValue {
  return Number.isInteger(index) && index >= 0 && index < 12;
}

/**
 * 五度圏インデックスが有効な範囲内かどうかをチェック
 */
export function isValidFifthsIndex(index: number): index is FifthsIndex {
  return Number.isInteger(index) && index >= 0 && index < 12;
}

/**
 * 音高クラス（オクターブに依存しない音名）の値オブジェクト
 *
 * 12の半音階における純粋な音名を表現し、
 * 移調、和音構築、音階構築などの基礎となる。
 */
export class PitchClass {
  private static readonly PITCH_CLASSES: readonly PitchClassName[] = [
    'C',
    'C#',
    'D',
    'D#',
    'E',
    'F',
    'F#',
    'G',
    'G#',
    'A',
    'A#',
    'B',
  ] as const;

  private static readonly PITCH_CLASS_TO_INDEX: Record<PitchClassName, number> = {
    C: 0,
    'C#': 1,
    D: 2,
    'D#': 3,
    E: 4,
    F: 5,
    'F#': 6,
    G: 7,
    'G#': 8,
    A: 9,
    'A#': 10,
    B: 11,
  };

  constructor(private readonly _name: PitchClassName) {
    this.validatePitchClass(_name);
  }

  /**
   * 音高クラス名を取得
   */
  get name(): PitchClassName {
    return this._name;
  }

  /**
   * 半音階インデックス（0-11）を取得
   */
  get chromaticIndex(): ChromaticIndexValue {
    return PitchClass.PITCH_CLASS_TO_INDEX[this._name] as ChromaticIndexValue;
  }

  /**
   * 五度圏上のポジション（0-11）を取得
   */
  get fifthsIndex(): FifthsIndex {
    // 半音階から五度圏への変換テーブル
    const chromaticToFifths: Record<ChromaticIndexValue, FifthsIndex> = {
      0: 0, // C
      7: 1, // G
      2: 2, // D
      9: 3, // A
      4: 4, // E
      11: 5, // B
      6: 6, // F#
      1: 7, // C#
      8: 8, // G#
      3: 9, // D#
      10: 10, // A#
      5: 11, // F
    };
    return chromaticToFifths[this.chromaticIndex];
  }

  /**
   * 指定されたインターバル分移調した新しいPitchClassを取得
   */
  transpose(semitones: number): PitchClass {
    const newIndex = (((this.chromaticIndex + semitones) % 12) + 12) % 12;
    return PitchClass.fromChromaticIndex(newIndex);
  }

  /**
   * セミトーン数として取得（半音階インデックスと同値）
   */
  get semitones(): ChromaticIndexValue {
    return this.chromaticIndex;
  }

  /**
   * 他のPitchClassとの音程（セミトーン数）を計算
   */
  intervalTo(other: PitchClass): ChromaticIndexValue {
    return ((((other.chromaticIndex - this.chromaticIndex) % 12) + 12) % 12) as ChromaticIndexValue;
  }

  /**
   * 等価性判定
   */
  equals(other: PitchClass): boolean {
    return this._name === other._name;
  }

  /**
   * 文字列表現
   */
  toString(): string {
    return this._name;
  }

  /**
   * 表示用文字列（toString()と同じ）
   */
  getDisplayName(): string {
    return this._name;
  }

  /**
   * JSONシリアライゼーション用
   */
  toJSON(): { name: PitchClassName } {
    return { name: this._name };
  }

  /**
   * 半音階インデックスからPitchClassを作成
   */
  static fromChromaticIndex(index: number): PitchClass {
    const normalizedIndex = ((index % 12) + 12) % 12;
    return new PitchClass(PitchClass.PITCH_CLASSES[normalizedIndex]);
  }

  /**
   * 五度圏インデックスからPitchClassを作成
   */
  static fromFifthsIndex(fifthsIndex: number): PitchClass {
    // 五度圏から半音階への変換テーブル
    const fifthsToChromatic: Record<FifthsIndex, ChromaticIndexValue> = {
      0: 0, // C
      1: 7, // G
      2: 2, // D
      3: 9, // A
      4: 4, // E
      5: 11, // B
      6: 6, // F#
      7: 1, // C#
      8: 8, // G#
      9: 3, // D#
      10: 10, // A#
      11: 5, // F
    };

    const normalizedFifthsIndex = (((fifthsIndex % 12) + 12) % 12) as FifthsIndex;
    const chromaticIndex = fifthsToChromatic[normalizedFifthsIndex];
    return PitchClass.fromChromaticIndex(chromaticIndex);
  }

  /**
   * セミトーン数からPitchClassを作成
   */
  static fromSemitones(semitones: number): PitchClass {
    const normalizedSemitones = ((semitones % 12) + 12) % 12;
    return PitchClass.fromChromaticIndex(normalizedSemitones);
  }

  /**
   * JSONから復元
   */
  static fromJSON(json: { name: PitchClassName }): PitchClass {
    return new PitchClass(json.name);
  }

  /**
   * すべてのPitchClassを取得（半音階順）
   */
  static getAllChromaticOrder(): PitchClass[] {
    return PitchClass.PITCH_CLASSES.map(name => new PitchClass(name));
  }

  /**
   * すべてのPitchClassを取得（五度圏順）
   */
  static getAllFifthsOrder(): PitchClass[] {
    return Array.from({ length: 12 }, (_, i) => PitchClass.fromFifthsIndex(i));
  }

  /**
   * バリデーション
   */
  private validatePitchClass(name: PitchClassName): void {
    if (!PitchClass.PITCH_CLASSES.includes(name)) {
      throw new Error(`Invalid pitch class name: ${name}`);
    }
  }
}
