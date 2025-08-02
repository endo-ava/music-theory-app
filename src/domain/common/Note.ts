import { Interval } from './Interval';
import { PitchClass } from './PitchClass';

/**
 * オクターブを含む具体的な音高を表現する不変の値オブジェクト
 */
export class Note {
  constructor(
    public readonly _pitchClass: PitchClass,
    public readonly _octave: number
  ) {
    Object.freeze(this);
  }

  /**
   * Tone.jsで使用する文字列表現（例: "C4", "F#3"）
   */
  get toString(): string {
    return `${this._pitchClass}${this._octave}`;
  }

  /**
   * 指定されたインターバル分だけ移調した新しいNoteを返す
   * @param interval 移調するインターバル
   */
  transposeBy(interval: Interval): Note {
    const totalSemitones = this._pitchClass.chromaticIndex + this._octave * 12 + interval.semitones;

    const newOctave = Math.floor(totalSemitones / 12);
    const newChromaticIndex = totalSemitones % 12;

    const newPitchClass = Object.values(PitchClass).find(
      p => p instanceof PitchClass && p.chromaticIndex === newChromaticIndex
    );

    if (!newPitchClass) throw new Error('移調計算に失敗しました。');

    return new Note(newPitchClass, newOctave);
  }
}
