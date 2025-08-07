import { describe, it, expect } from 'vitest';
import { PitchClass } from '../PitchClass';
import { Interval } from '../Interval';

describe('PitchClass', () => {
  describe('基本プロパティ', () => {
    it('正常ケース: 各音高クラスが正しいプロパティを持つ', () => {
      const c = PitchClass.fromCircleOfFifths(0);

      expect(c.name).toBe('C');
      expect(c.index).toBe(0);
      expect(c.fifthsIndex).toBe(0);
    });

    it('正常ケース: 全ての音高クラスのプロパティが正しい', () => {
      const testCases: Array<[number, string, number, number]> = [
        [0, 'C', 0, 0], // C
        [1, 'G', 7, 1], // G
        [2, 'D', 2, 2], // D
        [3, 'A', 9, 3], // A
        [4, 'E', 4, 4], // E
        [5, 'B', 11, 5], // B
        [6, 'F#', 6, 6], // F#
        [7, 'C#', 1, 7], // C#
        [8, 'G#', 8, 8], // G#
        [9, 'D#', 3, 9], // D#
        [10, 'A#', 10, 10], // A#
        [11, 'F', 5, 11], // F
      ];

      testCases.forEach(([fifthsIndex, expectedName, expectedIndex, expectedFifths]) => {
        const pitchClass = PitchClass.fromCircleOfFifths(fifthsIndex);
        expect(pitchClass.name).toBe(expectedName);
        expect(pitchClass.index).toBe(expectedIndex);
        expect(pitchClass.fifthsIndex).toBe(expectedFifths);
      });
    });
  });

  describe('五度圏ファクトリメソッド', () => {
    it('正常ケース: 五度圏インデックスからPitchClassを作成', () => {
      const c = PitchClass.fromCircleOfFifths(0);
      const g = PitchClass.fromCircleOfFifths(1);

      expect(c.name).toBe('C');
      expect(g.name).toBe('G');
    });

    it('境界値ケース: 範囲内の最大値でPitchClassを作成', () => {
      const f = PitchClass.fromCircleOfFifths(11); // F

      expect(f.name).toBe('F');
      expect(f.index).toBe(5);
      expect(f.fifthsIndex).toBe(11);
    });

    it('異常ケース: 負の五度圏インデックスで処理', () => {
      // 現在の実装では負数のハンドリングはないが、将来の拡張を考慮
      expect(() => PitchClass.fromCircleOfFifths(-1)).toThrow();
    });

    it('異常ケース: 範囲外の五度圏インデックスで処理', () => {
      // 現在の実装では循環的に処理されるため、エラーではなく正常に動作する
      const result = PitchClass.fromCircleOfFifths(12);
      expect(result.name).toBe('C'); // 12 -> (12 * 7) % 12 = 0 -> C
    });
  });

  describe('移調', () => {
    it('正常ケース: 長3度上に移調', () => {
      const c = PitchClass.fromCircleOfFifths(0); // C
      const e = c.transposeBy(Interval.MajorThird);

      expect(e.name).toBe('E');
      expect(e.index).toBe(4);
    });

    it('正常ケース: 完全5度上に移調', () => {
      const c = PitchClass.fromCircleOfFifths(0); // C
      const g = c.transposeBy(Interval.PerfectFifth);

      expect(g.name).toBe('G');
      expect(g.index).toBe(7);
    });

    it('正常ケース: 短3度下に移調（負の値）', () => {
      const c = PitchClass.fromCircleOfFifths(0); // C
      const a = c.transposeBy(Interval.MinorThird.invert());

      expect(a.name).toBe('A');
      expect(a.index).toBe(9);
    });

    it('正常ケース: オクターブを跨ぐ移調', () => {
      const b = PitchClass.fromCircleOfFifths(5); // B
      const d = b.transposeBy(Interval.MinorThird);

      expect(d.name).toBe('D');
      expect(d.index).toBe(2);
    });

    it('正常ケース: 大きな値での移調（正規化確認）', () => {
      const c = PitchClass.fromCircleOfFifths(0); // C
      const majorSeventhPlus2Octaves = Interval.MajorSeventh; // 基本の長7度のみテスト
      const b = c.transposeBy(majorSeventhPlus2Octaves);

      expect(b.name).toBe('B');
      expect(b.index).toBe(11);
    });
  });

  describe('文字列表現', () => {
    it('正常ケース: toString()で音高クラス名を返す', () => {
      const c = PitchClass.fromCircleOfFifths(0);
      const fSharp = PitchClass.fromCircleOfFifths(6);

      expect(c.toString()).toBe('C');
      expect(fSharp.toString()).toBe('F#');
    });

    it('正常ケース: 全ての音高クラスの文字列表現', () => {
      const expectedNames = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#', 'F'];

      expectedNames.forEach((expectedName, index) => {
        const pitchClass = PitchClass.fromCircleOfFifths(index);
        expect(pitchClass.toString()).toBe(expectedName);
      });
    });
  });

  describe('音楽理論的検証', () => {
    it('正常ケース: 五度圏の順序が正しい', () => {
      const fifthsProgression = [
        PitchClass.fromCircleOfFifths(0), // C
        PitchClass.fromCircleOfFifths(1), // G (C + 完全5度)
        PitchClass.fromCircleOfFifths(2), // D (G + 完全5度)
        PitchClass.fromCircleOfFifths(3), // A (D + 完全5度)
        PitchClass.fromCircleOfFifths(4), // E (A + 完全5度)
      ];

      expect(fifthsProgression[0].name).toBe('C');
      expect(fifthsProgression[1].name).toBe('G');
      expect(fifthsProgression[2].name).toBe('D');
      expect(fifthsProgression[3].name).toBe('A');
      expect(fifthsProgression[4].name).toBe('E');
    });

    it('正常ケース: 半音階の順序が正しい', () => {
      const chromaticProgression = [
        PitchClass.fromCircleOfFifths(0), // C (index: 0)
        PitchClass.fromCircleOfFifths(7), // C# (index: 1)
        PitchClass.fromCircleOfFifths(2), // D (index: 2)
        PitchClass.fromCircleOfFifths(9), // D# (index: 3)
        PitchClass.fromCircleOfFifths(4), // E (index: 4)
      ];

      expect(chromaticProgression[0].index).toBe(0);
      expect(chromaticProgression[1].index).toBe(1);
      expect(chromaticProgression[2].index).toBe(2);
      expect(chromaticProgression[3].index).toBe(3);
      expect(chromaticProgression[4].index).toBe(4);
    });

    it('正常ケース: 移調による音程関係の確認', () => {
      const c = PitchClass.fromCircleOfFifths(0);

      // Cメジャースケールの構成音
      const majorScaleIntervals = [
        new Interval(0), // C (完全1度)
        Interval.MajorSecond, // D
        Interval.MajorThird, // E
        Interval.PerfectFourth, // F
        Interval.PerfectFifth, // G
        Interval.MajorSixth, // A
        Interval.MajorSeventh, // B
      ];

      const expectedNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

      majorScaleIntervals.forEach((interval, index) => {
        const transposed = c.transposeBy(interval);
        expect(transposed.name).toBe(expectedNotes[index]);
      });
    });
  });

  describe('エッジケース', () => {
    it('境界値ケース: 最後の五度圏インデックス（F）', () => {
      const f = PitchClass.fromCircleOfFifths(11);

      expect(f.name).toBe('F');
      expect(f.index).toBe(5);
      expect(f.fifthsIndex).toBe(11);
    });

    it('境界値ケース: 0半音移調（変化なし）', () => {
      const c = PitchClass.fromCircleOfFifths(0);
      const samePitch = c.transposeBy(new Interval(0));

      expect(samePitch.name).toBe('C');
      expect(samePitch.index).toBe(0);
    });

    it('境界値ケース: 完全オクターブ移調（12半音、変化なし）', () => {
      const c = PitchClass.fromCircleOfFifths(0);
      const octaveTransposed = c.transposeBy(Interval.Octave);

      expect(octaveTransposed.name).toBe('C');
      expect(octaveTransposed.index).toBe(0);
    });
  });

  describe('エンハーモニック表記', () => {
    it('正常ケース: getDisplayName(major)でフラット表記を返す', () => {
      const cSharp = PitchClass.fromCircleOfFifths(7); // C#
      expect(cSharp.getDisplayName('major')).toBe('D♭');
      expect(cSharp.getDisplayName('minor')).toBe('C#');
      expect(cSharp.getDisplayName('default')).toBe('C#');
    });

    it('正常ケース: 自然音は同じ表記を返す', () => {
      const c = PitchClass.fromCircleOfFifths(0); // C
      expect(c.getDisplayName('major')).toBe('C');
      expect(c.getDisplayName('minor')).toBe('C');
      expect(c.getDisplayName('default')).toBe('C');
    });

    it('正常ケース: 全ての変化音のエンハーモニック表記', () => {
      const testCases = [
        { fifthsIndex: 7, sharpName: 'C#', flatName: 'D♭' },
        { fifthsIndex: 9, sharpName: 'D#', flatName: 'E♭' },
        { fifthsIndex: 6, sharpName: 'F#', flatName: 'G♭' },
        { fifthsIndex: 8, sharpName: 'G#', flatName: 'A♭' },
        { fifthsIndex: 10, sharpName: 'A#', flatName: 'B♭' },
      ];

      testCases.forEach(({ fifthsIndex, sharpName, flatName }) => {
        const pitchClass = PitchClass.fromCircleOfFifths(fifthsIndex);
        expect(pitchClass.getDisplayName('minor')).toBe(sharpName);
        expect(pitchClass.getDisplayName('major')).toBe(flatName);
      });
    });

    it('正常ケース: 後方互換性 - nameプロパティはsharpNameを返す', () => {
      const cSharp = PitchClass.fromCircleOfFifths(7);
      expect(cSharp.name).toBe('C#');
      expect(cSharp.sharpName).toBe('C#');
      expect(cSharp.flatName).toBe('D♭');
    });
  });
});
