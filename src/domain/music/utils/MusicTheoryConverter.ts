/**
 * 音楽理論の各種表現方法の相互変換ユーティリティ
 */

import type { FifthsIndex } from '../types/FifthsIndex';
import type { NoteName } from '../value-objects/Note';
import type { Semitones, IntervalType } from '../value-objects/Interval';
import { ChromaticIndex, type ChromaticIndexValue } from '../value-objects/ChromaticIndex';
import { Interval } from '../value-objects/Interval';

/**
 * 音楽理論変換ユーティリティ
 *
 * 12音の3つの表現方法の相互変換を一元管理する：
 * - FifthsIndex: 五度圏インデックス (0=C, 1=G, 2=D...)
 * - ChromaticIndex: 半音階順の位置 (0=C, 1=C#, 2=D...)
 * - Semitones: セミトーン数（音程表現）
 * - NoteName: 音名 (C, C#, D...)
 * - Interval: 度数表記
 */
export class MusicTheoryConverter {
  // FifthsIndex ↔ ChromaticIndex
  static fifthsToChromatic(fifthsIndex: FifthsIndex): ChromaticIndexValue {
    return ChromaticIndex.fromFifthsIndex(fifthsIndex).value;
  }

  static chromaticToFifths(chromatic: ChromaticIndexValue): FifthsIndex {
    return new ChromaticIndex(chromatic).toFifthsIndex();
  }

  // FifthsIndex ↔ NoteName
  static fifthsToNoteName(fifthsIndex: FifthsIndex): NoteName {
    return ChromaticIndex.fromFifthsIndex(fifthsIndex).toNoteName();
  }

  static noteNameToFifths(noteName: NoteName): FifthsIndex {
    return ChromaticIndex.fromNoteName(noteName).toFifthsIndex();
  }

  // FifthsIndex ↔ Semitones
  static fifthsToSemitones(fifthsIndex: FifthsIndex): Semitones {
    return ChromaticIndex.fromFifthsIndex(fifthsIndex).toSemitones();
  }

  static semitonesToFifths(semitones: Semitones): FifthsIndex {
    return ChromaticIndex.fromSemitones(semitones).toFifthsIndex();
  }

  // ChromaticIndex ↔ NoteName
  static chromaticToNoteName(chromatic: ChromaticIndexValue): NoteName {
    return new ChromaticIndex(chromatic).toNoteName();
  }

  static noteNameToChromatic(noteName: NoteName): ChromaticIndexValue {
    return ChromaticIndex.fromNoteName(noteName).value;
  }

  // ChromaticIndex ↔ Semitones
  static chromaticToSemitones(chromatic: ChromaticIndexValue): Semitones {
    return chromatic;
  }

  static semitonesToChromatic(semitones: Semitones): ChromaticIndexValue {
    return ChromaticIndex.fromSemitones(semitones).value;
  }

  // NoteName ↔ Semitones
  static noteNameToSemitones(noteName: NoteName): Semitones {
    return ChromaticIndex.fromNoteName(noteName).toSemitones();
  }

  static semitonesToNoteName(semitones: Semitones): NoteName {
    return ChromaticIndex.fromSemitones(semitones).toNoteName();
  }

  // Interval ↔ Semitones
  static intervalToSemitones(interval: Interval): Semitones {
    return interval.semitones;
  }

  static intervalToSemitonesByType(intervalType: IntervalType): Semitones {
    return new Interval(intervalType).semitones;
  }

  /**
   * 音名の配列を取得
   */
  static getAllNoteNames(): NoteName[] {
    return ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  }

  /**
   * 五度圏順の音名配列を取得
   */
  static getFifthsOrderNoteNames(): NoteName[] {
    const fifthsIndices: FifthsIndex[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    return fifthsIndices.map(index => this.fifthsToNoteName(index));
  }

  /**
   * 指定された音名から指定セミトーン上の音名を取得
   */
  static transposeNoteName(noteName: NoteName, semitones: Semitones): NoteName {
    const chromatic = this.noteNameToChromatic(noteName);
    const newChromatic = this.semitonesToChromatic(chromatic + semitones);
    return this.chromaticToNoteName(newChromatic);
  }

  /**
   * 2つの音名間のセミトーン数を計算
   */
  static semitoneBetweenNoteNames(from: NoteName, to: NoteName): Semitones {
    const fromChromatic = this.noteNameToChromatic(from);
    const toChromatic = this.noteNameToChromatic(to);
    return (toChromatic - fromChromatic + 12) % 12;
  }
}
