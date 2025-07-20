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
   * ルート音の音名から最適なオクターブを決定
   * G#(A♭)以上の高い音は3、それ以下は4を使用
   */
  private getOptimizedOctave(noteName: string): Octave {
    // G#(A♭)以上の音名は低いオクターブにする
    const highNotes = ['G#', 'A', 'A#', 'B'];
    return highNotes.includes(noteName) ? 3 : 4;
  }

  /**
   * Positionからメジャートライアドを構築
   *
   * @param fifthsIndex 五度圏インデックス
   * @param octave 基準オクターブ（未指定時は音名に応じて最適化）
   * @returns 対応するメジャートライアド
   */
  buildMajorTriadFromPosition(fifthsIndex: FifthsIndex, octave?: Octave): Chord {
    const noteName = MusicTheoryConverter.fifthsToNoteName(fifthsIndex);
    const finalOctave = octave ?? this.getOptimizedOctave(noteName);
    const rootNote = new Note(noteName, finalOctave);

    return Chord.major(rootNote);
  }

  /**
   * Positionからマイナートライアドを構築
   *
   * @param fifthsIndex 五度圏インデックス
   * @param octave 基準オクターブ（未指定時は音名に応じて最適化）
   * @returns 対応するマイナートライアド（相対マイナーキー）
   */
  buildMinorTriadFromPosition(fifthsIndex: FifthsIndex, octave?: Octave): Chord {
    // 相対マイナーキーの音名を取得（メジャーキーから短3度下）
    const minorNoteName = MusicTheoryConverter.fifthsToRelativeMinorNoteName(fifthsIndex);
    const finalOctave = octave ?? this.getOptimizedOctave(minorNoteName);
    const rootNote = new Note(minorNoteName, finalOctave);

    return Chord.minor(rootNote);
  }
}
