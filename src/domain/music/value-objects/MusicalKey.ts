/**
 * 調（MusicalKey）の値オブジェクト
 *
 * 音楽理論における調を表現する。
 * 特定のルート音（主音）と音階パターン（Scale）の組み合わせで定義される。
 * 音楽的文脈や世界観を表現し、相対的な音楽理論学習を支援する。
 */

import { Note } from './Note';
import { Scale, ScaleType } from './Scale';
import { KeyName, MajorKeyName, MinorKeyName } from './KeyName';

/**
 * 調を表現する値オブジェクト
 *
 * ルート音（主音）と音階パターンの組み合わせで構成される。
 * 従来のScaleクラスの「調」としての役割を担う。
 */
export class MusicalKey {
  private constructor(
    private readonly _root: Note,
    private readonly _scale: Scale
  ) {
    this.validateMusicalKey();
  }

  /**
   * メジャーキーを作成
   */
  static major(root: Note): MusicalKey {
    return new MusicalKey(root, Scale.major());
  }

  /**
   * マイナーキーを作成
   */
  static minor(root: Note): MusicalKey {
    return new MusicalKey(root, Scale.minor());
  }

  /**
   * キー名文字列から調を作成（従来のScale.fromKeyNameの機能）
   */
  static fromKeyName(keyName: KeyName): MusicalKey {
    // 有効なキー名の一覧
    const validMajorKeys: MajorKeyName[] = [
      'C',
      'G',
      'D',
      'A',
      'E',
      'B',
      'F#',
      'C#',
      'G#',
      'D#',
      'A#',
      'F',
    ];
    const validMinorKeys: MinorKeyName[] = [
      'Am',
      'Em',
      'Bm',
      'F#m',
      'C#m',
      'G#m',
      'D#m',
      'A#m',
      'Fm',
      'Cm',
      'Gm',
      'Dm',
    ];

    // マイナーキーは末尾に'm'が付く
    if (keyName.endsWith('m')) {
      if (!validMinorKeys.includes(keyName as MinorKeyName)) {
        throw new Error(`Invalid minor key name: ${keyName}`);
      }
      // 末尾の'm'を除去してルート音名を取得
      const rootNoteName = keyName.slice(0, -1) as Note['noteName'];
      const rootNote = new Note(rootNoteName, 4); // デフォルトオクターブは4
      return MusicalKey.minor(rootNote);
    } else {
      if (!validMajorKeys.includes(keyName as MajorKeyName)) {
        throw new Error(`Invalid major key name: ${keyName}`);
      }
      const rootNote = new Note(keyName as Note['noteName'], 4); // デフォルトオクターブは4
      return MusicalKey.major(rootNote);
    }
  }

  /**
   * カスタムスケールから調を作成
   */
  static fromScale(root: Note, scale: Scale): MusicalKey {
    return new MusicalKey(root, scale);
  }

  /**
   * デフォルトの調（C Major）を取得
   */
  static getDefault(): MusicalKey {
    return MusicalKey.major(new Note('C', 4));
  }

  /**
   * ルート音（主音）を取得
   */
  get root(): Note {
    return this._root;
  }

  /**
   * 音階パターンを取得
   */
  get scale(): Scale {
    return this._scale;
  }

  /**
   * スケールタイプを取得
   */
  get scaleType(): ScaleType {
    return this._scale.type;
  }

  /**
   * メジャーキーかどうか判定
   */
  get isMajor(): boolean {
    return this._scale.isMajor;
  }

  /**
   * マイナーキーかどうか判定
   */
  get isMinor(): boolean {
    return this._scale.isMinor;
  }

  /**
   * 表示用の文字列を取得
   * 形式: "C Major", "F# Minor", "D Dorian" 等
   */
  getDisplayName(): string {
    const rootName = this._root.noteName;
    const scaleName = this._scale.getDisplayName();

    // "Major Scale" → "Major", "Natural Minor Scale" → "Minor" のように簡略化
    const simplifiedScaleName = scaleName.replace(' Scale', '').replace('Natural ', '');

    return `${rootName} ${simplifiedScaleName}`;
  }

  /**
   * 省略表記を取得
   * 形式: "CM", "F#m", "DDor" 等
   */
  getShortName(): string {
    const rootName = this._root.noteName;
    const scaleShort = this._scale.getShortName();

    // メジャー・マイナーの特別な表記
    if (this._scale.isMajor) {
      return rootName; // Cメジャー → "C"
    } else if (this._scale.isMinor) {
      return `${rootName}m`; // Cマイナー → "Cm"
    } else {
      return `${rootName}${scaleShort}`;
    }
  }

  /**
   * レガシー互換性のためのトニック取得（廃止予定）
   * @deprecated MusicalKey.root を使用してください
   */
  get tonic(): KeyName {
    if (this.isMinor) {
      return `${this._root.noteName}m` as KeyName;
    } else {
      return this._root.noteName as KeyName;
    }
  }

  /**
   * レガシー互換性のためのモード取得（廃止予定）
   * @deprecated MusicalKey.scale.type を使用してください
   */
  get mode(): 'major' | 'minor' {
    if (this._scale.isMajor) return 'major';
    if (this._scale.isMinor) return 'minor';
    // その他のモードは一旦majorとして扱う（レガシー互換性のため）
    return 'major';
  }

  /**
   * 調に含まれる音符の配列を取得
   */
  getNotes(): Note[] {
    const notes: Note[] = [];
    const rootIndex = this.getNoteIndex(this._root.noteName);

    this._scale.intervals.forEach(interval => {
      const noteIndex = (rootIndex + interval.semitones) % 12;
      const noteName = this.getNoteNameFromIndex(noteIndex);
      const octaveAdjustment = Math.floor((rootIndex + interval.semitones) / 12);
      const octave = (this._root.octave + octaveAdjustment) as Note['octave'];

      notes.push(new Note(noteName, octave));
    });

    return notes;
  }

  /**
   * 同じ調かどうか判定
   */
  equals(other: MusicalKey): boolean {
    return this._root.equals(other._root) && this._scale.equals(other._scale);
  }

  /**
   * 文字列表現を取得（デバッグ用）
   */
  toString(): string {
    return this.getDisplayName();
  }

  /**
   * JSONシリアライゼーション用
   */
  toJSON(): {
    root: { noteName: Note['noteName']; octave: Note['octave'] };
    scale: { type: ScaleType; intervals: number[] };
  } {
    return {
      root: {
        noteName: this._root.noteName,
        octave: this._root.octave,
      },
      scale: this._scale.toJSON(),
    };
  }

  /**
   * JSONから復元
   */
  static fromJSON(json: {
    root: { noteName: Note['noteName']; octave: Note['octave'] };
    scale: { type: ScaleType; intervals: number[] };
  }): MusicalKey {
    const root = new Note(json.root.noteName, json.root.octave);
    const scale = Scale.fromJSON(json.scale);
    return new MusicalKey(root, scale);
  }

  /**
   * 調の妥当性検証
   */
  private validateMusicalKey(): void {
    if (!this._root) {
      throw new Error('MusicalKey must have a root note');
    }
    if (!this._scale) {
      throw new Error('MusicalKey must have a scale');
    }
  }

  /**
   * 音名からインデックス（0-11）を取得
   */
  private getNoteIndex(noteName: Note['noteName']): number {
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    return noteNames.indexOf(noteName);
  }

  /**
   * インデックス（0-11）から音名を取得
   */
  private getNoteNameFromIndex(index: number): Note['noteName'] {
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    return noteNames[index] as Note['noteName'];
  }
}
