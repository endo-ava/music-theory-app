import { describe, it, expect } from 'vitest';
import { Scale } from '..';
import { PitchClass } from '../../common/PitchClass';
import { ScalePattern } from '../../common/ScalePattern';
import { Accidental } from '../../common/Accidental';

describe('Scale', () => {
  describe('スケール作成', () => {
    it('正常ケース: PitchClassとScalePatternからスケールを作成', () => {
      const root = PitchClass.fromCircleOfFifths(0); // C
      const pattern = ScalePattern.Major;
      const scale = new Scale(root, pattern);

      expect(scale.root.sharpName).toBe('C');
      expect(scale.pattern).toEqual(pattern);
    });

    it('正常ケース: デフォルトオクターブでスケールを作成', () => {
      const root = PitchClass.fromCircleOfFifths(0); // C
      const pattern = ScalePattern.Major;
      const scale = new Scale(root, pattern);
      const notes = scale.getNotes();

      expect(notes.length).toBe(8);
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

      const expectedNames = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C'];
      expect(notes.length).toBe(8);

      notes.forEach((note, index) => {
        expect(note._pitchClass.sharpName).toBe(expectedNames[index]);
      });
    });

    it('正常ケース: Aナチュラルマイナースケールの構成音', () => {
      const root = PitchClass.fromCircleOfFifths(3); // A
      const pattern = ScalePattern.Aeolian; // Aeolian = Natural Minor
      const scale = new Scale(root, pattern);
      const notes = scale.getNotes();

      const expectedNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'A'];
      expect(notes.length).toBe(8);

      notes.forEach((note, index) => {
        expect(note._pitchClass.sharpName).toBe(expectedNames[index]);
      });
    });

    it('正常ケース: Gメジャースケールの構成音', () => {
      const root = PitchClass.fromCircleOfFifths(1); // G
      const pattern = ScalePattern.Major;
      const scale = new Scale(root, pattern);
      const notes = scale.getNotes();

      const expectedNames = ['G', 'A', 'B', 'C', 'D', 'E', 'F#', 'G'];
      expect(notes.length).toBe(8);

      notes.forEach((note, index) => {
        expect(note._pitchClass.sharpName).toBe(expectedNames[index]);
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
        expect(note?._pitchClass.sharpName).toBe(name);
      });
    });

    it('境界値ケース: 最初の度数（1度）', () => {
      const root = PitchClass.fromCircleOfFifths(0); // C
      const pattern = ScalePattern.Major;
      const scale = new Scale(root, pattern);

      const note = scale.getNoteForDegree(1);
      expect(note?._pitchClass.sharpName).toBe('C');
    });

    it('境界値ケース: 最後の度数（7度）', () => {
      const root = PitchClass.fromCircleOfFifths(0); // C
      const pattern = ScalePattern.Major;
      const scale = new Scale(root, pattern);

      const note = scale.getNoteForDegree(7);
      expect(note?._pitchClass.sharpName).toBe('B');
    });

    it('異常ケース: 無効な度数（0）でundefinedを返す', () => {
      const root = PitchClass.fromCircleOfFifths(0); // C
      const pattern = ScalePattern.Major;
      const scale = new Scale(root, pattern);

      const note = scale.getNoteForDegree(0);
      expect(note).toBeUndefined();
    });

    it('異常ケース: 無効な度数（9）でundefinedを返す', () => {
      const root = PitchClass.fromCircleOfFifths(0); // C
      const pattern = ScalePattern.Major;
      const scale = new Scale(root, pattern);

      const note = scale.getNoteForDegree(9);
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
      expect(notes[0]._pitchClass.sharpName).toBe('C');
    });

    it('正常ケース: 高いオクターブでのスケール', () => {
      const root = PitchClass.fromCircleOfFifths(0); // C
      const pattern = ScalePattern.Major;
      const scale = new Scale(root, pattern, 6);
      const notes = scale.getNotes();

      expect(notes[0]._octave).toBe(6);
      expect(notes[0]._pitchClass.sharpName).toBe('C');
    });

    it('正常ケース: オクターブを跨ぐスケール', () => {
      const root = PitchClass.fromCircleOfFifths(5); // B
      const pattern = ScalePattern.Major;
      const scale = new Scale(root, pattern, 4);
      const notes = scale.getNotes();

      // B, C#, D#, E, F#, G#, A#
      expect(notes[0]._pitchClass.sharpName).toBe('B');
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

      const expectedNames = ['G', 'A', 'B', 'C', 'D', 'E', 'F', 'G'];
      expect(notes.length).toBe(8);

      notes.forEach((note, index) => {
        expect(note._pitchClass.sharpName).toBe(expectedNames[index]);
      });
    });

    it('正常ケース: ドリアンモードの構成音', () => {
      const root = PitchClass.fromCircleOfFifths(2); // D
      const pattern = ScalePattern.Dorian;
      const scale = new Scale(root, pattern);
      const notes = scale.getNotes();

      const expectedNames = ['D', 'E', 'F', 'G', 'A', 'B', 'C', 'D'];
      expect(notes.length).toBe(8);

      notes.forEach((note, index) => {
        expect(note._pitchClass.sharpName).toBe(expectedNames[index]);
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
          curr._pitchClass.index + curr._octave * 12 - (prev._pitchClass.index + prev._octave * 12);
        intervals.push(semitones);
      }

      // W-W-H-W-W-W-H
      const expectedIntervals = [2, 2, 1, 2, 2, 2, 1];
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
          curr._pitchClass.index + curr._octave * 12 - (prev._pitchClass.index + prev._octave * 12);
        intervals.push(semitones);
      }

      // W-H-W-W-H-W-W
      const expectedIntervals = [2, 1, 2, 2, 1, 2, 2];
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
      expect(notes.length).toBe(8);
    });

    it('境界値ケース: 高オクターブでのスケール', () => {
      const root = PitchClass.fromCircleOfFifths(0); // C
      const pattern = ScalePattern.Major;
      const scale = new Scale(root, pattern, 8);
      const notes = scale.getNotes();

      expect(notes[0]._octave).toBe(8);
      expect(notes.length).toBe(8);
    });
  });

  describe('getDegreeFromSteps - 度数分析機能', () => {
    describe('ダイアトニック音（スケール構成音）の分析', () => {
      it('正常ケース: Cメジャースケールのダイアトニック音を正しく分析', () => {
        const root = PitchClass.fromCircleOfFifths(0); // C
        const pattern = ScalePattern.Major;
        const scale = new Scale(root, pattern);

        // Cメジャースケールのインターバル: [0, 2, 4, 5, 7, 9, 11]
        const testCases = [
          { step: 0, degree: 1 }, // C (1度)
          { step: 2, degree: 2 }, // D (2度)
          { step: 4, degree: 3 }, // E (3度)
          { step: 5, degree: 4 }, // F (4度)
          { step: 7, degree: 5 }, // G (5度)
          { step: 9, degree: 6 }, // A (6度)
          { step: 11, degree: 7 }, // B (7度)
        ];

        testCases.forEach(({ step, degree }) => {
          const result = scale.getDegreeFromSteps(step);
          expect(result.isScaleDegree).toBe(true);
          expect(result.sharpNotation.degree).toBe(degree);
          expect(result.sharpNotation.accidental).toBe(Accidental.NATURAL);
          expect(result.flatNotation.degree).toBe(degree);
          expect(result.flatNotation.accidental).toBe(Accidental.NATURAL);
        });
      });

      it('正常ケース: Aナチュラルマイナースケールのダイアトニック音を正しく分析', () => {
        const root = PitchClass.fromCircleOfFifths(3); // A
        const pattern = ScalePattern.Aeolian; // Natural Minor
        const scale = new Scale(root, pattern);

        // Aナチュラルマイナーのインターバル: [0, 2, 3, 5, 7, 8, 10]
        const testCases = [
          { step: 0, degree: 1 }, // A (1度)
          { step: 2, degree: 2 }, // B (2度)
          { step: 3, degree: 3 }, // C (3度)
          { step: 5, degree: 4 }, // D (4度)
          { step: 7, degree: 5 }, // E (5度)
          { step: 8, degree: 6 }, // F (6度)
          { step: 10, degree: 7 }, // G (7度)
        ];

        testCases.forEach(({ step, degree }) => {
          const result = scale.getDegreeFromSteps(step);
          expect(result.isScaleDegree).toBe(true);
          expect(result.sharpNotation.degree).toBe(degree);
          expect(result.flatNotation.degree).toBe(degree);
        });
      });
    });

    describe('ノンダイアトニック音（変化音）の分析', () => {
      it('正常ケース: Cメジャースケールのノンダイアトニック音を正しく分析', () => {
        const root = PitchClass.fromCircleOfFifths(0); // C
        const pattern = ScalePattern.Major;
        const scale = new Scale(root, pattern);

        // ノンダイアトニック音のテストケース
        const testCases = [
          { step: 1, sharpDegree: 1, flatDegree: 2, description: 'C#/Db' }, // C# または D♭
          { step: 3, sharpDegree: 2, flatDegree: 3, description: 'D#/Eb' }, // D# または E♭
          { step: 6, sharpDegree: 4, flatDegree: 5, description: 'F#/Gb' }, // F# または G♭
          { step: 8, sharpDegree: 5, flatDegree: 6, description: 'G#/Ab' }, // G# または A♭
          { step: 10, sharpDegree: 6, flatDegree: 7, description: 'A#/Bb' }, // A# または B♭
        ];

        testCases.forEach(({ step, sharpDegree, flatDegree, description: _description }) => {
          const result = scale.getDegreeFromSteps(step);
          expect(result.isScaleDegree).toBe(false);
          expect(result.sharpNotation.degree).toBe(sharpDegree);
          expect(result.sharpNotation.accidental).toBe(Accidental.SHARP);
          expect(result.flatNotation.degree).toBe(flatDegree);
          expect(result.flatNotation.accidental).toBe(Accidental.FLAT);
        });
      });

      it('正常ケース: マイナースケールでのノンダイアトニック音分析', () => {
        const root = PitchClass.fromCircleOfFifths(3); // A
        const pattern = ScalePattern.Aeolian; // Natural Minor
        const scale = new Scale(root, pattern);

        // Aナチュラルマイナーでのノンダイアトニック音
        const testCases = [
          { step: 1, sharpDegree: 1, flatDegree: 2 }, // A# / B♭
          { step: 4, sharpDegree: 3, flatDegree: 4 }, // C# / D♭
          { step: 6, sharpDegree: 4, flatDegree: 5 }, // D# / E♭
          { step: 9, sharpDegree: 6, flatDegree: 7 }, // F# / G♭
          { step: 11, sharpDegree: 7, flatDegree: 1 }, // G# / A♭
        ];

        testCases.forEach(({ step, sharpDegree, flatDegree }) => {
          const result = scale.getDegreeFromSteps(step);
          expect(result.isScaleDegree).toBe(false);
          expect(result.sharpNotation.degree).toBe(sharpDegree);
          expect(result.sharpNotation.accidental).toBe(Accidental.SHARP);
          expect(result.flatNotation.degree).toBe(flatDegree);
          expect(result.flatNotation.accidental).toBe(Accidental.FLAT);
        });
      });
    });

    describe('境界値とエッジケース', () => {
      it('境界値ケース: step = 0（ルート音）', () => {
        const root = PitchClass.fromCircleOfFifths(0); // C
        const pattern = ScalePattern.Major;
        const scale = new Scale(root, pattern);

        const result = scale.getDegreeFromSteps(0);
        expect(result.isScaleDegree).toBe(true);
        expect(result.sharpNotation.degree).toBe(1);
        expect(result.sharpNotation.accidental).toBe(Accidental.NATURAL);
      });

      it('境界値ケース: step = 11（オクターブ下の音）', () => {
        const root = PitchClass.fromCircleOfFifths(0); // C
        const pattern = ScalePattern.Major;
        const scale = new Scale(root, pattern);

        const result = scale.getDegreeFromSteps(11);
        expect(result.isScaleDegree).toBe(true);
        expect(result.sharpNotation.degree).toBe(7); // B
        expect(result.sharpNotation.accidental).toBe(Accidental.NATURAL);
      });

      it('境界値ケース: 負の値（正規化される）', () => {
        const root = PitchClass.fromCircleOfFifths(0); // C
        const pattern = ScalePattern.Major;
        const scale = new Scale(root, pattern);

        const result = scale.getDegreeFromSteps(-1); // -1 -> 11に正規化
        expect(result.isScaleDegree).toBe(true);
        expect(result.sharpNotation.degree).toBe(7); // B
      });

      it('境界値ケース: 12以上の値（正規化される）', () => {
        const root = PitchClass.fromCircleOfFifths(0); // C
        const pattern = ScalePattern.Major;
        const scale = new Scale(root, pattern);

        const result = scale.getDegreeFromSteps(12); // 12 -> 0に正規化
        expect(result.isScaleDegree).toBe(true);
        expect(result.sharpNotation.degree).toBe(1); // C
      });

      it('境界値ケース: 大きな値での正規化', () => {
        const root = PitchClass.fromCircleOfFifths(0); // C
        const pattern = ScalePattern.Major;
        const scale = new Scale(root, pattern);

        const result = scale.getDegreeFromSteps(26); // 26 -> 2に正規化
        expect(result.isScaleDegree).toBe(true);
        expect(result.sharpNotation.degree).toBe(2); // D
      });
    });

    describe('異なるスケールパターンでの動作確認', () => {
      it('正常ケース: ドリアンモードでの度数分析', () => {
        const root = PitchClass.fromCircleOfFifths(2); // D
        const pattern = ScalePattern.Dorian;
        const scale = new Scale(root, pattern);

        // ドリアンのインターバル: [0, 2, 3, 5, 7, 9, 10]
        const diatonicSteps = [0, 2, 3, 5, 7, 9, 10];

        diatonicSteps.forEach((step, index) => {
          const result = scale.getDegreeFromSteps(step);
          expect(result.isScaleDegree).toBe(true);
          expect(result.sharpNotation.degree).toBe(index + 1);
        });

        // ノンダイアトニック音をテスト
        const nonDiatonicSteps = [1, 4, 6, 8, 11];
        nonDiatonicSteps.forEach(step => {
          const result = scale.getDegreeFromSteps(step);
          expect(result.isScaleDegree).toBe(false);
        });
      });

      it('正常ケース: ミクソリディアンモードでの度数分析', () => {
        const root = PitchClass.fromCircleOfFifths(1); // G
        const pattern = ScalePattern.Mixolydian;
        const scale = new Scale(root, pattern);

        // ミクソリディアンのインターバル: [0, 2, 4, 5, 7, 9, 10]
        const diatonicSteps = [0, 2, 4, 5, 7, 9, 10];

        diatonicSteps.forEach((step, index) => {
          const result = scale.getDegreeFromSteps(step);
          expect(result.isScaleDegree).toBe(true);
          expect(result.sharpNotation.degree).toBe(index + 1);
        });
      });
    });
  });
});
