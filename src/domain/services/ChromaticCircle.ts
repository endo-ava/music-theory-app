import { PitchClass } from '../common/PitchClass';

/**
 * クロマチックサークルのセグメント情報（ドメインモデル）
 */
export interface ChromaticSegmentData {
  /** セグメントの位置（0-11） */
  position: number;
  /** ピッチクラスのドメインオブジェクト */
  pitchClass: PitchClass;
}

/**
 * UI層に渡すDTO（シリアライズ可能）
 */
export interface ChromaticSegmentDTO {
  /** セグメントの位置（0-11） */
  position: number;
  /** ピッチクラス名（例: 'C', 'C♯/D♭'） */
  pitchClassName: string;
}

/**
 * クロマチックサークルに関する情報を提供するドメインサービス
 *
 * 12個のピッチクラスを半音階順（C, C♯, D, D♯...）に並べた
 * クロマチックサークルのセグメント情報を生成します。
 */
export class ChromaticCircleService {
  /** セグメント数（常に12） */
  public static readonly SEGMENT_COUNT = 12;

  private static segments: readonly ChromaticSegmentData[];

  /**
   * 12個のクロマチックサークルセグメント情報を生成
   * position 0 = C, 1 = C♯, 2 = D, ... 11 = B
   */
  static getSegments(): readonly ChromaticSegmentData[] {
    if (this.segments) {
      return this.segments;
    }

    const generatedSegments: ChromaticSegmentData[] = [];
    for (let i = 0; i < this.SEGMENT_COUNT; i++) {
      // 半音階順: 0=C, 1=C#, 2=D, ... 11=B
      const pitchClass = PitchClass.fromChromaticIndex(i);
      generatedSegments.push({
        position: i,
        pitchClass,
      });
    }

    this.segments = Object.freeze(generatedSegments);
    return this.segments;
  }

  /**
   * UI層に渡すためのDTO配列を生成
   * 異名同音を併記表記（例: C♯/D♭）
   */
  static getSegmentDTOs(): readonly ChromaticSegmentDTO[] {
    const segments = this.getSegments();
    return segments.map(segment => ({
      position: segment.position,
      pitchClassName: this.formatPitchClassName(segment.pitchClass),
    }));
  }

  /**
   * ピッチクラスを表示用文字列にフォーマット
   * 異名同音を併記（C♯/D♭のように）
   */
  private static formatPitchClassName(pitchClass: PitchClass): string {
    const sharpName = pitchClass.sharpName;
    const flatName = pitchClass.flatName;

    // シャープ名とフラット名が異なる場合は併記
    if (sharpName !== flatName) {
      return `${sharpName}/${flatName}`;
    }
    return sharpName;
  }
}
