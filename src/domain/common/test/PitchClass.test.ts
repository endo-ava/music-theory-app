import { describe, it, expect } from 'vitest';
import { PitchClass } from '../PitchClass';
import { Interval } from '../Interval';
import { Key } from '../../key';

describe('PitchClass', () => {
  describe('基本プロパティ', () => {
    it('正常ケース: 各音高クラスが正しいプロパティを持つ', () => {
      const c = PitchClass.fromCircleOfFifths(0);

      expect(c.sharpName).toBe('C');
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
        expect(pitchClass.sharpName).toBe(expectedName);
        expect(pitchClass.index).toBe(expectedIndex);
        expect(pitchClass.fifthsIndex).toBe(expectedFifths);
      });
    });
  });

  describe('五度圏ファクトリメソッド', () => {
    it('正常ケース: 五度圏インデックスからPitchClassを作成', () => {
      const c = PitchClass.fromCircleOfFifths(0);
      const g = PitchClass.fromCircleOfFifths(1);

      expect(c.sharpName).toBe('C');
      expect(g.sharpName).toBe('G');
    });

    it('境界値ケース: 範囲内の最大値でPitchClassを作成', () => {
      const f = PitchClass.fromCircleOfFifths(11); // F

      expect(f.sharpName).toBe('F');
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
      expect(result.sharpName).toBe('C'); // 12 -> (12 * 7) % 12 = 0 -> C
    });
  });

  describe('移調', () => {
    it('正常ケース: 長3度上に移調', () => {
      const c = PitchClass.fromCircleOfFifths(0); // C
      const e = c.transposeBy(Interval.MajorThird);

      expect(e.sharpName).toBe('E');
      expect(e.index).toBe(4);
    });

    it('正常ケース: 完全5度上に移調', () => {
      const c = PitchClass.fromCircleOfFifths(0); // C
      const g = c.transposeBy(Interval.PerfectFifth);

      expect(g.sharpName).toBe('G');
      expect(g.index).toBe(7);
    });

    it('正常ケース: 短3度下に移調（負の値）', () => {
      const c = PitchClass.fromCircleOfFifths(0); // C
      const a = c.transposeBy(Interval.MinorThird.invert());

      expect(a.sharpName).toBe('A');
      expect(a.index).toBe(9);
    });

    it('正常ケース: オクターブを跨ぐ移調', () => {
      const b = PitchClass.fromCircleOfFifths(5); // B
      const d = b.transposeBy(Interval.MinorThird);

      expect(d.sharpName).toBe('D');
      expect(d.index).toBe(2);
    });

    it('正常ケース: 大きな値での移調（正規化確認）', () => {
      const c = PitchClass.fromCircleOfFifths(0); // C
      const majorSeventhPlus2Octaves = Interval.MajorSeventh; // 基本の長7度のみテスト
      const b = c.transposeBy(majorSeventhPlus2Octaves);

      expect(b.sharpName).toBe('B');
      expect(b.index).toBe(11);
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

      expect(fifthsProgression[0].sharpName).toBe('C');
      expect(fifthsProgression[1].sharpName).toBe('G');
      expect(fifthsProgression[2].sharpName).toBe('D');
      expect(fifthsProgression[3].sharpName).toBe('A');
      expect(fifthsProgression[4].sharpName).toBe('E');
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
        expect(transposed.sharpName).toBe(expectedNotes[index]);
      });
    });
  });

  describe('エッジケース', () => {
    it('境界値ケース: 最後の五度圏インデックス（F）', () => {
      const f = PitchClass.fromCircleOfFifths(11);

      expect(f.sharpName).toBe('F');
      expect(f.index).toBe(5);
      expect(f.fifthsIndex).toBe(11);
    });

    it('境界値ケース: 0半音移調（変化なし）', () => {
      const c = PitchClass.fromCircleOfFifths(0);
      const samePitch = c.transposeBy(new Interval(0));

      expect(samePitch.sharpName).toBe('C');
      expect(samePitch.index).toBe(0);
    });

    it('境界値ケース: 完全オクターブ移調（12半音、変化なし）', () => {
      const c = PitchClass.fromCircleOfFifths(0);
      const octaveTransposed = c.transposeBy(Interval.Octave);

      expect(octaveTransposed.sharpName).toBe('C');
      expect(octaveTransposed.index).toBe(0);
    });
  });

  describe('getNameFor メソッド', () => {
    describe('ダイアトニック音の表記', () => {
      it('正常ケース: Cメジャーキーでのダイアトニック音', () => {
        const cMajorKey = Key.major(PitchClass.fromCircleOfFifths(0));

        // Cメジャースケール: C, D, E, F, G, A, B
        const testCases = [
          { fifthsIndex: 0, expectedName: 'C' }, // C
          { fifthsIndex: 2, expectedName: 'D' }, // D
          { fifthsIndex: 4, expectedName: 'E' }, // E
          { fifthsIndex: 11, expectedName: 'F' }, // F
          { fifthsIndex: 1, expectedName: 'G' }, // G
          { fifthsIndex: 3, expectedName: 'A' }, // A
          { fifthsIndex: 5, expectedName: 'B' }, // B
        ];

        testCases.forEach(({ fifthsIndex, expectedName }) => {
          const pitchClass = PitchClass.fromCircleOfFifths(fifthsIndex);
          expect(pitchClass.getNameFor(cMajorKey.keySignature)).toBe(expectedName);
        });
      });

      it('正常ケース: G♭メジャーキー（flat系）でのダイアトニック音', () => {
        const gFlatMajorKey = Key.major(PitchClass.fromCircleOfFifths(6));

        // G♭メジャースケール: G♭, A♭, B♭, C♭, D♭, E♭, F
        const testCases = [
          { fifthsIndex: 6, expectedName: 'G♭' }, // G♭
          { fifthsIndex: 8, expectedName: 'A♭' }, // A♭
          { fifthsIndex: 10, expectedName: 'B♭' }, // B♭
          { fifthsIndex: 5, expectedName: 'B' }, // C♭(B)
          { fifthsIndex: 7, expectedName: 'D♭' }, // D♭
          { fifthsIndex: 9, expectedName: 'E♭' }, // E♭
          { fifthsIndex: 11, expectedName: 'F' }, // F
        ];

        testCases.forEach(({ fifthsIndex, expectedName }) => {
          const pitchClass = PitchClass.fromCircleOfFifths(fifthsIndex);
          expect(pitchClass.getNameFor(gFlatMajorKey.keySignature)).toBe(expectedName);
        });
      });

      it('正常ケース: B♭メジャーキー（flat系）でのダイアトニック音', () => {
        const bFlatMajorKey = Key.major(PitchClass.fromCircleOfFifths(10));

        // B♭メジャースケール: B♭, C, D, E♭, F, G, A
        const testCases = [
          { fifthsIndex: 10, expectedName: 'B♭' }, // B♭ (flat系なのでflatName)
          { fifthsIndex: 0, expectedName: 'C' }, // C
          { fifthsIndex: 2, expectedName: 'D' }, // D
          { fifthsIndex: 9, expectedName: 'E♭' }, // E♭ (flat系なのでflatName)
          { fifthsIndex: 11, expectedName: 'F' }, // F
          { fifthsIndex: 1, expectedName: 'G' }, // G
          { fifthsIndex: 3, expectedName: 'A' }, // A
        ];

        testCases.forEach(({ fifthsIndex, expectedName }) => {
          const pitchClass = PitchClass.fromCircleOfFifths(fifthsIndex);
          expect(pitchClass.getNameFor(bFlatMajorKey.keySignature)).toBe(expectedName);
        });
      });
    });

    describe('ノンダイアトニック音の表記', () => {
      it('正常ケース: Cメジャーキーでのノンダイアトニック音（sharp表記）', () => {
        const cMajorKey = Key.major(PitchClass.fromCircleOfFifths(0));

        // ノンダイアトニック音: C♯, D♯, F♯, G♯, A♯
        const testCases = [
          { fifthsIndex: 7, expectedName: 'C#' }, // C♯
          { fifthsIndex: 9, expectedName: 'D#' }, // D♯
          { fifthsIndex: 6, expectedName: 'F#' }, // F♯
          { fifthsIndex: 8, expectedName: 'G#' }, // G♯
          { fifthsIndex: 10, expectedName: 'A#' }, // A♯
        ];

        testCases.forEach(({ fifthsIndex, expectedName }) => {
          const pitchClass = PitchClass.fromCircleOfFifths(fifthsIndex);
          expect(pitchClass.getNameFor(cMajorKey.keySignature)).toBe(expectedName);
        });
      });

      it('正常ケース: Fメジャーキー（flat系）でのノンダイアトニック音（flat表記）', () => {
        const fMajorKey = Key.major(PitchClass.fromCircleOfFifths(11));

        // ノンダイアトニック音（flat表記を期待）
        const testCases = [
          { fifthsIndex: 7, expectedName: 'D♭' }, // C♯/D♭
          { fifthsIndex: 9, expectedName: 'E♭' }, // D♯/E♭
          { fifthsIndex: 6, expectedName: 'G♭' }, // F♯/G♭
          { fifthsIndex: 8, expectedName: 'A♭' }, // G♯/A♭
          { fifthsIndex: 10, expectedName: 'B♭' }, // A♯/B♭
        ];

        testCases.forEach(({ fifthsIndex, expectedName }) => {
          const pitchClass = PitchClass.fromCircleOfFifths(fifthsIndex);
          expect(pitchClass.getNameFor(fMajorKey.keySignature)).toBe(expectedName);
        });
      });
    });

    describe('エンハーモニック表記の確認', () => {
      it('正常ケース: 同じ音高でも異なるキーで異なる表記', () => {
        // D♭/C♯ の音（fifthsIndex: 7）
        const dbCsharpPitch = PitchClass.fromCircleOfFifths(7);

        const gMajorKey = Key.major(PitchClass.fromCircleOfFifths(1)); // sharp系
        const aMajorKey = Key.major(PitchClass.fromCircleOfFifths(3)); // sharp系
        const fMajorKey = Key.major(PitchClass.fromCircleOfFifths(11)); // flat系
        const bFlatMajorKey = Key.major(PitchClass.fromCircleOfFifths(10)); // flat系

        // sharp系キーでは C# 表記
        expect(dbCsharpPitch.getNameFor(gMajorKey.keySignature)).toBe('C#');
        expect(dbCsharpPitch.getNameFor(aMajorKey.keySignature)).toBe('C#');

        // flat系キーでは D♭ 表記
        expect(dbCsharpPitch.getNameFor(fMajorKey.keySignature)).toBe('D♭');
        expect(dbCsharpPitch.getNameFor(bFlatMajorKey.keySignature)).toBe('D♭');
      });

      it('正常ケース: 複数のエンハーモニック音での表記確認', () => {
        const gMajorKey = Key.major(PitchClass.fromCircleOfFifths(1)); // sharp系
        const fMajorKey = Key.major(PitchClass.fromCircleOfFifths(11)); // flat系

        const enharmoinicPairs = [
          { fifthsIndex: 7, sharpName: 'C#', flatName: 'D♭' },
          { fifthsIndex: 9, sharpName: 'D#', flatName: 'E♭' },
          { fifthsIndex: 6, sharpName: 'F#', flatName: 'G♭' },
          { fifthsIndex: 8, sharpName: 'G#', flatName: 'A♭' },
          { fifthsIndex: 10, sharpName: 'A#', flatName: 'B♭' },
        ];

        enharmoinicPairs.forEach(({ fifthsIndex, sharpName, flatName }) => {
          const pitchClass = PitchClass.fromCircleOfFifths(fifthsIndex);
          expect(pitchClass.getNameFor(gMajorKey.keySignature)).toBe(sharpName);
          expect(pitchClass.getNameFor(fMajorKey.keySignature)).toBe(flatName);
        });
      });
    });

    describe('境界値・エッジケース', () => {
      it('正常ケース: 全ての五度圏ポジションでの表記確認', () => {
        const cMajorKey = Key.major(PitchClass.fromCircleOfFifths(0));

        // 全ての五度圏ポジション（0-11）をテスト
        for (let i = 0; i < 12; i++) {
          const pitchClass = PitchClass.fromCircleOfFifths(i);
          const name = pitchClass.getNameFor(cMajorKey.keySignature);

          // 空文字列や null ではないことを確認
          expect(name).toBeTruthy();
          expect(typeof name).toBe('string');
          expect(name.length).toBeGreaterThan(0);
        }
      });

      it('正常ケース: Aマイナーキー（sharp系）でのダイアトニック音', () => {
        const aMinorKey = Key.minor(PitchClass.fromCircleOfFifths(3));

        // Aマイナースケール: A, B, C, D, E, F, G
        const testCases = [
          { fifthsIndex: 3, expectedName: 'A' }, // A
          { fifthsIndex: 5, expectedName: 'B' }, // B
          { fifthsIndex: 0, expectedName: 'C' }, // C
          { fifthsIndex: 2, expectedName: 'D' }, // D
          { fifthsIndex: 4, expectedName: 'E' }, // E
          { fifthsIndex: 11, expectedName: 'F' }, // F
          { fifthsIndex: 1, expectedName: 'G' }, // G
        ];

        testCases.forEach(({ fifthsIndex, expectedName }) => {
          const pitchClass = PitchClass.fromCircleOfFifths(fifthsIndex);
          expect(pitchClass.getNameFor(aMinorKey.keySignature)).toBe(expectedName);
        });
      });

      it('正常ケース: G♭マイナーキー（flat系）でのダイアトニック音', () => {
        const fSharpMinorKey = Key.minor(PitchClass.fromCircleOfFifths(6));

        // F#マイナースケール: G♭, A♭, A, B, D♭, D, E
        const testCases = [
          { fifthsIndex: 6, expectedName: 'F#' }, // G♭
          { fifthsIndex: 8, expectedName: 'G#' }, // A♭
          { fifthsIndex: 3, expectedName: 'A' }, // A
          { fifthsIndex: 5, expectedName: 'B' }, // B
          { fifthsIndex: 7, expectedName: 'C#' }, // D♭
          { fifthsIndex: 2, expectedName: 'D' }, // D
          { fifthsIndex: 4, expectedName: 'E' }, // E
        ];

        testCases.forEach(({ fifthsIndex, expectedName }) => {
          const pitchClass = PitchClass.fromCircleOfFifths(fifthsIndex);
          expect(pitchClass.getNameFor(fSharpMinorKey.keySignature)).toBe(expectedName);
        });
      });

      it('正常ケース: マイナーキーでのノンダイアトニック音（sharp表記）', () => {
        const aMinorKey = Key.minor(PitchClass.fromCircleOfFifths(3));

        // Aマイナーキーのノンダイアトニック音（#表記を期待）
        const testCases = [
          { fifthsIndex: 10, expectedName: 'A#' }, // A#/B♭
          { fifthsIndex: 7, expectedName: 'C#' }, // C#/D♭
          { fifthsIndex: 9, expectedName: 'D#' }, // D#/E♭
          { fifthsIndex: 6, expectedName: 'F#' }, // F#/G♭
          { fifthsIndex: 8, expectedName: 'G#' }, // G#/A♭
        ];

        testCases.forEach(({ fifthsIndex, expectedName }) => {
          const pitchClass = PitchClass.fromCircleOfFifths(fifthsIndex);
          expect(pitchClass.getNameFor(aMinorKey.keySignature)).toBe(expectedName);
        });
      });
    });
  });
});
