/**
 * 和音構築ドメインサービス
 */

import type { FifthsIndex } from '../types/FifthsIndex';
import { Note, Octave } from '../value-objects/Note';
import { Chord } from '../entities/Chord';
import { MusicTheoryConverter } from '../utils/MusicTheoryConverter';

/**
 * 和音構築サービス
 *
 * 音楽理論のドメイン知識を使用して、
 * Position や KeyName から対応する和音を構築する。
 */
export class ChordBuilder {
  /**
   * PositionからメジャートライアドHを構築
   *
   * @param fifthsIndex 五度圏インデックス
   * @param octave 基準オクターブ（デフォルト: 4）
   * @returns 対応するメジャートライアド
   */
  buildMajorTriadFromPosition(fifthsIndex: FifthsIndex, octave: Octave = 4): Chord {
    const noteName = MusicTheoryConverter.fifthsToNoteName(fifthsIndex);
    const rootNote = new Note(noteName, octave);

    return Chord.major(rootNote);
  }

  /**
   * Positionからマイナートライアドを構築
   *
   * @param fifthsIndex 五度圏インデックス
   * @param octave 基準オクターブ（デフォルト: 4）
   * @returns 対応するマイナートライアド
   */
  buildMinorTriadFromPosition(fifthsIndex: FifthsIndex, octave: Octave = 4): Chord {
    const noteName = MusicTheoryConverter.fifthsToNoteName(fifthsIndex);
    const rootNote = new Note(noteName, octave);

    return Chord.minor(rootNote);
  }
}
