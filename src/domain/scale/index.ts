import { PitchClass, ScalePattern, Note } from '../common';

/**
 * 具体的な音階を表す集約（Aggregate Root）
 */
export class Scale {
  public readonly root: PitchClass;
  public readonly pattern: ScalePattern;
  private readonly notes: readonly Note[];

  /**
   * Scaleを生成する
   * @param root ルートとなる音名
   * @param pattern スケールパターン
   * @param rootOctave ルート音のオクターブ（任意、デフォルトは4）
   */
  constructor(root: PitchClass, pattern: ScalePattern, rootOctave: number = 4) {
    this.root = root;
    this.pattern = pattern;
    this.notes = this.generateNotes(new Note(root, rootOctave));
    Object.freeze(this);
  }

  /**
   * スケールの構成音リストを取得する
   */
  getNotes(): readonly Note[] {
    return this.notes;
  }

  /**
   * 指定された度数の音を取得する
   * @param degree 度数（1から始まる）
   */
  getNoteForDegree(degree: number): Note | undefined {
    if (degree < 1 || degree > this.notes.length) {
      return undefined;
    }
    return this.notes[degree - 1];
  }

  /**
   * Tone.js用の音符表記配列
   */
  get toneNotations(): string[] {
    return this.notes.map(note => note.toString);
  }

  /**
   * ルート音とパターンから、具体的な構成音の配列を生成する
   * @param rootNote ルート音（オクターブ情報を含む）
   */
  private generateNotes(rootNote: Note): readonly Note[] {
    const generated: Note[] = [rootNote];
    let currentNote = rootNote;

    // パターンの最後のインターバルは次のオクターブのルートに戻るため、n-1回ループ
    for (let i = 0; i < this.pattern.intervals.length; i++) {
      const interval = this.pattern.intervals[i];
      const nextNote = currentNote.transposeBy(interval);
      generated.push(nextNote);
      currentNote = nextNote;
    }

    return Object.freeze(generated);
  }
}
