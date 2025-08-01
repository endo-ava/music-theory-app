/**
 * 音符の値オブジェクト
 */

/**
 * 音名（ルート名）
 */
export type NoteName = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';

/**
 * オクターブ番号（一般的な範囲）
 */
export type Octave = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

/**
 * 音符を表現する値オブジェクト
 *
 * 音楽理論における具体的な音の高さを表現する。
 * Tone.jsでの再生に必要な情報を提供する。
 */
export class Note {
  constructor(
    private readonly _noteName: NoteName,
    private readonly _octave: Octave
  ) {
    this.validateNote(_noteName, _octave);
  }

  /**
   * 音名
   */
  get noteName(): NoteName {
    return this._noteName;
  }

  /**
   * オクターブ番号
   */
  get octave(): Octave {
    return this._octave;
  }

  /**
   * Tone.jsで使用する文字列表現（例: "C4", "F#3"）
   */
  get toneNotation(): string {
    return `${this._noteName}${this._octave}`;
  }

  /**
   * 表示用文字列
   */
  getDisplay(): string {
    return this.toneNotation;
  }

  /**
   * 他の音符との等価性をチェック
   */
  equals(other: Note): boolean {
    return this._noteName === other._noteName && this._octave === other._octave;
  }

  /**
   * 文字列表現
   */
  toString(): string {
    return this.toneNotation;
  }

  /**
   * 音符の妥当性検証
   */
  private validateNote(noteName: NoteName, octave: Octave): void {
    const validNoteNames: NoteName[] = [
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
    ];

    if (!validNoteNames.includes(noteName)) {
      throw new Error(`Invalid note name: ${noteName}`);
    }

    if (octave < 0 || octave > 8) {
      throw new Error(`Invalid octave: ${octave}. Must be between 0 and 8`);
    }
  }
}
