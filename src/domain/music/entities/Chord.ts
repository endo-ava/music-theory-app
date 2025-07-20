/**
 * 和音エンティティ
 */

import { Note } from '../value-objects/Note';
import { Interval } from '../value-objects/Interval';

/**
 * 和音の種類
 */
export type ChordType =
  | 'major' // メジャートライアド（1, 3, 5度）
  | 'minor' // マイナートライアド（1, ♭3, 5度）
  | 'major7' // メジャー7th（1, 3, 5, 7度）
  | 'minor7' // マイナー7th（1, ♭3, 5, ♭7度）
  | 'dominant7'; // ドミナント7th（1, 3, 5, ♭7度）

/**
 * 和音エンティティ
 *
 * 音楽理論における和音を表現し、構成音の管理と
 * 音響再生に必要な情報を提供する。
 */
export class Chord {
  private readonly _notes: ReadonlyArray<Note>;

  constructor(
    private readonly _root: Note,
    private readonly _type: ChordType,
    notes?: Note[]
  ) {
    // 構成音が明示的に渡された場合はそれを使用、
    // そうでなければ和音タイプから自動生成
    this._notes = notes ? notes : this.generateNotes(_root, _type);
    this.validateChord();
  }

  /**
   * ルート音
   */
  get root(): Note {
    return this._root;
  }

  /**
   * 和音タイプ
   */
  get type(): ChordType {
    return this._type;
  }

  /**
   * 構成音の配列
   */
  get notes(): ReadonlyArray<Note> {
    return this._notes;
  }

  /**
   * 和音名（例: "Cmaj", "Am"）
   */
  get name(): string {
    const typeNames: Record<ChordType, string> = {
      major: '',
      minor: 'm',
      major7: 'maj7',
      minor7: 'm7',
      dominant7: '7',
    };
    return `${this._root.noteName}${typeNames[this._type]}`;
  }

  /**
   * Tone.js用の音符表記配列
   */
  get toneNotations(): string[] {
    return this._notes.map(note => note.toneNotation);
  }

  /**
   * 表示用文字列
   */
  getDisplay(): string {
    return this.name;
  }

  /**
   * 詳細説明
   */
  getDescription(): string {
    const noteNames = this._notes.map(note => note.noteName).join(', ');
    return `${this.name} (${noteNames})`;
  }

  /**
   * 他の和音との等価性をチェック
   */
  equals(other: Chord): boolean {
    return (
      this._root.equals(other._root) &&
      this._type === other._type &&
      this._notes.length === other._notes.length &&
      this._notes.every((note, index) => note.equals(other._notes[index]))
    );
  }

  /**
   * 文字列表現
   */
  toString(): string {
    return `Chord(${this.name})`;
  }

  /**
   * 和音タイプから構成音を生成
   */
  private generateNotes(root: Note, type: ChordType): Note[] {
    const intervals = this.getIntervalsForChordType(type);
    const notes: Note[] = [root]; // ルート音から開始

    intervals.forEach(interval => {
      if (interval.semitones > 0) {
        // ユニゾン以外
        const noteFromRoot = this.addInterval(root, interval);
        notes.push(noteFromRoot);
      }
    });

    return notes;
  }

  /**
   * 和音タイプに対応する音程配列を取得
   */
  private getIntervalsForChordType(type: ChordType): Interval[] {
    switch (type) {
      case 'major':
        return [
          Interval.unison(), // 1度
          Interval.majorThird(), // 長3度
          Interval.perfectFifth(), // 完全5度
        ];
      case 'minor':
        return [
          Interval.unison(), // 1度
          Interval.minorThird(), // 短3度
          Interval.perfectFifth(), // 完全5度
        ];
      case 'major7':
        return [
          Interval.unison(), // 1度
          Interval.majorThird(), // 長3度
          Interval.perfectFifth(), // 完全5度
          Interval.majorSeventh(), // 長7度
        ];
      case 'minor7':
        return [
          Interval.unison(), // 1度
          Interval.minorThird(), // 短3度
          Interval.perfectFifth(), // 完全5度
          Interval.minorSeventh(), // 短7度
        ];
      case 'dominant7':
        return [
          Interval.unison(), // 1度
          Interval.majorThird(), // 長3度
          Interval.perfectFifth(), // 完全5度
          Interval.minorSeventh(), // 短7度
        ];
      default:
        throw new Error(`Unsupported chord type: ${type}`);
    }
  }

  /**
   * ルート音に音程を追加して新しい音符を生成
   */
  private addInterval(root: Note, interval: Interval): Note {
    // セミトーン数に基づいて新しい音名とオクターブを計算
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const rootIndex = noteNames.indexOf(root.noteName);

    if (rootIndex === -1) {
      throw new Error(`Invalid root note: ${root.noteName}`);
    }

    const newIndex = (rootIndex + interval.semitones) % 12;
    const octaveAdjustment = Math.floor((rootIndex + interval.semitones) / 12);
    const newNoteName = noteNames[newIndex] as Note['noteName'];
    const newOctave = (root.octave + octaveAdjustment) as Note['octave'];

    return new Note(newNoteName, newOctave);
  }

  /**
   * 和音の妥当性検証
   */
  private validateChord(): void {
    if (this._notes.length === 0) {
      throw new Error('Chord must have at least one note');
    }

    if (!this._notes[0].equals(this._root)) {
      throw new Error('First note must be the root note');
    }
  }

  /**
   * ファクトリーメソッド: メジャートライアド
   */
  static major(root: Note): Chord {
    return new Chord(root, 'major');
  }

  /**
   * ファクトリーメソッド: マイナートライアド
   */
  static minor(root: Note): Chord {
    return new Chord(root, 'minor');
  }

  /**
   * ファクトリーメソッド: メジャー7th
   */
  static major7(root: Note): Chord {
    return new Chord(root, 'major7');
  }

  /**
   * ファクトリーメソッド: マイナー7th
   */
  static minor7(root: Note): Chord {
    return new Chord(root, 'minor7');
  }

  /**
   * ファクトリーメソッド: ドミナント7th
   */
  static dominant7(root: Note): Chord {
    return new Chord(root, 'dominant7');
  }
}
