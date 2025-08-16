/* eslint-disable @typescript-eslint/no-explicit-any */
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

  describe('KeyDTOファクトリメソッド', () => {
    it('正常ケース: KeyDTOからメジャーコード生成', () => {
      const keyDTO = { shortName: 'C', keyName: 'C Major', fifthsIndex: 0, isMajor: true };
      const chord = Chord.fromKeyDTO(keyDTO); // C major

      expect(chord.name).toBe('C');
      expect(chord.toneNotations).toEqual(['C4', 'E4', 'G4']);
    });

    it('正常ケース: KeyDTOからマイナーコード生成', () => {
      const keyDTO = { shortName: 'Am', keyName: 'A Minor', fifthsIndex: 3, isMajor: false }; // A minor
      const chord = Chord.fromKeyDTO(keyDTO);

      expect(chord.name).toBe('Am');
      expect(chord.toneNotations).toEqual(['A4', 'C5', 'E5']);
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

  describe('fromNotes ファクトリメソッド', () => {
    it('正常ケース: メジャートライアドの構成音から生成', () => {
      const constituentNotes = [
        new Note(PitchClass.fromCircleOfFifths(0), 4), // C4 (ルート音)
        new Note(PitchClass.fromCircleOfFifths(4), 4), // E4
        new Note(PitchClass.fromCircleOfFifths(1), 4), // G4
      ];

      const chord = Chord.fromNotes(constituentNotes);

      expect(chord.name).toBe('C');
      expect(chord.quality).toEqual(ChordQuality.MajorTriad);
      expect(chord.toneNotations).toEqual(['C4', 'E4', 'G4']);
    });

    it('正常ケース: マイナートライアドの構成音から生成', () => {
      const constituentNotes = [
        new Note(PitchClass.fromCircleOfFifths(0), 4), // C4 (ルート音)
        new Note(PitchClass.fromCircleOfFifths(9), 4), // Eb4 (D#)
        new Note(PitchClass.fromCircleOfFifths(1), 4), // G4
      ];

      const chord = Chord.fromNotes(constituentNotes);

      expect(chord.name).toBe('Cm');
      expect(chord.quality).toEqual(ChordQuality.MinorTriad);
      expect(chord.toneNotations).toEqual(['C4', 'D#4', 'G4']);
    });

    it('正常ケース: ドミナント7thコードの構成音から生成', () => {
      const constituentNotes = [
        new Note(PitchClass.fromCircleOfFifths(0), 4), // C4 (ルート音)
        new Note(PitchClass.fromCircleOfFifths(4), 4), // E4
        new Note(PitchClass.fromCircleOfFifths(1), 4), // G4
        new Note(PitchClass.fromCircleOfFifths(10), 4), // Bb4 (A#)
      ];

      const chord = Chord.fromNotes(constituentNotes);

      expect(chord.name).toBe('C7');
      expect(chord.quality).toEqual(ChordQuality.DominantSeventh);
      expect(chord.toneNotations).toEqual(['C4', 'E4', 'G4', 'A#4']);
    });

    it('正常ケース: ディミニッシュトライアドの構成音から生成', () => {
      const constituentNotes = [
        new Note(PitchClass.fromCircleOfFifths(0), 4), // C4 (ルート音)
        new Note(PitchClass.fromCircleOfFifths(9), 4), // Eb4 (D#)
        new Note(PitchClass.fromCircleOfFifths(6), 4), // F#4
      ];

      const chord = Chord.fromNotes(constituentNotes);

      expect(chord.name).toBe('Cdim');
      expect(chord.quality).toEqual(ChordQuality.DiminishedTriad);
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
      const chord2 = Chord.from(rootNote2, ChordQuality.MajorTriad);

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

  describe('ChordQuality toRomanNumeral メソッド', () => {
    it('正常ケース: メジャートライアドのローマ数字', () => {
      expect(ChordQuality.MajorTriad.toRomanNumeral(1)).toBe('I');
      expect(ChordQuality.MajorTriad.toRomanNumeral(4)).toBe('IV');
      expect(ChordQuality.MajorTriad.toRomanNumeral(5)).toBe('V');
    });

    it('正常ケース: マイナートライアドのローマ数字', () => {
      expect(ChordQuality.MinorTriad.toRomanNumeral(2)).toBe('IIm');
      expect(ChordQuality.MinorTriad.toRomanNumeral(3)).toBe('IIIm');
      expect(ChordQuality.MinorTriad.toRomanNumeral(6)).toBe('VIm');
    });

    it('正常ケース: セブンスコードのローマ数字', () => {
      expect(ChordQuality.DominantSeventh.toRomanNumeral(5)).toBe('V7');
      expect(ChordQuality.MajorSeventh.toRomanNumeral(1)).toBe('Imaj7');
      expect(ChordQuality.MinorSeventh.toRomanNumeral(2)).toBe('IIm7');
    });

    it('正常ケース: ディミニッシュトライアドのローマ数字', () => {
      expect(ChordQuality.DiminishedTriad.toRomanNumeral(7)).toBe('VII°');
    });

    it('境界値ケース: 全ての度数でメジャートライアド', () => {
      const expected = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
      for (let i = 1; i <= 7; i++) {
        expect(ChordQuality.MajorTriad.toRomanNumeral(i)).toBe(expected[i - 1]);
      }
    });

    it('境界値ケース: 全ての度数でマイナートライアド', () => {
      const expected = ['Im', 'IIm', 'IIIm', 'IVm', 'Vm', 'VIm', 'VIIm'];
      for (let i = 1; i <= 7; i++) {
        expect(ChordQuality.MinorTriad.toRomanNumeral(i)).toBe(expected[i - 1]);
      }
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

    it('正常ケース: KeyDTOを使った和音進行', () => {
      // I-vi-IV-V進行（Cメジャーキー）をKeyDTOで表現
      const keyDTOs = [
        { shortName: 'C', keyName: 'C Major', fifthsIndex: 0, isMajor: true }, // I (C major)
        { shortName: 'Am', keyName: 'A Minor', fifthsIndex: 3, isMajor: false }, // vi (A minor)
        { shortName: 'F', keyName: 'F Major', fifthsIndex: 11, isMajor: true }, // IV (F major)
        { shortName: 'G', keyName: 'G Major', fifthsIndex: 1, isMajor: true }, // V (G major)
      ];
      const progression = keyDTOs.map(keyDTO => Chord.fromKeyDTO(keyDTO));

      expect(progression[0].name).toBe('C');
      expect(progression[1].name).toBe('Am');
      expect(progression[2].name).toBe('F');
      expect(progression[3].name).toBe('G');
    });
  });
});
