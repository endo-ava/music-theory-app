/**
 * Chord エンティティのユニットテスト
 */

import { describe, expect, it } from 'vitest';
import { Chord, ChordQuality } from '..';
import { Note } from '../../common/Note';
import { PitchClass } from '../../common/PitchClass';

describe('Chord', () => {
  describe('コンストラクタ（ファクトリメソッド経由）', () => {
    it('正常ケース: メジャーコードを生成', () => {
      const rootPitch = PitchClass.fromCircleOfFifths(0); // C
      const rootNote = new Note(rootPitch, 4);
      const chord = Chord.major(rootNote);

      expect(chord.rootNote).toEqual(rootNote);
      expect(chord.quality).toEqual(ChordQuality.MajorTriad);
      expect(chord.constituentNotes.length).toBe(3); // トライアド
    });

    it('正常ケース: マイナーコードを生成', () => {
      const rootPitch = PitchClass.fromCircleOfFifths(0); // C
      const rootNote = new Note(rootPitch, 4);
      const chord = Chord.minor(rootNote);

      expect(chord.rootNote).toEqual(rootNote);
      expect(chord.quality).toEqual(ChordQuality.MinorTriad);
      expect(chord.constituentNotes.length).toBe(3); // トライアド
    });

    it('正常ケース: ドミナント7thコードを生成', () => {
      const rootPitch = PitchClass.fromCircleOfFifths(0); // C
      const rootNote = new Note(rootPitch, 4);
      const chord = Chord.dominantSeventh(rootNote);

      expect(chord.rootNote).toEqual(rootNote);
      expect(chord.quality).toEqual(ChordQuality.DominantSeventh);
      expect(chord.constituentNotes.length).toBe(4); // セブンス
    });
  });

  describe('name getter', () => {
    it('正常ケース: メジャーコードの名前', () => {
      const rootPitch = PitchClass.fromCircleOfFifths(0); // C
      const rootNote = new Note(rootPitch, 4);
      const chord = Chord.major(rootNote);

      expect(chord.name).toBe('C');
    });

    it('正常ケース: マイナーコードの名前', () => {
      const rootPitch = PitchClass.fromCircleOfFifths(0); // C
      const rootNote = new Note(rootPitch, 4);
      const chord = Chord.minor(rootNote);

      expect(chord.name).toBe('Cm');
    });

    it('正常ケース: ドミナント7thコードの名前', () => {
      const rootPitch = PitchClass.fromCircleOfFifths(0); // C
      const rootNote = new Note(rootPitch, 4);
      const chord = Chord.dominantSeventh(rootNote);

      expect(chord.name).toBe('C7');
    });

    it('正常ケース: シャープ付きルート音の和音名', () => {
      const rootPitch = PitchClass.fromCircleOfFifths(6); // F#
      const rootNote = new Note(rootPitch, 4);

      const majorChord = Chord.major(rootNote);
      const minorChord = Chord.minor(rootNote);
      const dom7Chord = Chord.dominantSeventh(rootNote);

      expect(majorChord.name).toBe('F#');
      expect(minorChord.name).toBe('F#m');
      expect(dom7Chord.name).toBe('F#7');
    });
  });

  describe('toneNotations getter', () => {
    it('正常ケース: メジャートライアドのTone.js用文字列配列', () => {
      const rootPitch = PitchClass.fromCircleOfFifths(0); // C
      const rootNote = new Note(rootPitch, 4);
      const chord = Chord.major(rootNote);

      expect(chord.toneNotations).toEqual(['C4', 'E4', 'G4']);
    });

    it('正常ケース: マイナートライアドのTone.js用文字列配列', () => {
      const rootPitch = PitchClass.fromCircleOfFifths(0); // C
      const rootNote = new Note(rootPitch, 4);
      const chord = Chord.minor(rootNote);

      expect(chord.toneNotations).toEqual(['C4', 'D#4', 'G4']);
    });

    it('正常ケース: ドミナント7thのTone.js用文字列配列', () => {
      const rootPitch = PitchClass.fromCircleOfFifths(0); // C
      const rootNote = new Note(rootPitch, 4);
      const chord = Chord.dominantSeventh(rootNote);

      expect(chord.toneNotations).toEqual(['C4', 'E4', 'G4', 'A#4']);
    });

    it('正常ケース: 異なるオクターブでの表記', () => {
      const rootPitch = PitchClass.fromCircleOfFifths(1); // G
      const rootNote = new Note(rootPitch, 3);
      const chord = Chord.minor(rootNote);

      expect(chord.toneNotations).toEqual(['G3', 'A#3', 'D4']);
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
        expect(chord.toneNotations).toEqual(expectedTones);
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
        expect(chord.toneNotations).toEqual(expectedTones);
      });
    });
  });

  describe('五度圏ファクトリメソッド', () => {
    it('正常ケース: 五度圏インデックスからメジャーコード生成', () => {
      const chord = Chord.fromCircleOfFifths(0); // C major

      expect(chord.name).toBe('C');
      expect(chord.toneNotations).toEqual(['C4', 'E4', 'G4']);
    });

    it('正常ケース: 五度圏インデックスから相対マイナーコード生成', () => {
      const chord = Chord.relativeMinorFromCircleOfFifths(0); // A minor (relative to C major)

      expect(chord.name).toBe('Am');
      expect(chord.toneNotations).toEqual(['A3', 'C4', 'E4']);
    });

    it('正常ケース: 異なる五度圏位置での相対マイナー', () => {
      const testCases: Array<[number, string, string[]]> = [
        [1, 'Em', ['E4', 'G4', 'B4']], // G major -> E minor
        [2, 'Bm', ['B3', 'D4', 'F#4']], // D major -> B minor
        [11, 'Dm', ['D4', 'F4', 'A4']], // F major -> D minor
      ];

      testCases.forEach(([circleIndex, expectedName, expectedTones]) => {
        const chord = Chord.relativeMinorFromCircleOfFifths(circleIndex);
        expect(chord.name).toBe(expectedName);
        expect(chord.toneNotations).toEqual(expectedTones);
      });
    });
  });

  describe('オクターブ処理', () => {
    it('正常ケース: オクターブを跨ぐ音程の処理', () => {
      const rootPitch = PitchClass.fromCircleOfFifths(5); // B
      const rootNote = new Note(rootPitch, 4);
      const chord = Chord.major(rootNote);

      expect(chord.toneNotations).toEqual(['B4', 'D#5', 'F#5']);
    });

    it('正常ケース: 低いオクターブでの和音', () => {
      const rootPitch = PitchClass.fromCircleOfFifths(0); // C
      const rootNote = new Note(rootPitch, 2);
      const chord = Chord.major(rootNote);

      expect(chord.toneNotations).toEqual(['C2', 'E2', 'G2']);
    });

    it('正常ケース: 高いオクターブでの和音', () => {
      const rootPitch = PitchClass.fromCircleOfFifths(1); // G
      const rootNote = new Note(rootPitch, 6);
      const chord = Chord.minor(rootNote);

      expect(chord.toneNotations).toEqual(['G6', 'A#6', 'D7']);
    });
  });

  describe('ChordQuality.from ファクトリメソッド', () => {
    it('正常ケース: MajorSeventhコード', () => {
      const rootPitch = PitchClass.fromCircleOfFifths(0); // C
      const rootNote = new Note(rootPitch, 4);
      const chord = Chord.from(rootNote, ChordQuality.MajorSeventh);

      expect(chord.name).toBe('Cmaj7');
      expect(chord.toneNotations).toEqual(['C4', 'E4', 'G4', 'B4']);
      expect(chord.constituentNotes.length).toBe(4);
    });

    it('正常ケース: MinorSeventhコード', () => {
      const rootPitch = PitchClass.fromCircleOfFifths(0); // C
      const rootNote = new Note(rootPitch, 4);
      const chord = Chord.from(rootNote, ChordQuality.MinorSeventh);

      expect(chord.name).toBe('Cm7');
      expect(chord.toneNotations).toEqual(['C4', 'D#4', 'G4', 'A#4']);
      expect(chord.constituentNotes.length).toBe(4);
    });

    it('正常ケース: DiminishedTriadコード', () => {
      const rootPitch = PitchClass.fromCircleOfFifths(0); // C
      const rootNote = new Note(rootPitch, 4);
      const chord = Chord.from(rootNote, ChordQuality.DiminishedTriad);

      expect(chord.name).toBe('Cdim');
      expect(chord.toneNotations).toEqual(['C4', 'D#4', 'F#4']);
      expect(chord.constituentNotes.length).toBe(3);
    });
  });

  describe('音楽理論的検証', () => {
    it('正常ケース: 基本トライアドの音程関係', () => {
      const rootPitch = PitchClass.fromCircleOfFifths(0); // C
      const rootNote = new Note(rootPitch, 4);

      // メジャートライアド: ルート + 長3度 + 完全5度
      const majorChord = Chord.major(rootNote);
      const majorNotes = majorChord.constituentNotes.map(n => n._pitchClass.name);
      expect(majorNotes).toEqual(['C', 'E', 'G']);

      // マイナートライアド: ルート + 短3度 + 完全5度
      const minorChord = Chord.minor(rootNote);
      const minorNotes = minorChord.constituentNotes.map(n => n._pitchClass.name);
      expect(minorNotes).toEqual(['C', 'D#', 'G']);
    });

    it('正常ケース: セブンスコードの音程関係', () => {
      const rootPitch = PitchClass.fromCircleOfFifths(0); // C
      const rootNote = new Note(rootPitch, 4);

      // メジャー7th: トライアド + 長7度
      const maj7Chord = Chord.from(rootNote, ChordQuality.MajorSeventh);
      const maj7Notes = maj7Chord.constituentNotes.map(n => n._pitchClass.name);
      expect(maj7Notes).toEqual(['C', 'E', 'G', 'B']);

      // マイナー7th: マイナートライアド + 短7度
      const min7Chord = Chord.from(rootNote, ChordQuality.MinorSeventh);
      const min7Notes = min7Chord.constituentNotes.map(n => n._pitchClass.name);
      expect(min7Notes).toEqual(['C', 'D#', 'G', 'A#']);

      // ドミナント7th: メジャートライアド + 短7度
      const dom7Chord = Chord.dominantSeventh(rootNote);
      const dom7Notes = dom7Chord.constituentNotes.map(n => n._pitchClass.name);
      expect(dom7Notes).toEqual(['C', 'E', 'G', 'A#']);
    });

    it('正常ケース: 実際の楽曲で使用される和音進行', () => {
      // I-vi-IV-V進行（Cメジャーキー）
      const progression = [
        Chord.fromCircleOfFifths(0), // I (C major)
        Chord.relativeMinorFromCircleOfFifths(0), // vi (A minor - relative to C major)
        Chord.fromCircleOfFifths(11), // IV (F major)
        Chord.fromCircleOfFifths(1), // V (G major)
      ];

      expect(progression[0].name).toBe('C');
      expect(progression[1].name).toBe('Am');
      expect(progression[2].name).toBe('F');
      expect(progression[3].name).toBe('G');
    });
  });
});
