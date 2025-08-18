/**
 * Note値オブジェクトのユニットテスト
 * 新しいNote実装（PitchClassベース）に対応
 */

import { describe, it, expect } from 'vitest';
import { Note } from '../Note';
import { PitchClass } from '../PitchClass';
import { Interval } from '../Interval';

describe('Note', () => {
  describe('constructor', () => {
    it('正常ケース: PitchClassとオクターブでインスタンスを作成', () => {
      const pitchClass = PitchClass.fromCircleOfFifths(0); // C
      const note = new Note(pitchClass, 4);

      expect(note._pitchClass.sharpName).toBe('C');
      expect(note._octave).toBe(4);
    });

    it('正常ケース: 全音名でインスタンス作成可能', () => {
      const testCases = [
        { circleIndex: 0, name: 'C' },
        { circleIndex: 7, name: 'C#' },
        { circleIndex: 2, name: 'D' },
        { circleIndex: 9, name: 'D#' },
        { circleIndex: 4, name: 'E' },
        { circleIndex: 11, name: 'F' },
        { circleIndex: 6, name: 'F#' },
        { circleIndex: 1, name: 'G' },
        { circleIndex: 8, name: 'G#' },
        { circleIndex: 3, name: 'A' },
        { circleIndex: 10, name: 'A#' },
        { circleIndex: 5, name: 'B' },
      ];

      testCases.forEach(({ circleIndex, name }) => {
        const pitchClass = PitchClass.fromCircleOfFifths(circleIndex);
        const note = new Note(pitchClass, 4);
        expect(note._pitchClass.sharpName).toBe(name);
        expect(note._octave).toBe(4);
      });
    });
  });

  describe('toString getter', () => {
    it('正常ケース: Tone.js用の正しい文字列表現を返す', () => {
      const testCases = [
        { circleIndex: 0, octave: 4, expected: 'C4' },
        { circleIndex: 7, octave: 3, expected: 'C#3' },
        { circleIndex: 6, octave: 5, expected: 'F#5' },
        { circleIndex: 8, octave: 2, expected: 'G#2' },
        { circleIndex: 10, octave: 0, expected: 'A#0' },
        { circleIndex: 5, octave: 8, expected: 'B8' },
      ];

      testCases.forEach(({ circleIndex, octave, expected }) => {
        const pitchClass = PitchClass.fromCircleOfFifths(circleIndex);
        const note = new Note(pitchClass, octave);
        expect(note.toString).toBe(expected);
      });
    });
  });

  describe('transposeBy メソッド', () => {
    it('正常ケース: 上行移調', () => {
      const cPitchClass = PitchClass.fromCircleOfFifths(0); // C
      const note = new Note(cPitchClass, 4); // C4

      const transposedNote = note.transposeBy(Interval.MajorThird); // +4半音
      expect(transposedNote._pitchClass.sharpName).toBe('E');
      expect(transposedNote._octave).toBe(4);
      expect(transposedNote.toString).toBe('E4');
    });

    it('正常ケース: オクターブを跨ぐ移調', () => {
      const aPitchClass = PitchClass.fromCircleOfFifths(3); // A
      const note = new Note(aPitchClass, 4); // A4

      const transposedNote = note.transposeBy(Interval.MajorThird); // +4半音
      expect(transposedNote._pitchClass.sharpName).toBe('C#');
      expect(transposedNote._octave).toBe(5);
      expect(transposedNote.toString).toBe('C#5');
    });

    it('正常ケース: 下行移調', () => {
      const cPitchClass = PitchClass.fromCircleOfFifths(0); // C
      const note = new Note(cPitchClass, 4); // C4

      const transposedNote = note.transposeBy(Interval.MinorThird.invert()); // -3半音
      expect(transposedNote._pitchClass.sharpName).toBe('A');
      expect(transposedNote._octave).toBe(3);
      expect(transposedNote.toString).toBe('A3');
    });

    it('正常ケース: オクターブ移調', () => {
      const cPitchClass = PitchClass.fromCircleOfFifths(0); // C
      const note = new Note(cPitchClass, 4); // C4

      const transposedNote = note.transposeBy(Interval.Octave); // +12半音
      expect(transposedNote._pitchClass.sharpName).toBe('C');
      expect(transposedNote._octave).toBe(5);
      expect(transposedNote.toString).toBe('C5');
    });
  });

  describe('境界値テスト', () => {
    it('境界値ケース: 最低オクターブ（0）', () => {
      const cPitchClass = PitchClass.fromCircleOfFifths(0); // C
      const note = new Note(cPitchClass, 0);

      expect(note._pitchClass.sharpName).toBe('C');
      expect(note._octave).toBe(0);
      expect(note.toString).toBe('C0');
    });

    it('境界値ケース: 最高オクターブ（8）', () => {
      const bPitchClass = PitchClass.fromCircleOfFifths(5); // B
      const note = new Note(bPitchClass, 8);

      expect(note._pitchClass.sharpName).toBe('B');
      expect(note._octave).toBe(8);
      expect(note.toString).toBe('B8');
    });

    it('境界値ケース: 基準オクターブ（4）での全音名', () => {
      const circleIndexes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
      const expectedNames = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#', 'F'];

      circleIndexes.forEach((index, i) => {
        const pitchClass = PitchClass.fromCircleOfFifths(index);
        const note = new Note(pitchClass, 4);
        expect(note._pitchClass.sharpName).toBe(expectedNames[i]);
        expect(note._octave).toBe(4);
        expect(note.toString).toBe(`${expectedNames[i]}4`);
      });
    });
  });

  describe('音楽理論的特性', () => {
    it('正常ケース: 中央C（C4）の特性', () => {
      const cPitchClass = PitchClass.fromCircleOfFifths(0); // C
      const middleC = new Note(cPitchClass, 4);

      expect(middleC._pitchClass.sharpName).toBe('C');
      expect(middleC._octave).toBe(4);
      expect(middleC.toString).toBe('C4');
    });

    it('正常ケース: オクターブ関係の音符', () => {
      const cPitchClass = PitchClass.fromCircleOfFifths(0); // C
      const c3 = new Note(cPitchClass, 3);
      const c4 = new Note(cPitchClass, 4);
      const c5 = new Note(cPitchClass, 5);

      // 同じ音名だが異なるオクターブ
      expect(c3._pitchClass.sharpName).toBe(c4._pitchClass.sharpName);
      expect(c4._pitchClass.sharpName).toBe(c5._pitchClass.sharpName);

      // オクターブの数値関係
      expect(c4._octave - c3._octave).toBe(1);
      expect(c5._octave - c4._octave).toBe(1);
    });

    it('正常ケース: シャープ付き音名の処理', () => {
      const sharpIndexes = [7, 9, 6, 8, 10]; // C#, D#, F#, G#, A#
      const sharpNames = ['C#', 'D#', 'F#', 'G#', 'A#'];

      sharpIndexes.forEach((index, i) => {
        const pitchClass = PitchClass.fromCircleOfFifths(index);
        const note = new Note(pitchClass, 4);
        expect(note._pitchClass.sharpName).toBe(sharpNames[i]);
        expect(note.toString).toContain('#');
        expect(note.toString).toBe(`${sharpNames[i]}4`);
      });
    });

    it('正常ケース: ナチュラル音名の処理', () => {
      const naturalIndexes = [0, 2, 4, 11, 1, 3, 5]; // C, D, E, F, G, A, B
      const naturalNames = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

      naturalIndexes.forEach((index, i) => {
        const pitchClass = PitchClass.fromCircleOfFifths(index);
        const note = new Note(pitchClass, 4);
        expect(note._pitchClass.sharpName).toBe(naturalNames[i]);
        expect(note.toString).not.toContain('#');
        expect(note.toString).toBe(`${naturalNames[i]}4`);
      });
    });
  });

  describe('移調テスト', () => {
    it('正常ケース: 基本的なインターバル移調', () => {
      const cPitchClass = PitchClass.fromCircleOfFifths(0); // C
      const c4 = new Note(cPitchClass, 4);

      // C4 + 長3度 = E4
      const e4 = c4.transposeBy(Interval.MajorThird);
      expect(e4._pitchClass.sharpName).toBe('E');
      expect(e4._octave).toBe(4);

      // C4 + 完全5度 = G4
      const g4 = c4.transposeBy(Interval.PerfectFifth);
      expect(g4._pitchClass.sharpName).toBe('G');
      expect(g4._octave).toBe(4);
    });

    it('正常ケース: 複雑な移調計算', () => {
      const fSharpPitchClass = PitchClass.fromCircleOfFifths(6); // F#
      const fSharp3 = new Note(fSharpPitchClass, 3);

      // F#3 + 短7度 = E4
      const e4 = fSharp3.transposeBy(Interval.MinorSeventh);
      expect(e4._pitchClass.sharpName).toBe('E');
      expect(e4._octave).toBe(4);
    });
  });

  describe('実用例', () => {
    it('正常ケース: 基本的なCメジャートライアドの構成音', () => {
      const cPitchClass = PitchClass.fromCircleOfFifths(0); // C
      const ePitchClass = PitchClass.fromCircleOfFifths(4); // E
      const gPitchClass = PitchClass.fromCircleOfFifths(1); // G

      const cMajorTriad = [
        new Note(cPitchClass, 4), // ルート
        new Note(ePitchClass, 4), // 長3度
        new Note(gPitchClass, 4), // 完全5度
      ];

      expect(cMajorTriad[0].toString).toBe('C4');
      expect(cMajorTriad[1].toString).toBe('E4');
      expect(cMajorTriad[2].toString).toBe('G4');

      // Tone.js用の文字列配列生成
      const toneNotations = cMajorTriad.map(note => note.toString);
      expect(toneNotations).toEqual(['C4', 'E4', 'G4']);
    });

    it('正常ケース: 異なるオクターブでの和音展開', () => {
      const cPitchClass = PitchClass.fromCircleOfFifths(0); // C
      const ePitchClass = PitchClass.fromCircleOfFifths(4); // E
      const gPitchClass = PitchClass.fromCircleOfFifths(1); // G

      const expandedChord = [
        new Note(cPitchClass, 3), // 低音
        new Note(ePitchClass, 4), // 中音
        new Note(gPitchClass, 4), // 中音
        new Note(cPitchClass, 5), // 高音（オクターブ上）
      ];

      const toneNotations = expandedChord.map(note => note.toString);
      expect(toneNotations).toEqual(['C3', 'E4', 'G4', 'C5']);
    });

    it('正常ケース: シャープを含む和音', () => {
      const fSharpPitchClass = PitchClass.fromCircleOfFifths(6); // F#
      const aSharpPitchClass = PitchClass.fromCircleOfFifths(10); // A#
      const cSharpPitchClass = PitchClass.fromCircleOfFifths(7); // C#

      // F#メジャートライアド
      const fSharpMajor = [
        new Note(fSharpPitchClass, 4), // ルート
        new Note(aSharpPitchClass, 4), // 長3度
        new Note(cSharpPitchClass, 5), // 完全5度（次のオクターブ）
      ];

      const toneNotations = fSharpMajor.map(note => note.toString);
      expect(toneNotations).toEqual(['F#4', 'A#4', 'C#5']);
    });
  });

  describe('equals メソッド', () => {
    it('正常ケース: 同じピッチクラスと同じオクターブのNoteは等しい', () => {
      const cPitchClass = PitchClass.fromCircleOfFifths(0); // C
      const note1 = new Note(cPitchClass, 4);
      const note2 = new Note(cPitchClass, 4);

      expect(note1.equals(note2)).toBe(true);
      expect(note2.equals(note1)).toBe(true);
    });

    it('正常ケース: 同じNote同士は等しい', () => {
      const cPitchClass = PitchClass.fromCircleOfFifths(0); // C
      const note = new Note(cPitchClass, 4);

      expect(note.equals(note)).toBe(true);
    });

    it('正常ケース: 異なるオクターブのNoteは等しくない', () => {
      const cPitchClass = PitchClass.fromCircleOfFifths(0); // C
      const c3 = new Note(cPitchClass, 3);
      const c4 = new Note(cPitchClass, 4);

      expect(c3.equals(c4)).toBe(false);
      expect(c4.equals(c3)).toBe(false);
    });

    it('正常ケース: 異なるピッチクラスのNoteは等しくない', () => {
      const cPitchClass = PitchClass.fromCircleOfFifths(0); // C
      const dPitchClass = PitchClass.fromCircleOfFifths(2); // D
      const c4 = new Note(cPitchClass, 4);
      const d4 = new Note(dPitchClass, 4);

      expect(c4.equals(d4)).toBe(false);
      expect(d4.equals(c4)).toBe(false);
    });

    it('正常ケース: 異なるピッチクラスと異なるオクターブのNoteは等しくない', () => {
      const cPitchClass = PitchClass.fromCircleOfFifths(0); // C
      const gPitchClass = PitchClass.fromCircleOfFifths(1); // G
      const c4 = new Note(cPitchClass, 4);
      const g5 = new Note(gPitchClass, 5);

      expect(c4.equals(g5)).toBe(false);
      expect(g5.equals(c4)).toBe(false);
    });

    it('エッジケース: null、undefined、非Noteオブジェクトとの比較', () => {
      const cPitchClass = PitchClass.fromCircleOfFifths(0); // C
      const c4 = new Note(cPitchClass, 4);

      expect(c4.equals(null as unknown as Note)).toBe(false);
      expect(c4.equals(undefined as unknown as Note)).toBe(false);
      expect(c4.equals({} as unknown as Note)).toBe(false);
      expect(c4.equals('C4' as unknown as Note)).toBe(false);
    });

    it('正常ケース: 異なる生成方法で作られた同じNoteは等しい', () => {
      const cPitchClass1 = PitchClass.fromCircleOfFifths(0); // C
      const cPitchClass2 = PitchClass.fromCircleOfFifths(0); // C
      const note1 = new Note(cPitchClass1, 4);
      const note2 = new Note(cPitchClass2, 4);

      expect(note1.equals(note2)).toBe(true);
    });

    it('正常ケース: 異なるエンハーモニック表記の比較', () => {
      const cSharpPitchClass = PitchClass.fromCircleOfFifths(7); // C#
      const dFlatPitchClass = PitchClass.fromCircleOfFifths(7); // 実際には同じインデックス
      const cSharp4 = new Note(cSharpPitchClass, 4);
      const dFlat4 = new Note(dFlatPitchClass, 4);

      // 同じPitchClassインデックスなので等しい
      expect(cSharp4.equals(dFlat4)).toBe(true);
    });
  });

  describe('sortByPitch 静的メソッド', () => {
    it('正常ケース: 音高順にソート', () => {
      const notes = [
        new Note(PitchClass.fromCircleOfFifths(0), 5), // C5
        new Note(PitchClass.fromCircleOfFifths(0), 3), // C3
        new Note(PitchClass.fromCircleOfFifths(4), 4), // E4
        new Note(PitchClass.fromCircleOfFifths(1), 4), // G4
      ];

      const sorted = Note.sortByPitch(notes);

      expect(sorted[0].toString).toBe('C3'); // 最低音
      expect(sorted[1].toString).toBe('E4');
      expect(sorted[2].toString).toBe('G4');
      expect(sorted[3].toString).toBe('C5'); // 最高音
    });

    it('正常ケース: 元の配列は変更されない', () => {
      const notes = [
        new Note(PitchClass.fromCircleOfFifths(0), 5), // C5
        new Note(PitchClass.fromCircleOfFifths(0), 3), // C3
      ];
      const originalOrder = notes.map(n => n.toString);

      const sorted = Note.sortByPitch(notes);

      // 元の配列は変更されていない
      expect(notes.map(n => n.toString)).toEqual(originalOrder);
      // ソート結果は異なる
      expect(sorted.map(n => n.toString)).toEqual(['C3', 'C5']);
    });

    it('正常ケース: 同じ音高の場合は元の順序を保持', () => {
      const c4_1 = new Note(PitchClass.fromCircleOfFifths(0), 4);
      const c4_2 = new Note(PitchClass.fromCircleOfFifths(0), 4);
      const notes = [c4_1, c4_2];

      const sorted = Note.sortByPitch(notes);

      expect(sorted[0]).toBe(c4_1); // 元の順序を保持
      expect(sorted[1]).toBe(c4_2);
    });

    it('エッジケース: 空の配列', () => {
      const sorted = Note.sortByPitch([]);
      expect(sorted).toEqual([]);
    });

    it('エッジケース: 単一要素', () => {
      const notes = [new Note(PitchClass.fromCircleOfFifths(0), 4)];
      const sorted = Note.sortByPitch(notes);

      expect(sorted.length).toBe(1);
      expect(sorted[0].toString).toBe('C4');
    });
  });
});
