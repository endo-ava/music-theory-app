/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Chord エンティティのユニットテスト
 */

import { describe, expect, it } from 'vitest';
import { Chord } from '..';
import { ChordPattern } from '../../common';
import { Note } from '../../common/Note';
import { PitchClass } from '../../common/PitchClass';
import { Key } from '../../key';
import { ScalePattern } from '../../common/ScalePattern';

describe('Chord', () => {
  describe('コンストラクタ（ファクトリメソッド経由）', () => {
    it('正常ケース: メジャーコードを生成', () => {
      const rootPitch = PitchClass.fromCircleOfFifths(0); // C
      const rootNote = new Note(rootPitch, 4);
      const chord = Chord.major(rootNote);

      expect(chord.rootNote).toEqual(rootNote);
      expect(chord.quality).toEqual(ChordPattern.MajorTriad);
      expect(chord.constituentNotes.length).toBe(3); // トライアド
    });

    it('正常ケース: マイナーコードを生成', () => {
      const rootPitch = PitchClass.fromCircleOfFifths(0); // C
      const rootNote = new Note(rootPitch, 4);
      const chord = Chord.minor(rootNote);

      expect(chord.rootNote).toEqual(rootNote);
      expect(chord.quality).toEqual(ChordPattern.MinorTriad);
      expect(chord.constituentNotes.length).toBe(3); // トライアド
    });

    it('正常ケース: ドミナント7thコードを生成', () => {
      const rootPitch = PitchClass.fromCircleOfFifths(0); // C
      const rootNote = new Note(rootPitch, 4);
      const chord = Chord.dominantSeventh(rootNote);

      expect(chord.rootNote).toEqual(rootNote);
      expect(chord.quality).toEqual(ChordPattern.DominantSeventh);
      expect(chord.constituentNotes.length).toBe(4); // セブンス
    });
  });

  describe('構成音生成テスト', () => {
    it('正常ケース: 各メジャートライアドの構成音', () => {
      const testCases: Array<[number, string[]]> = [
        [0, ['C4', 'E4', 'G4']], // C major
        [1, ['G4', 'B4', 'D5']], // G major
        [11, ['F4', 'A4', 'C5']], // F major
        [6, ['F#4', 'A#4', 'C#5']], // F# major
      ];

      testCases.forEach(([circleIndex, expectedTones]) => {
        const rootPitch = PitchClass.fromCircleOfFifths(circleIndex);
        const rootNote = new Note(rootPitch, 4);
        const chord = Chord.major(rootNote);
        expect(chord.getNotes().map(note => note.toString)).toEqual(expectedTones);
      });
    });

    it('正常ケース: 各マイナートライアドの構成音', () => {
      const testCases: Array<[number, string[]]> = [
        [0, ['C4', 'D#4', 'G4']], // C minor
        [1, ['G4', 'A#4', 'D5']], // G minor
        [3, ['A4', 'C5', 'E5']], // A minor
        [6, ['F#4', 'A4', 'C#5']], // F# minor
      ];

      testCases.forEach(([circleIndex, expectedTones]) => {
        const rootPitch = PitchClass.fromCircleOfFifths(circleIndex);
        const rootNote = new Note(rootPitch, 4);
        const chord = Chord.minor(rootNote);
        expect(chord.getNotes().map(note => note.toString)).toEqual(expectedTones);
      });
    });
  });

  describe('KeyDTOファクトリメソッド', () => {
    it('正常ケース: KeyDTOからメジャーコード生成', () => {
      const keyDTO = { shortName: 'C', keyName: 'C Major', fifthsIndex: 0, isMajor: true };
      const chord = Chord.fromKeyDTO(keyDTO); // C major

      expect(chord.getNameFor(new Key(PitchClass.fromCircleOfFifths(0), ScalePattern.Major))).toBe(
        'C'
      );
      expect(chord.getNotes().map(note => note.toString)).toEqual(['C4', 'E4', 'G4']);
    });

    it('正常ケース: KeyDTOからマイナーコード生成', () => {
      const keyDTO = { shortName: 'Am', keyName: 'A Minor', fifthsIndex: 3, isMajor: false }; // A minor
      const chord = Chord.fromKeyDTO(keyDTO);

      expect(
        chord.getNameFor(new Key(PitchClass.fromCircleOfFifths(3), ScalePattern.Aeolian))
      ).toBe('Am');
      expect(chord.getNotes().map(note => note.toString)).toEqual(['A4', 'C5', 'E5']);
    });
  });

  describe('オクターブ処理', () => {
    it('正常ケース: オクターブを跨ぐ音程の処理', () => {
      const rootPitch = PitchClass.fromCircleOfFifths(5); // B
      const rootNote = new Note(rootPitch, 4);
      const chord = Chord.major(rootNote);

      expect(chord.getNotes().map(note => note.toString)).toEqual(['B4', 'D#5', 'F#5']);
    });

    it('正常ケース: 低いオクターブでの和音', () => {
      const rootPitch = PitchClass.fromCircleOfFifths(0); // C
      const rootNote = new Note(rootPitch, 2);
      const chord = Chord.major(rootNote);

      expect(chord.getNotes().map(note => note.toString)).toEqual(['C2', 'E2', 'G2']);
    });

    it('正常ケース: 高いオクターブでの和音', () => {
      const rootPitch = PitchClass.fromCircleOfFifths(1); // G
      const rootNote = new Note(rootPitch, 6);
      const chord = Chord.minor(rootNote);

      expect(chord.getNotes().map(note => note.toString)).toEqual(['G6', 'A#6', 'D7']);
    });
  });

  describe('fromNotes ファクトリメソッド', () => {
    it('正常ケース: メジャートライアドの構成音から生成', () => {
      const constituentNotes = [
        new Note(PitchClass.fromCircleOfFifths(0), 4), // C4 (ルート音)
        new Note(PitchClass.fromCircleOfFifths(4), 4), // E4
        new Note(PitchClass.fromCircleOfFifths(1), 4), // G4
      ];

      const chord = Chord.fromNotes(constituentNotes);

      expect(chord.getNameFor(new Key(PitchClass.fromCircleOfFifths(0), ScalePattern.Major))).toBe(
        'C'
      );
      expect(chord.quality).toEqual(ChordPattern.MajorTriad);
      expect(chord.getNotes().map(note => note.toString)).toEqual(['C4', 'E4', 'G4']);
    });

    it('正常ケース: マイナートライアドの構成音から生成', () => {
      const constituentNotes = [
        new Note(PitchClass.fromCircleOfFifths(0), 4), // C4 (ルート音)
        new Note(PitchClass.fromCircleOfFifths(9), 4), // Eb4 (D#)
        new Note(PitchClass.fromCircleOfFifths(1), 4), // G4
      ];

      const chord = Chord.fromNotes(constituentNotes);

      expect(chord.getNameFor(new Key(PitchClass.fromCircleOfFifths(0), ScalePattern.Major))).toBe(
        'Cm'
      );
      expect(chord.quality).toEqual(ChordPattern.MinorTriad);
      expect(chord.getNotes().map(note => note.toString)).toEqual(['C4', 'D#4', 'G4']);
    });

    it('正常ケース: ドミナント7thコードの構成音から生成', () => {
      const constituentNotes = [
        new Note(PitchClass.fromCircleOfFifths(0), 4), // C4 (ルート音)
        new Note(PitchClass.fromCircleOfFifths(4), 4), // E4
        new Note(PitchClass.fromCircleOfFifths(1), 4), // G4
        new Note(PitchClass.fromCircleOfFifths(10), 4), // Bb4 (A#)
      ];

      const chord = Chord.fromNotes(constituentNotes);

      expect(chord.getNameFor(new Key(PitchClass.fromCircleOfFifths(0), ScalePattern.Major))).toBe(
        'C7'
      );
      expect(chord.quality).toEqual(ChordPattern.DominantSeventh);
      expect(chord.getNotes().map(note => note.toString)).toEqual(['C4', 'E4', 'G4', 'A#4']);
    });

    it('正常ケース: ディミニッシュトライアドの構成音から生成', () => {
      const constituentNotes = [
        new Note(PitchClass.fromCircleOfFifths(0), 4), // C4 (ルート音)
        new Note(PitchClass.fromCircleOfFifths(9), 4), // Eb4 (D#)
        new Note(PitchClass.fromCircleOfFifths(6), 4), // F#4
      ];

      const chord = Chord.fromNotes(constituentNotes);

      expect(chord.getNameFor(new Key(PitchClass.fromCircleOfFifths(0), ScalePattern.Major))).toBe(
        'Cdim'
      );
      expect(chord.quality).toEqual(ChordPattern.DiminishedTriad);
    });

    it('エラーケース: 空の構成音配列', () => {
      expect(() => {
        Chord.fromNotes([]);
      }).toThrow('構成音配列が空です');
    });

    it('エラーケース: 認識できないコード品質', () => {
      // 不明なインターバル構成 (C, D, F# など)
      const constituentNotes = [
        new Note(PitchClass.fromCircleOfFifths(0), 4), // C4 (ルート音)
        new Note(PitchClass.fromCircleOfFifths(2), 4), // D4
        new Note(PitchClass.fromCircleOfFifths(6), 4), // F#4
      ];

      expect(() => {
        Chord.fromNotes(constituentNotes);
      }).toThrow('認識可能なコード品質が見つかりません');
    });
  });

  describe('ChordPattern.from ファクトリメソッド', () => {
    it('正常ケース: MajorSeventhコード', () => {
      const rootPitch = PitchClass.fromCircleOfFifths(0); // C
      const rootNote = new Note(rootPitch, 4);
      const chord = Chord.from(rootNote, ChordPattern.MajorSeventh);

      expect(chord.getNameFor(new Key(PitchClass.fromCircleOfFifths(0), ScalePattern.Major))).toBe(
        'Cmaj7'
      );
      expect(chord.getNotes().map(note => note.toString)).toEqual(['C4', 'E4', 'G4', 'B4']);
      expect(chord.constituentNotes.length).toBe(4);
    });

    it('正常ケース: MinorSeventhコード', () => {
      const rootPitch = PitchClass.fromCircleOfFifths(0); // C
      const rootNote = new Note(rootPitch, 4);
      const chord = Chord.from(rootNote, ChordPattern.MinorSeventh);

      expect(chord.getNameFor(new Key(PitchClass.fromCircleOfFifths(0), ScalePattern.Major))).toBe(
        'Cm7'
      );
      expect(chord.getNotes().map(note => note.toString)).toEqual(['C4', 'D#4', 'G4', 'A#4']);
      expect(chord.constituentNotes.length).toBe(4);
    });

    it('正常ケース: DiminishedTriadコード', () => {
      const rootPitch = PitchClass.fromCircleOfFifths(0); // C
      const rootNote = new Note(rootPitch, 4);
      const chord = Chord.from(rootNote, ChordPattern.DiminishedTriad);

      expect(chord.getNameFor(new Key(PitchClass.fromCircleOfFifths(0), ScalePattern.Major))).toBe(
        'Cdim'
      );
      expect(chord.getNotes().map(note => note.toString)).toEqual(['C4', 'D#4', 'F#4']);
      expect(chord.constituentNotes.length).toBe(3);
    });
  });

  describe('equals メソッド', () => {
    it('正常ケース: 同じルート音と同じ品質のChordは等しい', () => {
      const rootPitch = PitchClass.fromCircleOfFifths(0); // C
      const rootNote = new Note(rootPitch, 4);
      const chord1 = Chord.major(rootNote);
      const chord2 = Chord.major(rootNote);

      expect(chord1.equals(chord2)).toBe(true);
      expect(chord2.equals(chord1)).toBe(true);
    });

    it('正常ケース: 同じChord同士は等しい', () => {
      const rootPitch = PitchClass.fromCircleOfFifths(0); // C
      const rootNote = new Note(rootPitch, 4);
      const chord = Chord.major(rootNote);

      expect(chord.equals(chord)).toBe(true);
    });

    it('正常ケース: 異なる品質のChordは等しくない', () => {
      const rootPitch = PitchClass.fromCircleOfFifths(0); // C
      const rootNote = new Note(rootPitch, 4);
      const majorChord = Chord.major(rootNote);
      const minorChord = Chord.minor(rootNote);

      expect(majorChord.equals(minorChord)).toBe(false);
      expect(minorChord.equals(majorChord)).toBe(false);
    });

    it('正常ケース: 異なるルート音のChordは等しくない', () => {
      const cPitch = PitchClass.fromCircleOfFifths(0); // C
      const dPitch = PitchClass.fromCircleOfFifths(2); // D
      const cNote = new Note(cPitch, 4);
      const dNote = new Note(dPitch, 4);
      const cMajor = Chord.major(cNote);
      const dMajor = Chord.major(dNote);

      expect(cMajor.equals(dMajor)).toBe(false);
      expect(dMajor.equals(cMajor)).toBe(false);
    });

    it('正常ケース: 異なるオクターブでも同じピッチクラスと品質なら等しい', () => {
      const rootPitch = PitchClass.fromCircleOfFifths(0); // C
      const c4 = new Note(rootPitch, 4);
      const c5 = new Note(rootPitch, 5);
      const chord1 = Chord.major(c4);
      const chord2 = Chord.major(c5);

      expect(chord1.equals(chord2)).toBe(true);
      expect(chord2.equals(chord1)).toBe(true);
    });

    it('エッジケース: null、undefined、非Chordオブジェクトとの比較', () => {
      const rootPitch = PitchClass.fromCircleOfFifths(0); // C
      const rootNote = new Note(rootPitch, 4);
      const chord = Chord.major(rootNote);

      expect(chord.equals(null as any)).toBe(false);
      expect(chord.equals(undefined as any)).toBe(false);
      expect(chord.equals({} as any)).toBe(false);
      expect(chord.equals('C' as any)).toBe(false);
    });

    it('正常ケース: 異なる生成方法で作られた同じChordは等しい', () => {
      const rootPitch = PitchClass.fromCircleOfFifths(0); // C
      const rootNote1 = new Note(rootPitch, 4);
      const rootNote2 = new Note(rootPitch, 4);
      const chord1 = Chord.major(rootNote1);
      const chord2 = Chord.from(rootNote2, ChordPattern.MajorTriad);

      expect(chord1.equals(chord2)).toBe(true);
    });

    it('正常ケース: fromNotesで生成したChordとの比較', () => {
      const rootPitch = PitchClass.fromCircleOfFifths(0); // C
      const rootNote = new Note(rootPitch, 4);
      const standardChord = Chord.major(rootNote);

      const constituentNotes = [
        new Note(PitchClass.fromCircleOfFifths(0), 4), // C4
        new Note(PitchClass.fromCircleOfFifths(4), 4), // E4
        new Note(PitchClass.fromCircleOfFifths(1), 4), // G4
      ];
      const fromNotesChord = Chord.fromNotes(constituentNotes);

      expect(standardChord.equals(fromNotesChord)).toBe(true);
    });
  });

  describe('音楽理論的検証', () => {
    it('正常ケース: 基本トライアドの音程関係', () => {
      const rootPitch = PitchClass.fromCircleOfFifths(0); // C
      const rootNote = new Note(rootPitch, 4);

      // メジャートライアド: ルート + 長3度 + 完全5度
      const majorChord = Chord.major(rootNote);
      const majorNotes = majorChord.constituentNotes.map(n => n._pitchClass.sharpName);
      expect(majorNotes).toEqual(['C', 'E', 'G']);

      // マイナートライアド: ルート + 短3度 + 完全5度
      const minorChord = Chord.minor(rootNote);
      const minorNotes = minorChord.constituentNotes.map(n => n._pitchClass.sharpName);
      expect(minorNotes).toEqual(['C', 'D#', 'G']);
    });

    it('正常ケース: セブンスコードの音程関係', () => {
      const rootPitch = PitchClass.fromCircleOfFifths(0); // C
      const rootNote = new Note(rootPitch, 4);

      // メジャー7th: トライアド + 長7度
      const maj7Chord = Chord.from(rootNote, ChordPattern.MajorSeventh);
      const maj7Notes = maj7Chord.constituentNotes.map(n => n._pitchClass.sharpName);
      expect(maj7Notes).toEqual(['C', 'E', 'G', 'B']);

      // マイナー7th: マイナートライアド + 短7度
      const min7Chord = Chord.from(rootNote, ChordPattern.MinorSeventh);
      const min7Notes = min7Chord.constituentNotes.map(n => n._pitchClass.sharpName);
      expect(min7Notes).toEqual(['C', 'D#', 'G', 'A#']);

      // ドミナント7th: メジャートライアド + 短7度
      const dom7Chord = Chord.dominantSeventh(rootNote);
      const dom7Notes = dom7Chord.constituentNotes.map(n => n._pitchClass.sharpName);
      expect(dom7Notes).toEqual(['C', 'E', 'G', 'A#']);
    });

    it('正常ケース: KeyDTOを使った和音進行', () => {
      // I-vi-IV-V進行（Cメジャーキー）をKeyDTOで表現
      const keyDTOs = [
        { shortName: 'C', keyName: 'C Major', fifthsIndex: 0, isMajor: true }, // I (C major)
        { shortName: 'Am', keyName: 'A Minor', fifthsIndex: 3, isMajor: false }, // vi (A minor)
        { shortName: 'F', keyName: 'F Major', fifthsIndex: 11, isMajor: true }, // IV (F major)
        { shortName: 'G', keyName: 'G Major', fifthsIndex: 1, isMajor: true }, // V (G major)
      ];
      const progression = keyDTOs.map(keyDTO => Chord.fromKeyDTO(keyDTO));

      expect(
        progression[0].getNameFor(new Key(PitchClass.fromCircleOfFifths(0), ScalePattern.Major))
      ).toBe('C');
      expect(
        progression[1].getNameFor(new Key(PitchClass.fromCircleOfFifths(3), ScalePattern.Aeolian))
      ).toBe('Am');
      expect(
        progression[2].getNameFor(new Key(PitchClass.fromCircleOfFifths(11), ScalePattern.Major))
      ).toBe('F');
      expect(
        progression[3].getNameFor(new Key(PitchClass.fromCircleOfFifths(1), ScalePattern.Major))
      ).toBe('G');
    });
  });
});
