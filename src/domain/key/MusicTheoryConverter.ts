/**
 * 音楽理論変換ユーティリティ（最小化版）
 *
 * 実際に使用されているメソッドのみを保持。
 * ChordBuilderで使用されている2つのメソッドのみ含む。
 */

import { PitchClass, type FifthsIndex, type PitchClassName } from '@/domain/common/PitchClass';
import { Interval } from '@/domain/common/Interval';

/**
 * 音楽理論変換ユーティリティ（最小化版）
 */
export class MusicTheoryConverter {
  /**
   * 五度圏インデックスから音名を取得
   */
  static fifthsToNoteName(fifthsIndex: FifthsIndex): PitchClassName {
    return PitchClass.fromFifthsIndex(fifthsIndex).name;
  }

  /**
   * 五度圏ポジションから相対マイナーキーの音名を取得
   *
   * 各ポジションのメジャーキーから短3度下の音名が相対マイナーキーとなる
   * 例: C major (position 0) → A minor
   */
  static fifthsToRelativeMinorNoteName(fifthsIndex: FifthsIndex): PitchClassName {
    // メジャーキーの音名を取得
    const majorPitchClass = PitchClass.fromFifthsIndex(fifthsIndex);
    // 短3度下（-3セミトーン）に移調
    const minorThirdDown = -new Interval('minor3rd').semitones;
    return majorPitchClass.transpose(minorThirdDown).name;
  }
}
