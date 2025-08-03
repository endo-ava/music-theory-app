import { describe, it, expect } from 'vitest';
import { Scale } from '..';
import { PitchClass } from '../../common/PitchClass';
import { ScalePattern } from '../../common/ScalePattern';

describe('Scale', () => {
  describe('スケール作成', () => {
    it('正常ケース: PitchClassとScalePatternからスケールを作成', () => {
      const root = PitchClass.fromCircleOfFifths(0); // C
      const pattern = ScalePattern.Major;
      const scale = new Scale(root, pattern);

      expect(scale.root.name).toBe('C');
      expect(scale.pattern).toEqual(pattern);
    });

    it('正常ケース: デフォルトオクターブでスケールを作成', () => {
      const root = PitchClass.fromCircleOfFifths(0); // C
      const pattern = ScalePattern.Major;
      const scale = new Scale(root, pattern);
      const notes = scale.getNotes();

      expect(notes.length).toBe(7);
      expect(notes[0]._octave).toBe(4); // デフォルトオクターブ
    });

    it('正常ケース: 指定オクターブでスケールを作成', () => {
      const root = PitchClass.fromCircleOfFifths(0); // C
      const pattern = ScalePattern.Major;
      const scale = new Scale(root, pattern, 5);
      const notes = scale.getNotes();

      expect(notes[0]._octave).toBe(5); // 指定オクターブ
    });
  });

  describe('構成音取得', () => {
    it('正常ケース: Cメジャースケールの構成音', () => {
      const root = PitchClass.fromCircleOfFifths(0); // C
      const pattern = ScalePattern.Major;
      const scale = new Scale(root, pattern);
      const notes = scale.getNotes();

      const expectedNames = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
      expect(notes.length).toBe(7);

      notes.forEach((note, index) => {
        expect(note._pitchClass.name).toBe(expectedNames[index]);
      });
    });

    it('正常ケース: Aナチュラルマイナースケールの構成音', () => {
      const root = PitchClass.fromCircleOfFifths(3); // A
      const pattern = ScalePattern.Aeolian; // Aeolian = Natural Minor
      const scale = new Scale(root, pattern);
      const notes = scale.getNotes();

      const expectedNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
      expect(notes.length).toBe(7);

      notes.forEach((note, index) => {
        expect(note._pitchClass.name).toBe(expectedNames[index]);
      });
    });

    it('正常ケース: Gメジャースケールの構成音', () => {
      const root = PitchClass.fromCircleOfFifths(1); // G
      const pattern = ScalePattern.Major;
      const scale = new Scale(root, pattern);
      const notes = scale.getNotes();

      const expectedNames = ['G', 'A', 'B', 'C', 'D', 'E', 'F#'];
      expect(notes.length).toBe(7);

      notes.forEach((note, index) => {
        expect(note._pitchClass.name).toBe(expectedNames[index]);
      });
    });
  });

  describe('度数指定音取得', () => {
    it('正常ケース: 各度数の音を正しく取得', () => {
      const root = PitchClass.fromCircleOfFifths(0); // C
      const pattern = ScalePattern.Major;
      const scale = new Scale(root, pattern);

      const expectedNotes = [
        { degree: 1, name: 'C' },
        { degree: 2, name: 'D' },
        { degree: 3, name: 'E' },
        { degree: 4, name: 'F' },
        { degree: 5, name: 'G' },
        { degree: 6, name: 'A' },
        { degree: 7, name: 'B' },
      ];

      expectedNotes.forEach(({ degree, name }) => {
        const note = scale.getNoteForDegree(degree);
        expect(note?._pitchClass.name).toBe(name);
      });
    });

    it('境界値ケース: 最初の度数（1度）', () => {
      const root = PitchClass.fromCircleOfFifths(0); // C
      const pattern = ScalePattern.Major;
      const scale = new Scale(root, pattern);

      const note = scale.getNoteForDegree(1);
      expect(note?._pitchClass.name).toBe('C');
    });

    it('境界値ケース: 最後の度数（7度）', () => {
      const root = PitchClass.fromCircleOfFifths(0); // C
      const pattern = ScalePattern.Major;
      const scale = new Scale(root, pattern);

      const note = scale.getNoteForDegree(7);
      expect(note?._pitchClass.name).toBe('B');
    });

    it('異常ケース: 無効な度数（0）でundefinedを返す', () => {
      const root = PitchClass.fromCircleOfFifths(0); // C
      const pattern = ScalePattern.Major;
      const scale = new Scale(root, pattern);

      const note = scale.getNoteForDegree(0);
      expect(note).toBeUndefined();
    });

    it('異常ケース: 無効な度数（8）でundefinedを返す', () => {
      const root = PitchClass.fromCircleOfFifths(0); // C
      const pattern = ScalePattern.Major;
      const scale = new Scale(root, pattern);

      const note = scale.getNoteForDegree(8);
      expect(note).toBeUndefined();
    });

    it('異常ケース: 負の度数でundefinedを返す', () => {
      const root = PitchClass.fromCircleOfFifths(0); // C
      const pattern = ScalePattern.Major;
      const scale = new Scale(root, pattern);

      const note = scale.getNoteForDegree(-1);
      expect(note).toBeUndefined();
    });
  });

  describe('オクターブ処理', () => {
    it('正常ケース: 低いオクターブでのスケール', () => {
      const root = PitchClass.fromCircleOfFifths(0); // C
      const pattern = ScalePattern.Major;
      const scale = new Scale(root, pattern, 2);
      const notes = scale.getNotes();

      expect(notes[0]._octave).toBe(2);
      expect(notes[0]._pitchClass.name).toBe('C');
    });

    it('正常ケース: 高いオクターブでのスケール', () => {
      const root = PitchClass.fromCircleOfFifths(0); // C
      const pattern = ScalePattern.Major;
      const scale = new Scale(root, pattern, 6);
      const notes = scale.getNotes();

      expect(notes[0]._octave).toBe(6);
      expect(notes[0]._pitchClass.name).toBe('C');
    });

    it('正常ケース: オクターブを跨ぐスケール', () => {
      const root = PitchClass.fromCircleOfFifths(5); // B
      const pattern = ScalePattern.Major;
      const scale = new Scale(root, pattern, 4);
      const notes = scale.getNotes();

      // B, C#, D#, E, F#, G#, A#
      expect(notes[0]._pitchClass.name).toBe('B');
      expect(notes[0]._octave).toBe(4);

      // 上位の音は次のオクターブに進む
      const lastNote = notes[notes.length - 1];
      expect(lastNote._octave).toBeGreaterThanOrEqual(4);
    });
  });

  describe('異なるスケールパターン', () => {
    it('正常ケース: ミクソリディアンモードの構成音', () => {
      const root = PitchClass.fromCircleOfFifths(1); // G
      const pattern = ScalePattern.Mixolydian;
      const scale = new Scale(root, pattern);
      const notes = scale.getNotes();

      const expectedNames = ['G', 'A', 'B', 'C', 'D', 'E', 'F'];
      expect(notes.length).toBe(7);

      notes.forEach((note, index) => {
        expect(note._pitchClass.name).toBe(expectedNames[index]);
      });
    });

    it('正常ケース: ドリアンモードの構成音', () => {
      const root = PitchClass.fromCircleOfFifths(2); // D
      const pattern = ScalePattern.Dorian;
      const scale = new Scale(root, pattern);
      const notes = scale.getNotes();

      const expectedNames = ['D', 'E', 'F', 'G', 'A', 'B', 'C'];
      expect(notes.length).toBe(7);

      notes.forEach((note, index) => {
        expect(note._pitchClass.name).toBe(expectedNames[index]);
      });
    });
  });

  describe('音楽理論的検証', () => {
    it('正常ケース: メジャースケールの音程関係', () => {
      const root = PitchClass.fromCircleOfFifths(0); // C
      const pattern = ScalePattern.Major;
      const scale = new Scale(root, pattern);
      const notes = scale.getNotes();

      // メジャースケールのインターバル: 全全半全全全半
      const intervals = [];
      for (let i = 1; i < notes.length; i++) {
        const prev = notes[i - 1];
        const curr = notes[i];
        const semitones =
          curr._pitchClass.chromaticIndex +
          curr._octave * 12 -
          (prev._pitchClass.chromaticIndex + prev._octave * 12);
        intervals.push(semitones);
      }

      // W-W-H-W-W-W-H (2-2-1-2-2-2) - 最後のインターバルは次のオクターブなので含まない
      const expectedIntervals = [2, 2, 1, 2, 2, 2];
      expect(intervals).toEqual(expectedIntervals);
    });

    it('正常ケース: ナチュラルマイナーの音程関係', () => {
      const root = PitchClass.fromCircleOfFifths(3); // A
      const pattern = ScalePattern.Aeolian; // Aeolian = Natural Minor
      const scale = new Scale(root, pattern);
      const notes = scale.getNotes();

      const intervals = [];
      for (let i = 1; i < notes.length; i++) {
        const prev = notes[i - 1];
        const curr = notes[i];
        const semitones =
          curr._pitchClass.chromaticIndex +
          curr._octave * 12 -
          (prev._pitchClass.chromaticIndex + prev._octave * 12);
        intervals.push(semitones);
      }

      // W-H-W-W-H-W-W (2-1-2-2-1-2) - 最後のインターバルは次のオクターブなので含まない
      const expectedIntervals = [2, 1, 2, 2, 1, 2];
      expect(intervals).toEqual(expectedIntervals);
    });
  });

  describe('エッジケース', () => {
    it('境界値ケース: 最低オクターブでのスケール', () => {
      const root = PitchClass.fromCircleOfFifths(0); // C
      const pattern = ScalePattern.Major;
      const scale = new Scale(root, pattern, 0);
      const notes = scale.getNotes();

      expect(notes[0]._octave).toBe(0);
      expect(notes.length).toBe(7);
    });

    it('境界値ケース: 高オクターブでのスケール', () => {
      const root = PitchClass.fromCircleOfFifths(0); // C
      const pattern = ScalePattern.Major;
      const scale = new Scale(root, pattern, 8);
      const notes = scale.getNotes();

      expect(notes[0]._octave).toBe(8);
      expect(notes.length).toBe(7);
    });
  });
});
