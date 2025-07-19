/**
 * 半音階インデックス値オブジェクト
 */

import type { FifthsIndex } from '../types/FifthsIndex';
import type { NoteName } from './Note';
import type { Semitones } from './Interval';

/**
 * 12平均律における半音階インデックス（0-11）
 *
 * C=0, C#=1, D=2, D#=3, E=4, F=5, F#=6, G=7, G#=8, A=9, A#=10, B=11
 * 半音ずつ上行する順序での音の位置を表現する。
 */
export type ChromaticIndexValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

/**
 * 半音階インデックス値オブジェクト
 *
 * 12音を半音階順（C, C#, D, D#...）で並べた際のインデックス位置を表現し、
 * 他の音楽理論概念（Position、NoteName、Semitones）との変換を提供する。
 */
export class ChromaticIndex {
  constructor(private readonly _value: ChromaticIndexValue) {
    this.validateValue(_value);
  }

  /**
   * インデックス値
   */
  get value(): ChromaticIndexValue {
    return this._value;
  }

  /**
   * 対応する音名を取得
   */
  toNoteName(): NoteName {
    const noteNames: NoteName[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    return noteNames[this._value];
  }

  /**
   * 五度圏インデックスに変換
   */
  toFifthsIndex(): FifthsIndex {
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
    return chromaticToFifths[this._value];
  }

  /**
   * セミトーン数として取得（実質的に値と同じ）
   */
  toSemitones(): Semitones {
    return this._value;
  }

  /**
   * 値の妥当性検証
   */
  private validateValue(value: ChromaticIndexValue): void {
    if (!Number.isInteger(value) || value < 0 || value > 11) {
      throw new Error(`Invalid chromatic index: ${value}. Must be 0-11`);
    }
  }

  /**
   * ファクトリーメソッド: 音名から作成
   */
  static fromNoteName(noteName: NoteName): ChromaticIndex {
    const noteNameToIndex: Record<NoteName, ChromaticIndexValue> = {
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
    return new ChromaticIndex(noteNameToIndex[noteName]);
  }

  /**
   * ファクトリーメソッド: 五度圏インデックスから作成
   */
  static fromFifthsIndex(fifthsIndex: FifthsIndex): ChromaticIndex {
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
    return new ChromaticIndex(fifthsToChromatic[fifthsIndex]);
  }

  /**
   * ファクトリーメソッド: セミトーン数から作成
   */
  static fromSemitones(semitones: Semitones): ChromaticIndex {
    const normalizedSemitones = ((semitones % 12) + 12) % 12; // 負数対応
    return new ChromaticIndex(normalizedSemitones as ChromaticIndexValue);
  }
}
