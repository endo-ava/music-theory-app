/**
 * 和音構築ドメインサービス
 */

import type { Position } from '../types/Position';
import type { KeyName } from '../value-objects/KeyName';
import { Note, NoteName } from '../value-objects/Note';
import { Chord, ChordType } from '../entities/Chord';

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
   * @param position 五度圏上の位置
   * @param octave 基準オクターブ（デフォルト: 4）
   * @returns 対応するメジャートライアド
   */
  buildMajorTriadFromPosition(position: Position, octave: 4 = 4): Chord {
    const keyName = this.getKeyNameFromPosition(position);
    const noteName = this.extractNoteNameFromKeyName(keyName);
    const rootNote = new Note(noteName, octave);

    return Chord.major(rootNote);
  }

  /**
   * Positionからマイナートライアドを構築
   *
   * @param position 五度圏上の位置
   * @param octave 基準オクターブ（デフォルト: 4）
   * @returns 対応するマイナートライアド
   */
  buildMinorTriadFromPosition(position: Position, octave: 4 = 4): Chord {
    const keyName = this.getMinorKeyNameFromPosition(position);
    const noteName = this.extractNoteNameFromKeyName(keyName);
    const rootNote = new Note(noteName, octave);

    return Chord.minor(rootNote);
  }

  /**
   * KeyNameから和音を構築
   *
   * @param keyName キー名
   * @param chordType 和音タイプ（デフォルト: メジャー/マイナー自動判定）
   * @param octave 基準オクターブ（デフォルト: 4）
   * @returns 対応する和音
   */
  buildChordFromKeyName(keyName: KeyName, chordType?: ChordType, octave: 4 = 4): Chord {
    const noteName = this.extractNoteNameFromKeyName(keyName);
    const rootNote = new Note(noteName, octave);

    // 和音タイプが指定されていない場合は自動判定
    const type = chordType || (keyName.includes('m') ? 'minor' : 'major');

    return new Chord(rootNote, type);
  }

  /**
   * 特定の音名から指定タイプの和音を構築
   *
   * @param noteName 音名
   * @param chordType 和音タイプ
   * @param octave 基準オクターブ（デフォルト: 4）
   * @returns 対応する和音
   */
  buildChord(noteName: NoteName, chordType: ChordType, octave: 4 = 4): Chord {
    const rootNote = new Note(noteName, octave);
    return new Chord(rootNote, chordType);
  }

  /**
   * 五度圏の位置からメジャーキー名を取得
   */
  private getKeyNameFromPosition(position: Position): KeyName {
    const majorKeys: KeyName[] = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#', 'F'];
    return majorKeys[position];
  }

  /**
   * 五度圏の位置からマイナーキー名を取得
   */
  private getMinorKeyNameFromPosition(position: Position): KeyName {
    const minorKeys: KeyName[] = [
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
    return minorKeys[position];
  }

  /**
   * キー名から音名を抽出
   *
   * @param keyName キー名（例: "C", "F#", "Am", "D#m"）
   * @returns 音名（例: "C", "F#", "A", "D#"）
   */
  private extractNoteNameFromKeyName(keyName: KeyName): NoteName {
    // マイナーキーの場合は末尾の 'm' を除去
    const noteName = keyName.replace('m', '');

    // 有効な音名かチェック
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

    if (!validNoteNames.includes(noteName as NoteName)) {
      throw new Error(`Invalid note name extracted from key: ${keyName} -> ${noteName}`);
    }

    return noteName as NoteName;
  }

  /**
   * 全ての五度圏位置からメジャートライアドを生成
   *
   * @param octave 基準オクターブ（デフォルト: 4）
   * @returns Position をキーとした和音のマップ
   */
  buildAllMajorTriads(octave: 4 = 4): Map<Position, Chord> {
    const chords = new Map<Position, Chord>();

    for (let position = 0; position < 12; position++) {
      const chord = this.buildMajorTriadFromPosition(position as Position, octave);
      chords.set(position as Position, chord);
    }

    return chords;
  }

  /**
   * 全ての五度圏位置からマイナートライアドを生成
   *
   * @param octave 基準オクターブ（デフォルト: 4）
   * @returns Position をキーとした和音のマップ
   */
  buildAllMinorTriads(octave: 4 = 4): Map<Position, Chord> {
    const chords = new Map<Position, Chord>();

    for (let position = 0; position < 12; position++) {
      const chord = this.buildMinorTriadFromPosition(position as Position, octave);
      chords.set(position as Position, chord);
    }

    return chords;
  }
}
