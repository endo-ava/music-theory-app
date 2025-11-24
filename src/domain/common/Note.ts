import { Interval } from './Interval';
import { KeySignature } from './KeySignature';
import { PitchClass } from './PitchClass';

/**
 * オクターブを含む具体的な音高を表現する不変の値オブジェクト
 */
export class Note {
  constructor(
    private readonly _pitchClass: PitchClass,
    public readonly _octave: number = 4
  ) {
    Object.freeze(this);
  }

  /**
   * このNoteのピッチクラス（オクターブを除いた音名）を取得する
   */
  get pitchClass(): PitchClass {
    return this._pitchClass;
  }

  /**
   * このNoteのオクターブを取得する
   */
  get octave(): number {
    return this._octave;
  }

  /**
   * 指定された調号設定に基づいて音名を取得する
   * @param keySignature 調号設定（sharp/flat/natural）
   * @returns 適切な表記での音名
   */
  getNameFor(keySignature: KeySignature): string {
    return this.pitchClass.getNameFor(keySignature);
  }

  /**
   * Tone.jsで使用する文字列表現（例: "C4", "F#3"）
   */
  get toString(): string {
    return `${this.pitchClass}${this._octave}`;
  }

  /**
   * 絶対ピッチ値（MIDI番号に相当する整数値）
   * C0 = 0, C#0 = 1, ..., C4 = 48, C5 = 60, ...
   */
  get absolutePitch(): number {
    return this._octave * 12 + this.pitchClass.index;
  }

  /**
   * 指定されたインターバル分だけ移調した新しいNoteを返す
   * @param interval 移調するインターバル
   */
  transposeBy(interval: Interval): Note {
    const totalSemitones = this.pitchClass.index + this._octave * 12 + interval.semitones;

    const newOctave = Math.floor(totalSemitones / 12);
    const newChromaticIndex = totalSemitones % 12;

    const newPitchClass = Object.values(PitchClass).find(
      p => p instanceof PitchClass && p.index === newChromaticIndex
    );

    if (!newPitchClass) throw new Error('移調計算に失敗しました。');

    return new Note(newPitchClass, newOctave);
  }

  /**
   * 他のNoteと等しいかどうかを判定する
   * 同じピッチクラスと同じオクターブを持つ場合に等しいとみなす
   * @param other 比較対象のNote
   * @returns 等しい場合はtrue、そうでなければfalse
   */
  equals(other: Note): boolean {
    if (!(other instanceof Note)) return false;

    return this.pitchClass.index === other.pitchClass.index && this._octave === other._octave;
  }

  /**
   * Note配列を絶対ピッチの低い順にソートする
   * @param notes ソート対象のNote配列
   * @returns ソートされた新しい配列
   */
  static sortByPitch(notes: Note[]): Note[] {
    return [...notes].sort((a, b) => a.absolutePitch - b.absolutePitch);
  }
}
