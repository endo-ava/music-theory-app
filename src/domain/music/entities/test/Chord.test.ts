/**
 * Chord エンティティのユニットテスト
 */

import { describe, expect, it } from 'vitest';
import { Chord, type ChordType } from '../Chord';
import { Note, NoteName, Octave } from '../../value-objects/Note';

describe('Chord', () => {
  describe('constructor', () => {
    it('正常ケース: ルート音と和音タイプで和音を作成', () => {
      const root = new Note('C', 4);
      const chord = new Chord(root, 'major');

      expect(chord.root).toEqual(root);
      expect(chord.type).toBe('major');
      expect(chord.notes.length).toBe(3); // トライアド
    });

    it('正常ケース: 構成音を明示的に指定して和音を作成', () => {
      const root = new Note('C', 4);
      const notes = [new Note('C', 4), new Note('E', 4), new Note('G', 4)];
      const chord = new Chord(root, 'major', notes);

      expect(chord.root).toEqual(root);
      expect(chord.type).toBe('major');
      expect(chord.notes).toEqual(notes);
    });

    it('異常ケース: 構成音が空の配列でエラーをスロー', () => {
      const root = new Note('C', 4);
      const emptyNotes: Note[] = [];

      expect(() => new Chord(root, 'major', emptyNotes)).toThrow(
        'Chord must have at least one note'
      );
    });

    it('異常ケース: 最初の音がルート音でない場合エラーをスロー', () => {
      const root = new Note('C', 4);
      const invalidNotes = [
        new Note('E', 4), // ルート音（C）ではない
        new Note('G', 4),
      ];

      expect(() => new Chord(root, 'major', invalidNotes)).toThrow(
        'First note must be the root note'
      );
    });
  });

  describe('name getter', () => {
    it('正常ケース: 各和音タイプの正しい名前を返す', () => {
      const root = new Note('C', 4);
      const testCases: Array<[ChordType, string]> = [
        ['major', 'C'],
        ['minor', 'Cm'],
        ['major7', 'Cmaj7'],
        ['minor7', 'Cm7'],
        ['dominant7', 'C7'],
      ];

      testCases.forEach(([chordType, expectedName]) => {
        const chord = new Chord(root, chordType);
        expect(chord.name).toBe(expectedName);
      });
    });

    it('正常ケース: シャープ付きルート音の和音名', () => {
      const root = new Note('F#', 4);
      const testCases: Array<[ChordType, string]> = [
        ['major', 'F#'],
        ['minor', 'F#m'],
        ['major7', 'F#maj7'],
        ['minor7', 'F#m7'],
        ['dominant7', 'F#7'],
      ];

      testCases.forEach(([chordType, expectedName]) => {
        const chord = new Chord(root, chordType);
        expect(chord.name).toBe(expectedName);
      });
    });
  });

  describe('toneNotations getter', () => {
    it('正常ケース: Tone.js用文字列配列を返す', () => {
      const root = new Note('C', 4);
      const chord = new Chord(root, 'major');

      expect(chord.toneNotations).toEqual(['C4', 'E4', 'G4']);
    });

    it('正常ケース: 異なるオクターブでの表記', () => {
      const root = new Note('G', 3);
      const chord = new Chord(root, 'minor');

      expect(chord.toneNotations).toEqual(['G3', 'A#3', 'D4']);
    });
  });

  describe('構成音生成テスト', () => {
    it('正常ケース: メジャートライアドの構成音', () => {
      const testCases: Array<[string, number, string[]]> = [
        ['C', 4, ['C4', 'E4', 'G4']],
        ['G', 4, ['G4', 'B4', 'D5']],
        ['F', 4, ['F4', 'A4', 'C5']],
        ['F#', 4, ['F#4', 'A#4', 'C#5']],
      ];

      testCases.forEach(([noteName, octave, expectedTones]) => {
        const root = new Note(noteName as NoteName, octave as Octave);
        const chord = new Chord(root, 'major');
        expect(chord.toneNotations).toEqual(expectedTones);
      });
    });

    it('正常ケース: マイナートライアドの構成音', () => {
      const testCases: Array<[string, number, string[]]> = [
        ['C', 4, ['C4', 'D#4', 'G4']],
        ['G', 4, ['G4', 'A#4', 'D5']],
        ['A', 4, ['A4', 'C5', 'E5']],
        ['F#', 4, ['F#4', 'A4', 'C#5']],
      ];

      testCases.forEach(([noteName, octave, expectedTones]) => {
        const root = new Note(noteName as NoteName, octave as Octave);
        const chord = new Chord(root, 'minor');
        expect(chord.toneNotations).toEqual(expectedTones);
      });
    });

    it('正常ケース: メジャー7thコードの構成音', () => {
      const root = new Note('C', 4);
      const chord = new Chord(root, 'major7');

      expect(chord.toneNotations).toEqual(['C4', 'E4', 'G4', 'B4']);
      expect(chord.notes.length).toBe(4);
    });

    it('正常ケース: マイナー7thコードの構成音', () => {
      const root = new Note('C', 4);
      const chord = new Chord(root, 'minor7');

      expect(chord.toneNotations).toEqual(['C4', 'D#4', 'G4', 'A#4']);
      expect(chord.notes.length).toBe(4);
    });

    it('正常ケース: ドミナント7thコードの構成音', () => {
      const root = new Note('C', 4);
      const chord = new Chord(root, 'dominant7');

      expect(chord.toneNotations).toEqual(['C4', 'E4', 'G4', 'A#4']);
      expect(chord.notes.length).toBe(4);
    });
  });

  describe('オクターブ処理', () => {
    it('正常ケース: オクターブを跨ぐ音程の処理', () => {
      // B4から始まると、上の音はオクターブを跨ぐ
      const root = new Note('B', 4);
      const chord = new Chord(root, 'major');

      expect(chord.toneNotations).toEqual(['B4', 'D#5', 'F#5']);
    });

    it('正常ケース: 低いオクターブでの和音', () => {
      const root = new Note('C', 2);
      const chord = new Chord(root, 'major');

      expect(chord.toneNotations).toEqual(['C2', 'E2', 'G2']);
    });

    it('正常ケース: 高いオクターブでの和音', () => {
      const root = new Note('G', 6);
      const chord = new Chord(root, 'minor');

      expect(chord.toneNotations).toEqual(['G6', 'A#6', 'D7']);
    });
  });

  describe('equals', () => {
    it('正常ケース: 同じ和音でtrueを返す', () => {
      const root = new Note('C', 4);
      const chord1 = new Chord(root, 'major');
      const chord2 = new Chord(root, 'major');

      expect(chord1.equals(chord2)).toBe(true);
    });

    it('正常ケース: 異なるルート音でfalseを返す', () => {
      const chord1 = new Chord(new Note('C', 4), 'major');
      const chord2 = new Chord(new Note('G', 4), 'major');

      expect(chord1.equals(chord2)).toBe(false);
    });

    it('正常ケース: 異なる和音タイプでfalseを返す', () => {
      const root = new Note('C', 4);
      const chord1 = new Chord(root, 'major');
      const chord2 = new Chord(root, 'minor');

      expect(chord1.equals(chord2)).toBe(false);
    });

    it('正常ケース: 異なるオクターブでfalseを返す', () => {
      const chord1 = new Chord(new Note('C', 4), 'major');
      const chord2 = new Chord(new Note('C', 5), 'major');

      expect(chord1.equals(chord2)).toBe(false);
    });
  });

  describe('getDisplay と getDescription', () => {
    it('正常ケース: getDisplayが和音名を返す', () => {
      const root = new Note('F#', 4);
      const chord = new Chord(root, 'minor');

      expect(chord.getDisplay()).toBe('F#m');
      expect(chord.getDisplay()).toBe(chord.name);
    });

    it('正常ケース: getDescriptionが詳細説明を返す', () => {
      const root = new Note('C', 4);
      const chord = new Chord(root, 'major');

      expect(chord.getDescription()).toBe('C (C, E, G)');
    });

    it('正常ケース: 7thコードの詳細説明', () => {
      const root = new Note('C', 4);
      const chord = new Chord(root, 'major7');

      expect(chord.getDescription()).toBe('Cmaj7 (C, E, G, B)');
    });
  });

  describe('toString', () => {
    it('正常ケース: 正しい文字列表現を返す', () => {
      const testCases: Array<[string, number, ChordType, string]> = [
        ['C', 4, 'major', 'Chord(C)'],
        ['F#', 4, 'minor', 'Chord(F#m)'],
        ['G', 4, 'major7', 'Chord(Gmaj7)'],
        ['A', 4, 'dominant7', 'Chord(A7)'],
      ];

      testCases.forEach(([noteName, octave, chordType, expectedString]) => {
        const root = new Note(noteName as NoteName, octave as Octave);
        const chord = new Chord(root, chordType);
        expect(chord.toString()).toBe(expectedString);
      });
    });
  });

  describe('ファクトリーメソッド', () => {
    it('正常ケース: major()ファクトリーメソッド', () => {
      const root = new Note('C', 4);
      const chord = Chord.major(root);

      expect(chord.root).toEqual(root);
      expect(chord.type).toBe('major');
      expect(chord.name).toBe('C');
      expect(chord.toneNotations).toEqual(['C4', 'E4', 'G4']);
    });

    it('正常ケース: minor()ファクトリーメソッド', () => {
      const root = new Note('A', 4);
      const chord = Chord.minor(root);

      expect(chord.root).toEqual(root);
      expect(chord.type).toBe('minor');
      expect(chord.name).toBe('Am');
      expect(chord.toneNotations).toEqual(['A4', 'C5', 'E5']);
    });

    it('正常ケース: major7()ファクトリーメソッド', () => {
      const root = new Note('C', 4);
      const chord = Chord.major7(root);

      expect(chord.root).toEqual(root);
      expect(chord.type).toBe('major7');
      expect(chord.name).toBe('Cmaj7');
      expect(chord.toneNotations).toEqual(['C4', 'E4', 'G4', 'B4']);
    });

    it('正常ケース: minor7()ファクトリーメソッド', () => {
      const root = new Note('D', 4);
      const chord = Chord.minor7(root);

      expect(chord.root).toEqual(root);
      expect(chord.type).toBe('minor7');
      expect(chord.name).toBe('Dm7');
      expect(chord.toneNotations).toEqual(['D4', 'F4', 'A4', 'C5']);
    });

    it('正常ケース: dominant7()ファクトリーメソッド', () => {
      const root = new Note('G', 4);
      const chord = Chord.dominant7(root);

      expect(chord.root).toEqual(root);
      expect(chord.type).toBe('dominant7');
      expect(chord.name).toBe('G7');
      expect(chord.toneNotations).toEqual(['G4', 'B4', 'D5', 'F5']);
    });
  });

  describe('音楽理論的検証', () => {
    it('正常ケース: 基本トライアドの音程関係', () => {
      const root = new Note('C', 4);

      // メジャートライアド: ルート + 長3度 + 完全5度
      const majorChord = Chord.major(root);
      const majorNotes = majorChord.notes.map(n => n.noteName);
      expect(majorNotes).toEqual(['C', 'E', 'G']);

      // マイナートライアド: ルート + 短3度 + 完全5度
      const minorChord = Chord.minor(root);
      const minorNotes = minorChord.notes.map(n => n.noteName);
      expect(minorNotes).toEqual(['C', 'D#', 'G']);
    });

    it('正常ケース: セブンスコードの音程関係', () => {
      const root = new Note('C', 4);

      // メジャー7th: トライアド + 長7度
      const maj7Chord = Chord.major7(root);
      const maj7Notes = maj7Chord.notes.map(n => n.noteName);
      expect(maj7Notes).toEqual(['C', 'E', 'G', 'B']);

      // マイナー7th: マイナートライアド + 短7度
      const min7Chord = Chord.minor7(root);
      const min7Notes = min7Chord.notes.map(n => n.noteName);
      expect(min7Notes).toEqual(['C', 'D#', 'G', 'A#']);

      // ドミナント7th: メジャートライアド + 短7度
      const dom7Chord = Chord.dominant7(root);
      const dom7Notes = dom7Chord.notes.map(n => n.noteName);
      expect(dom7Notes).toEqual(['C', 'E', 'G', 'A#']);
    });

    it('正常ケース: 実際の楽曲で使用される和音進行', () => {
      // I-vi-IV-V進行（Cメジャーキー）
      const progression = [
        Chord.major(new Note('C', 4)), // I (C major)
        Chord.minor(new Note('A', 4)), // vi (A minor)
        Chord.major(new Note('F', 4)), // IV (F major)
        Chord.major(new Note('G', 4)), // V (G major)
      ];

      expect(progression[0].name).toBe('C');
      expect(progression[1].name).toBe('Am');
      expect(progression[2].name).toBe('F');
      expect(progression[3].name).toBe('G');
    });
  });

  describe('エラーハンドリング', () => {
    it('異常ケース: 未サポートの和音タイプでエラー', () => {
      const root = new Note('C', 4);

      expect(() => new Chord(root, 'unsupported' as ChordType)).toThrow(
        'Unsupported chord type: unsupported'
      );
    });

    it('異常ケース: 無効なルート音でエラー', () => {
      // Note自体の無効な音名は、Noteクラスでバリデーションされる
      expect(() => new Note('X' as NoteName, 4)).toThrow('Invalid note name: X');
    });

    it('異常ケース: addIntervalで無効なルート音の場合にエラーをスロー', () => {
      // Noteクラスのvalidationを回避してテスト用の無効なNoteを作成
      const invalidRoot = { noteName: 'InvalidNote', octave: 4 } as unknown as Note;

      // エラーが発生することを確認
      expect(() => new Chord(invalidRoot, 'major')).toThrow('Invalid root note: InvalidNote');
    });
  });
});
