/**
 * Note値オブジェクトのユニットテスト
 */

import { describe, it, expect } from 'vitest';
import { Note, type NoteName, type Octave } from '../Note';

describe('Note', () => {
  describe('constructor', () => {
    it('正常ケース: 有効な音名とオクターブでインスタンスを作成', () => {
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
      const validOctaves: Octave[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];

      validNoteNames.forEach(noteName => {
        validOctaves.forEach(octave => {
          const note = new Note(noteName, octave);
          expect(note.noteName).toBe(noteName);
          expect(note.octave).toBe(octave);
        });
      });
    });

    it('異常ケース: 無効な音名でエラーをスロー', () => {
      const invalidNoteNames = ['H', 'Do', 'Re', '', 'Cb', 'E#'];

      invalidNoteNames.forEach(invalidName => {
        expect(() => new Note(invalidName as NoteName, 4)).toThrow(
          `Invalid note name: ${invalidName}`
        );
      });
    });

    it('異常ケース: 無効なオクターブでエラーをスロー', () => {
      const invalidOctaves = [-1, 9, 10];

      invalidOctaves.forEach(invalidOctave => {
        expect(() => new Note('C', invalidOctave as Octave)).toThrow(
          `Invalid octave: ${invalidOctave}. Must be between 0 and 8`
        );
      });
    });
  });

  describe('toneNotation getter', () => {
    it('正常ケース: Tone.js用の正しい文字列表現を返す', () => {
      const testCases: Array<[NoteName, Octave, string]> = [
        ['C', 4, 'C4'],
        ['C#', 3, 'C#3'],
        ['F#', 5, 'F#5'],
        ['G#', 2, 'G#2'],
        ['A#', 0, 'A#0'],
        ['B', 8, 'B8'],
      ];

      testCases.forEach(([noteName, octave, expectedToneNotation]) => {
        const note = new Note(noteName, octave);
        expect(note.toneNotation).toBe(expectedToneNotation);
      });
    });
  });

  describe('getDisplay', () => {
    it('正常ケース: 表示用文字列がtoneNotationと同じ', () => {
      const note = new Note('F#', 4);

      expect(note.getDisplay()).toBe(note.toneNotation);
      expect(note.getDisplay()).toBe('F#4');
    });
  });

  describe('equals', () => {
    it('正常ケース: 同じ音名とオクターブでtrueを返す', () => {
      const note1 = new Note('C', 4);
      const note2 = new Note('C', 4);

      expect(note1.equals(note2)).toBe(true);
    });

    it('正常ケース: 異なる音名でfalseを返す', () => {
      const note1 = new Note('C', 4);
      const note2 = new Note('D', 4);

      expect(note1.equals(note2)).toBe(false);
    });

    it('正常ケース: 異なるオクターブでfalseを返す', () => {
      const note1 = new Note('C', 4);
      const note2 = new Note('C', 5);

      expect(note1.equals(note2)).toBe(false);
    });

    it('正常ケース: 音名とオクターブ両方が異なる場合falseを返す', () => {
      const note1 = new Note('C', 4);
      const note2 = new Note('G', 3);

      expect(note1.equals(note2)).toBe(false);
    });
  });

  describe('toString', () => {
    it('正常ケース: toneNotationと同じ文字列を返す', () => {
      const testCases: Array<[NoteName, Octave]> = [
        ['C', 4],
        ['F#', 3],
        ['G#', 7],
        ['A#', 1],
      ];

      testCases.forEach(([noteName, octave]) => {
        const note = new Note(noteName, octave);
        expect(note.toString()).toBe(note.toneNotation);
        expect(note.toString()).toBe(`${noteName}${octave}`);
      });
    });
  });

  describe('境界値テスト', () => {
    it('境界値ケース: 最低オクターブ（0）', () => {
      const note = new Note('C', 0);

      expect(note.noteName).toBe('C');
      expect(note.octave).toBe(0);
      expect(note.toneNotation).toBe('C0');
    });

    it('境界値ケース: 最高オクターブ（8）', () => {
      const note = new Note('B', 8);

      expect(note.noteName).toBe('B');
      expect(note.octave).toBe(8);
      expect(note.toneNotation).toBe('B8');
    });

    it('境界値ケース: 全音名での基準オクターブ（4）', () => {
      const allNoteNames: NoteName[] = [
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

      allNoteNames.forEach(noteName => {
        const note = new Note(noteName, 4);
        expect(note.noteName).toBe(noteName);
        expect(note.octave).toBe(4);
        expect(note.toneNotation).toBe(`${noteName}4`);
      });
    });
  });

  describe('音楽理論的特性', () => {
    it('正常ケース: 中央C（C4）の特性', () => {
      const middleC = new Note('C', 4);

      expect(middleC.noteName).toBe('C');
      expect(middleC.octave).toBe(4);
      expect(middleC.toneNotation).toBe('C4');
    });

    it('正常ケース: オクターブ関係の音符', () => {
      const c3 = new Note('C', 3);
      const c4 = new Note('C', 4);
      const c5 = new Note('C', 5);

      // 同じ音名だが異なるオクターブ
      expect(c3.noteName).toBe(c4.noteName);
      expect(c4.noteName).toBe(c5.noteName);

      expect(c3.equals(c4)).toBe(false);
      expect(c4.equals(c5)).toBe(false);

      // オクターブの数値関係
      expect(c4.octave - c3.octave).toBe(1);
      expect(c5.octave - c4.octave).toBe(1);
    });

    it('正常ケース: シャープ付き音名の処理', () => {
      const sharpNotes: NoteName[] = ['C#', 'D#', 'F#', 'G#', 'A#'];

      sharpNotes.forEach(noteName => {
        const note = new Note(noteName, 4);
        expect(note.noteName).toBe(noteName);
        expect(note.toneNotation).toContain('#');
        expect(note.toneNotation).toBe(`${noteName}4`);
      });
    });

    it('正常ケース: ナチュラル音名の処理', () => {
      const naturalNotes: NoteName[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

      naturalNotes.forEach(noteName => {
        const note = new Note(noteName, 4);
        expect(note.noteName).toBe(noteName);
        expect(note.toneNotation).not.toContain('#');
        expect(note.toneNotation).toBe(`${noteName}4`);
      });
    });
  });

  describe('型安全性の検証', () => {
    it('正常ケース: NoteName型の完全性', () => {
      // 12音階の全ての音名が定義されていることを確認
      const expectedNoteNames: NoteName[] = [
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

      expect(expectedNoteNames.length).toBe(12);

      // 全ての音名でNoteを作成できることを確認
      expectedNoteNames.forEach(noteName => {
        expect(() => new Note(noteName, 4)).not.toThrow();
      });
    });

    it('正常ケース: Octave型の範囲確認', () => {
      // 0-8の範囲が正しく定義されていることを確認
      const expectedOctaves: Octave[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];

      expect(expectedOctaves.length).toBe(9);

      // 全てのオクターブでNoteを作成できることを確認
      expectedOctaves.forEach(octave => {
        expect(() => new Note('C', octave)).not.toThrow();
      });
    });
  });

  describe('実用例', () => {
    it('正常ケース: 基本的なCメジャートライアドの構成音', () => {
      const cMajorTriad = [
        new Note('C', 4), // ルート
        new Note('E', 4), // 長3度
        new Note('G', 4), // 完全5度
      ];

      expect(cMajorTriad[0].toneNotation).toBe('C4');
      expect(cMajorTriad[1].toneNotation).toBe('E4');
      expect(cMajorTriad[2].toneNotation).toBe('G4');

      // Tone.js用の文字列配列生成
      const toneNotations = cMajorTriad.map(note => note.toneNotation);
      expect(toneNotations).toEqual(['C4', 'E4', 'G4']);
    });

    it('正常ケース: 異なるオクターブでの和音展開', () => {
      const expandedChord = [
        new Note('C', 3), // 低音
        new Note('E', 4), // 中音
        new Note('G', 4), // 中音
        new Note('C', 5), // 高音（オクターブ上）
      ];

      const toneNotations = expandedChord.map(note => note.toneNotation);
      expect(toneNotations).toEqual(['C3', 'E4', 'G4', 'C5']);
    });

    it('正常ケース: シャープを含む和音', () => {
      // F#メジャートライアド
      const fSharpMajor = [
        new Note('F#', 4), // ルート
        new Note('A#', 4), // 長3度
        new Note('C#', 5), // 完全5度（次のオクターブ）
      ];

      const toneNotations = fSharpMajor.map(note => note.toneNotation);
      expect(toneNotations).toEqual(['F#4', 'A#4', 'C#5']);
    });
  });
});
