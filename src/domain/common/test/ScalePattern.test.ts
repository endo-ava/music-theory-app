/**
 * ScalePattern値オブジェクトのユニットテスト
 * 新しいScalePattern実装（静的プロパティベース）に対応
 */

import { describe, it, expect } from 'vitest';
import { ScalePattern } from '../ScalePattern';
import { Interval } from '../Interval';

describe('ScalePattern', () => {
  describe('インスタンス生成（deriveメソッド経由）', () => {
    it('正常ケース: deriveメソッドで新しいパターンを作成', () => {
      const derived = ScalePattern.Major.derive(2, 'Test Pattern', 'test');

      expect(derived.name).toBe('Test Pattern');
      expect(derived.intervals).toBeDefined();
      expect(derived.shortSymbol).toBe('test');
    });

    it('正常ケース: インスタンスがfreeze（不変）である', () => {
      const pattern = ScalePattern.Major.derive(2, 'Test', 't');
      expect(Object.isFrozen(pattern)).toBe(true);
    });
  });

  describe('静的プロパティ', () => {
    it('正常ケース: Majorパターンが正しく定義されている', () => {
      const major = ScalePattern.Major;

      expect(major.name).toBe('Major');
      expect(major.intervals.length).toBe(7);
      expect(major).toBeInstanceOf(ScalePattern);

      // W-W-H-W-W-W-H パターン
      const expectedSemitones = [2, 2, 1, 2, 2, 2, 1];
      major.intervals.forEach((interval, index) => {
        expect(interval.semitones).toBe(expectedSemitones[index]);
      });
    });

    it('正常ケース: HarmonicMinorパターンが正しく定義されている', () => {
      const harmonicMinor = ScalePattern.HarmonicMinor;

      expect(harmonicMinor.name).toBe('Harmonic Minor');
      expect(harmonicMinor.intervals.length).toBe(7);
      expect(harmonicMinor).toBeInstanceOf(ScalePattern);

      // W-H-W-W-H-MinorThird-H パターン
      const expectedSemitones = [2, 1, 2, 2, 1, 3, 1];
      harmonicMinor.intervals.forEach((interval, index) => {
        expect(interval.semitones).toBe(expectedSemitones[index]);
      });
    });

    it('正常ケース: Dorianモードが正しく定義されている', () => {
      const dorian = ScalePattern.Dorian;

      expect(dorian.name).toBe('Dorian');
      expect(dorian.intervals.length).toBe(7);
      expect(dorian).toBeInstanceOf(ScalePattern);
    });

    it('正常ケース: Phrygianモードが正しく定義されている', () => {
      const phrygian = ScalePattern.Phrygian;

      expect(phrygian.name).toBe('Phrygian');
      expect(phrygian.intervals.length).toBe(7);
      expect(phrygian).toBeInstanceOf(ScalePattern);
    });

    it('正常ケース: Lydianモードが正しく定義されている', () => {
      const lydian = ScalePattern.Lydian;

      expect(lydian.name).toBe('Lydian');
      expect(lydian.intervals.length).toBe(7);
      expect(lydian).toBeInstanceOf(ScalePattern);
    });

    it('正常ケース: Mixolydianモードが正しく定義されている', () => {
      const mixolydian = ScalePattern.Mixolydian;

      expect(mixolydian.name).toBe('Mixolydian');
      expect(mixolydian.intervals.length).toBe(7);
      expect(mixolydian).toBeInstanceOf(ScalePattern);
    });

    it('正常ケース: Aeolianモードが正しく定義されている', () => {
      const aeolian = ScalePattern.Aeolian;

      expect(aeolian.name).toBe('Minor');
      expect(aeolian.intervals.length).toBe(7);
      expect(aeolian).toBeInstanceOf(ScalePattern);
    });

    it('正常ケース: Locrianモードが正しく定義されている', () => {
      const locrian = ScalePattern.Locrian;

      expect(locrian.name).toBe('Locrian');
      expect(locrian.intervals.length).toBe(7);
      expect(locrian).toBeInstanceOf(ScalePattern);
    });
  });

  describe('derive メソッド', () => {
    it('正常ケース: Majorパターンからモードを導出', () => {
      const major = ScalePattern.Major;
      const dorian = major.derive(2, 'Test Dorian', 'tdor');

      expect(dorian.name).toBe('Test Dorian');
      expect(dorian.shortSymbol).toBe('tdor');
      expect(dorian.intervals.length).toBe(7);
      expect(dorian).toBeInstanceOf(ScalePattern);
    });

    it('正常ケース: 各度数からの導出で期待される回転パターン', () => {
      const major = ScalePattern.Major;

      // 2度からの導出（Dorian相当）
      const dorian = major.derive(2, 'Test Dorian', 'tdor');
      const expectedDorian = [
        Interval.Whole,
        Interval.Half,
        Interval.Whole,
        Interval.Whole,
        Interval.Whole,
        Interval.Half,
        Interval.Whole,
      ];

      dorian.intervals.forEach((interval, index) => {
        expect(interval.semitones).toBe(expectedDorian[index].semitones);
      });
    });

    it('境界値ケース: 最初の度数（1度）', () => {
      const major = ScalePattern.Major;
      const derived = major.derive(1, 'Same as Major', 'same');

      // 1度から始めるので元のパターンと同じ
      expect(derived.intervals).toEqual(major.intervals);
    });

    it('境界値ケース: 最後の度数（7度）', () => {
      const major = ScalePattern.Major;
      const derived = major.derive(7, 'Locrian-like', 'loc-like');

      expect(derived.name).toBe('Locrian-like');
      expect(derived.shortSymbol).toBe('loc-like');
      expect(derived.intervals.length).toBe(7);
    });

    it('異常ケース: 無効な開始度数でエラーが発生する', () => {
      const major = ScalePattern.Major;

      expect(() => {
        major.derive(0, 'Invalid', 'inv');
      }).toThrow('開始度数がパターンの音数を超えています。');

      expect(() => {
        major.derive(8, 'Invalid', 'inv');
      }).toThrow('開始度数がパターンの音数を超えています。');

      expect(() => {
        major.derive(-1, 'Invalid', 'inv');
      }).toThrow('開始度数がパターンの音数を超えています。');
    });
  });

  describe('実用例', () => {
    it('正常ケース: 静的モードパターンがMajorから正しく導出されている', () => {
      const major = ScalePattern.Major;

      // Dorianは2度から開始
      const dorian = major.derive(2, 'Dorian', 'test-dor');
      expect(dorian.intervals).toEqual(ScalePattern.Dorian.intervals);

      // Phrygianは3度から開始
      const phrygian = major.derive(3, 'Phrygian', 'test-phr');
      expect(phrygian.intervals).toEqual(ScalePattern.Phrygian.intervals);

      // Lydianは4度から開始
      const lydian = major.derive(4, 'Lydian', 'test-lyd');
      expect(lydian.intervals).toEqual(ScalePattern.Lydian.intervals);

      // Mixolydianは5度から開始
      const mixolydian = major.derive(5, 'Mixolydian', 'test-mix');
      expect(mixolydian.intervals).toEqual(ScalePattern.Mixolydian.intervals);

      // Aeolianは6度から開始
      const aeolian = major.derive(6, 'Aeolian (Natural Minor)', 'test-m');
      expect(aeolian.intervals).toEqual(ScalePattern.Aeolian.intervals);

      // Locrianは7度から開始
      const locrian = major.derive(7, 'Locrian', 'test-loc');
      expect(locrian.intervals).toEqual(ScalePattern.Locrian.intervals);
    });

    it('正常ケース: 音楽理論的に正しい音程関係', () => {
      // Cメジャーに相当するセミトーン累積値
      const major = ScalePattern.Major;
      const cumulativeSemitones = [0];
      let current = 0;

      major.intervals.forEach(interval => {
        current += interval.semitones;
        cumulativeSemitones.push(current);
      });

      // 最後の要素（次のオクターブ）を除く
      const expectedPattern = [0, 2, 4, 5, 7, 9, 11];
      expect(cumulativeSemitones.slice(0, -1)).toEqual(expectedPattern);
    });

    it('正常ケース: HarmonicMinorの特徴的な増2度音程', () => {
      const harmonicMinor = ScalePattern.HarmonicMinor;

      // 6番目のインターバル（増2度）を確認
      const augmentedSecond = harmonicMinor.intervals[5]; // インデックス5
      expect(augmentedSecond.semitones).toBe(3); // MinorThird（増2度に相当）
    });
  });

  describe('不変性検証', () => {
    it('正常ケース: 静的プロパティのインスタンスは変更不可', () => {
      const major = ScalePattern.Major;

      expect(Object.isFrozen(major)).toBe(true);
      // intervals配列は readonly なので変更防止の仕組みに任せる
      expect(major.intervals).toBeDefined();
    });

    it('正常ケース: derive後のインスタンスも変更不可', () => {
      const major = ScalePattern.Major;
      const dorian = major.derive(2, 'Dorian', 'test-dor');

      expect(Object.isFrozen(dorian)).toBe(true);
      // intervals配列は readonly なので変更防止の仕組みに任せる
      expect(dorian.intervals).toBeDefined();
    });
  });

  describe('getIntervalsFromRootAsArray - インターバル配列取得', () => {
    describe('基本的なスケールパターンのインターバル配列', () => {
      it('正常ケース: Majorスケールのインターバル配列を取得', () => {
        const major = ScalePattern.Major;
        const intervals = major.getIntervalsFromRootAsArray();

        // Majorスケール: [0, 2, 4, 5, 7, 9, 11, 12]
        const expected = [0, 2, 4, 5, 7, 9, 11, 12];
        expect(intervals).toEqual(expected);
      });

      it('正常ケース: Aeolian（Natural Minor）スケールのインターバル配列を取得', () => {
        const aeolian = ScalePattern.Aeolian;
        const intervals = aeolian.getIntervalsFromRootAsArray();

        // Aeolianスケール: [0, 2, 3, 5, 7, 8, 10, 12]
        const expected = [0, 2, 3, 5, 7, 8, 10, 12];
        expect(intervals).toEqual(expected);
      });

      it('正常ケース: HarmonicMinorスケールのインターバル配列を取得', () => {
        const harmonicMinor = ScalePattern.HarmonicMinor;
        const intervals = harmonicMinor.getIntervalsFromRootAsArray();

        // HarmonicMinorスケール: [0, 2, 3, 5, 7, 8, 11, 12]
        const expected = [0, 2, 3, 5, 7, 8, 11, 12];
        expect(intervals).toEqual(expected);
      });
    });

    describe('モーダルスケールパターンのインターバル配列', () => {
      it('正常ケース: Dorianモードのインターバル配列を取得', () => {
        const dorian = ScalePattern.Dorian;
        const intervals = dorian.getIntervalsFromRootAsArray();

        // Dorianスケール: [0, 2, 3, 5, 7, 9, 10, 12]
        const expected = [0, 2, 3, 5, 7, 9, 10, 12];
        expect(intervals).toEqual(expected);
      });

      it('正常ケース: Phrygianモードのインターバル配列を取得', () => {
        const phrygian = ScalePattern.Phrygian;
        const intervals = phrygian.getIntervalsFromRootAsArray();

        // Phrygianスケール: [0, 1, 3, 5, 7, 8, 10, 12]
        const expected = [0, 1, 3, 5, 7, 8, 10, 12];
        expect(intervals).toEqual(expected);
      });

      it('正常ケース: Lydianモードのインターバル配列を取得', () => {
        const lydian = ScalePattern.Lydian;
        const intervals = lydian.getIntervalsFromRootAsArray();

        // Lydianスケール: [0, 2, 4, 6, 7, 9, 11, 12]
        const expected = [0, 2, 4, 6, 7, 9, 11, 12];
        expect(intervals).toEqual(expected);
      });

      it('正常ケース: Mixolydianモードのインターバル配列を取得', () => {
        const mixolydian = ScalePattern.Mixolydian;
        const intervals = mixolydian.getIntervalsFromRootAsArray();

        // Mixolydianスケール: [0, 2, 4, 5, 7, 9, 10, 12]
        const expected = [0, 2, 4, 5, 7, 9, 10, 12];
        expect(intervals).toEqual(expected);
      });

      it('正常ケース: Locrianモードのインターバル配列を取得', () => {
        const locrian = ScalePattern.Locrian;
        const intervals = locrian.getIntervalsFromRootAsArray();

        // Locrianスケール: [0, 1, 3, 5, 6, 8, 10, 12]
        const expected = [0, 1, 3, 5, 6, 8, 10, 12];
        expect(intervals).toEqual(expected);
      });
    });

    describe('配列の基本的性質の検証', () => {
      it('正常ケース: 配列の最初の要素は常に0', () => {
        const patterns = [
          ScalePattern.Major,
          ScalePattern.Aeolian,
          ScalePattern.Dorian,
          ScalePattern.HarmonicMinor,
          ScalePattern.Phrygian,
          ScalePattern.Lydian,
          ScalePattern.Mixolydian,
          ScalePattern.Locrian,
        ];

        patterns.forEach(pattern => {
          const intervals = pattern.getIntervalsFromRootAsArray();
          expect(intervals[0]).toBe(0);
        });
      });

      it('正常ケース: 配列の長さはintervals配列の長さ + 1', () => {
        const patterns = [
          ScalePattern.Major,
          ScalePattern.Aeolian,
          ScalePattern.Dorian,
          ScalePattern.HarmonicMinor,
        ];

        patterns.forEach(pattern => {
          const intervals = pattern.getIntervalsFromRootAsArray();
          expect(intervals.length).toBe(pattern.intervals.length + 1);
        });
      });

      it('正常ケース: 配列の要素は昇順に並んでいる', () => {
        const patterns = [
          ScalePattern.Major,
          ScalePattern.Aeolian,
          ScalePattern.Dorian,
          ScalePattern.HarmonicMinor,
        ];

        patterns.forEach(pattern => {
          const intervals = pattern.getIntervalsFromRootAsArray();
          for (let i = 1; i < intervals.length; i++) {
            expect(intervals[i]).toBeGreaterThan(intervals[i - 1]);
          }
        });
      });

      it('正常ケース: 配列の要素は全て0-12の範囲内', () => {
        const patterns = [
          ScalePattern.Major,
          ScalePattern.Aeolian,
          ScalePattern.Dorian,
          ScalePattern.HarmonicMinor,
        ];

        patterns.forEach(pattern => {
          const intervals = pattern.getIntervalsFromRootAsArray();
          intervals.forEach(interval => {
            expect(interval).toBeGreaterThanOrEqual(0);
            expect(interval).toBeLessThanOrEqual(12);
          });
        });
      });
    });

    describe('カスタムパターンでの動作検証', () => {
      it('正常ケース: derive後のパターンでも正しく動作', () => {
        const major = ScalePattern.Major;
        const derivedDorian = major.derive(2, 'Test Dorian', 'test-dor');
        const intervals = derivedDorian.getIntervalsFromRootAsArray();

        // DorianのインターバルとMajorから導出したものが一致することを確認
        const expectedDorian = ScalePattern.Dorian.getIntervalsFromRootAsArray();
        expect(intervals).toEqual(expectedDorian);
      });

      it('正常ケース: 異なる度数から導出したパターンも正しく動作', () => {
        const lydian = ScalePattern.Major.derive(4, 'Custom Lydian', 'clyd');
        const intervals = lydian.getIntervalsFromRootAsArray();

        // LydianのインターバルとMajorから導出したものが一致することを確認
        const expectedLydian = ScalePattern.Lydian.getIntervalsFromRootAsArray();
        expect(intervals).toEqual(expectedLydian);
      });
    });

    describe('数学的検証', () => {
      it('正常ケース: 累積インターバルの計算が正しい', () => {
        const major = ScalePattern.Major;
        const intervals = major.getIntervalsFromRootAsArray();

        // 手動で累積計算して検証
        let cumulative = 0;
        const expected = [cumulative]; // 0から開始

        major.intervals.forEach(interval => {
          cumulative += interval.semitones;
          expected.push(cumulative);
        });

        // 最後の要素（オクターブ）も含む
        expect(intervals).toEqual(expected);
      });

      it('正常ケース: HarmonicMinorの特徴的な増2度を含む配列', () => {
        const harmonicMinor = ScalePattern.HarmonicMinor;
        const intervals = harmonicMinor.getIntervalsFromRootAsArray();

        // 6度と7度の間隔が3半音（増2度）であることを確認
        const sixthInterval = intervals[5]; // 6度 (8半音)
        const seventhInterval = intervals[6]; // 7度 (11半音)
        const gap = seventhInterval - sixthInterval;

        expect(gap).toBe(3); // 増2度
        expect(sixthInterval).toBe(8);
        expect(seventhInterval).toBe(11);
      });
    });

    describe('型安全性の確認', () => {
      it('正常ケース: 返り値は数値配列', () => {
        const major = ScalePattern.Major;
        const intervals = major.getIntervalsFromRootAsArray();

        expect(Array.isArray(intervals)).toBe(true);
        intervals.forEach(interval => {
          expect(typeof interval).toBe('number');
          expect(Number.isInteger(interval)).toBe(true);
        });
      });

      it('正常ケース: 返り値は変更可能な配列（元のデータは変更されない）', () => {
        const major = ScalePattern.Major;
        const intervals1 = major.getIntervalsFromRootAsArray();
        const intervals2 = major.getIntervalsFromRootAsArray();

        // 異なるインスタンスであることを確認
        expect(intervals1).not.toBe(intervals2);
        expect(intervals1).toEqual(intervals2);

        // 配列を変更しても元のパターンに影響しないことを確認
        intervals1.push(999);
        const intervals3 = major.getIntervalsFromRootAsArray();
        expect(intervals3).toEqual(intervals2);
      });
    });
  });

  // 新規追加: derivedFromDegree プロパティのテスト
  describe('derivedFromDegree プロパティ', () => {
    it('正常ケース: Majorパターンはnull（基本パターン）', () => {
      expect(ScalePattern.Major.derivedFromDegree).toBeNull();
    });

    it('正常ケース: HarmonicMinorパターンはnull（基本パターン）', () => {
      expect(ScalePattern.HarmonicMinor.derivedFromDegree).toBeNull();
    });

    it('正常ケース: Dorianパターンは2（Majorの2度から派生）', () => {
      expect(ScalePattern.Dorian.derivedFromDegree).toBe(2);
    });

    it('正常ケース: Phrygianパターンは3（Majorの3度から派生）', () => {
      expect(ScalePattern.Phrygian.derivedFromDegree).toBe(3);
    });

    it('正常ケース: Lydianパターンは4（Majorの4度から派生）', () => {
      expect(ScalePattern.Lydian.derivedFromDegree).toBe(4);
    });

    it('正常ケース: Mixolydianパターンは5（Majorの5度から派生）', () => {
      expect(ScalePattern.Mixolydian.derivedFromDegree).toBe(5);
    });

    it('正常ケース: Aeolian（Minor）パターンは6（Majorの6度から派生）', () => {
      expect(ScalePattern.Aeolian.derivedFromDegree).toBe(6);
    });

    it('正常ケース: Locrianパターンは7（Majorの7度から派生）', () => {
      expect(ScalePattern.Locrian.derivedFromDegree).toBe(7);
    });

    it('正常ケース: deriveメソッドで作られたパターンは正しいderivedFromDegreeを持つ', () => {
      const customDorian = ScalePattern.Major.derive(2, 'Custom Dorian', 'cdor');
      expect(customDorian.derivedFromDegree).toBe(2);

      const customPhrygian = ScalePattern.Major.derive(3, 'Custom Phrygian', 'cphr');
      expect(customPhrygian.derivedFromDegree).toBe(3);
    });
  });

  // 新規追加: MAJOR_MODE_DEFINITIONS 定数のテスト
  describe('MAJOR_MODE_DEFINITIONS 定数', () => {
    it('正常ケース: 7つのモード定義が存在する', () => {
      const definitions = ScalePattern.MAJOR_MODE_DEFINITIONS;
      expect(Object.keys(definitions)).toHaveLength(7);
    });

    it('正常ケース: 各度数に対応する名前とシンボルが正しい', () => {
      const { MAJOR_MODE_DEFINITIONS } = ScalePattern;

      expect(MAJOR_MODE_DEFINITIONS[1]).toEqual({ name: 'Major', symbol: '' });
      expect(MAJOR_MODE_DEFINITIONS[2]).toEqual({ name: 'Dorian', symbol: 'dor' });
      expect(MAJOR_MODE_DEFINITIONS[3]).toEqual({ name: 'Phrygian', symbol: 'phr' });
      expect(MAJOR_MODE_DEFINITIONS[4]).toEqual({ name: 'Lydian', symbol: 'lyd' });
      expect(MAJOR_MODE_DEFINITIONS[5]).toEqual({ name: 'Mixolydian', symbol: 'mix' });
      expect(MAJOR_MODE_DEFINITIONS[6]).toEqual({ name: 'Minor', symbol: 'm' });
      expect(MAJOR_MODE_DEFINITIONS[7]).toEqual({ name: 'Locrian', symbol: 'loc' });
    });
  });

  // 新規追加: MAJOR_MODES_BY_DEGREE 配列のテスト
  describe('MAJOR_MODES_BY_DEGREE 配列', () => {
    it('正常ケース: 7つのモードが度数順に並んでいる', () => {
      const modes = ScalePattern.MAJOR_MODES_BY_DEGREE;
      expect(modes).toHaveLength(7);
    });

    it('正常ケース: 度数順の並びが正しい（Ionian→Locrian）', () => {
      const { MAJOR_MODES_BY_DEGREE } = ScalePattern;

      expect(MAJOR_MODES_BY_DEGREE[0]).toBe(ScalePattern.Major); // 1度 = Ionian
      expect(MAJOR_MODES_BY_DEGREE[1]).toBe(ScalePattern.Dorian); // 2度
      expect(MAJOR_MODES_BY_DEGREE[2]).toBe(ScalePattern.Phrygian); // 3度
      expect(MAJOR_MODES_BY_DEGREE[3]).toBe(ScalePattern.Lydian); // 4度
      expect(MAJOR_MODES_BY_DEGREE[4]).toBe(ScalePattern.Mixolydian); // 5度
      expect(MAJOR_MODES_BY_DEGREE[5]).toBe(ScalePattern.Aeolian); // 6度 = Natural Minor
      expect(MAJOR_MODES_BY_DEGREE[6]).toBe(ScalePattern.Locrian); // 7度
    });

    it('正常ケース: 各モードがMajorから正しく回転している', () => {
      const majorIntervals = ScalePattern.Major.intervals;

      ScalePattern.MAJOR_MODES_BY_DEGREE.forEach((mode, index) => {
        if (index === 0) {
          // Ionian（Major自身）
          expect(mode.intervals).toEqual(majorIntervals);
        } else {
          // 各モードはMajorを回転させたもの
          const rotatedIntervals = [
            ...majorIntervals.slice(index),
            ...majorIntervals.slice(0, index),
          ];
          expect(mode.intervals).toEqual(rotatedIntervals);
        }
      });
    });
  });

  // 新規追加: MAJOR_MODES_BY_BRIGHTNESS 配列のテスト
  describe('MAJOR_MODES_BY_BRIGHTNESS 配列', () => {
    it('正常ケース: 7つのモードが明るさ順（五度圏順）に並んでいる', () => {
      const modes = ScalePattern.MAJOR_MODES_BY_BRIGHTNESS;
      expect(modes).toHaveLength(7);
    });

    it('正常ケース: 明るさ順の並びが正しい（Lydian→Locrian）', () => {
      const { MAJOR_MODES_BY_BRIGHTNESS } = ScalePattern;

      // シャープ側（明るい）からフラット側（暗い）への順序
      expect(MAJOR_MODES_BY_BRIGHTNESS[0]).toBe(ScalePattern.Lydian); // 最も明るい（#1つ多い）
      expect(MAJOR_MODES_BY_BRIGHTNESS[1]).toBe(ScalePattern.Major); // Ionian
      expect(MAJOR_MODES_BY_BRIGHTNESS[2]).toBe(ScalePattern.Mixolydian);
      expect(MAJOR_MODES_BY_BRIGHTNESS[3]).toBe(ScalePattern.Dorian);
      expect(MAJOR_MODES_BY_BRIGHTNESS[4]).toBe(ScalePattern.Aeolian); // Natural Minor
      expect(MAJOR_MODES_BY_BRIGHTNESS[5]).toBe(ScalePattern.Phrygian);
      expect(MAJOR_MODES_BY_BRIGHTNESS[6]).toBe(ScalePattern.Locrian); // 最も暗い（♭1つ多い）
    });

    it('境界値ケース: MAJOR_MODES_BY_DEGREEとMAJOR_MODES_BY_BRIGHTNESSは同じモードを含む', () => {
      const degreeSet = new Set(ScalePattern.MAJOR_MODES_BY_DEGREE);
      const brightnessSet = new Set(ScalePattern.MAJOR_MODES_BY_BRIGHTNESS);

      // 両方とも同じ7つのモードを含む（順序は異なる）
      expect(degreeSet.size).toBe(7);
      expect(brightnessSet.size).toBe(7);

      ScalePattern.MAJOR_MODES_BY_DEGREE.forEach(mode => {
        expect(brightnessSet.has(mode)).toBe(true);
      });
    });
  });

  // 新規追加: getFifthsIndexArrayFromRoot メソッドのテスト
  describe('getFifthsIndexArrayFromRoot メソッド', () => {
    it('正常ケース: Majorスケールの五度圏インデックス配列が正しい', () => {
      const fifthsArray = ScalePattern.Major.getFifthsIndexArrayFromRoot();

      // C Major scale: C, D, E, F, G, A, B
      // 半音: [0, 2, 4, 5, 7, 9, 11]
      // 五度圏: [0, 2, 4, 11, 1, 3, 5]
      expect(fifthsArray).toEqual([0, 2, 4, 11, 1, 3, 5]);
    });

    it('正常ケース: Dorianモードの五度圏インデックス配列が正しい', () => {
      const fifthsArray = ScalePattern.Dorian.getFifthsIndexArrayFromRoot();

      // D Dorian scale: D, E, F, G, A, B, C
      // 半音（Dをルートとして）: [0, 2, 3, 5, 7, 9, 10]
      const expectedSemitones = [0, 2, 3, 5, 7, 9, 10];
      const expectedFifths = expectedSemitones.map(s => (7 * s) % 12);
      expect(fifthsArray).toEqual(expectedFifths);
    });

    it('正常ケース: Aeolian（Minor）スケールの五度圏インデックス配列', () => {
      const fifthsArray = ScalePattern.Aeolian.getFifthsIndexArrayFromRoot();

      // A Minor scale: A, B, C, D, E, F, G
      // 半音（Aをルートとして）: [0, 2, 3, 5, 7, 8, 10]
      const expectedSemitones = [0, 2, 3, 5, 7, 8, 10];
      const expectedFifths = expectedSemitones.map(s => (7 * s) % 12);
      expect(fifthsArray).toEqual(expectedFifths);
    });

    it('境界値ケース: 配列の長さが7である（オクターブ除外）', () => {
      const modes = [
        ScalePattern.Major,
        ScalePattern.Dorian,
        ScalePattern.Phrygian,
        ScalePattern.Lydian,
        ScalePattern.Mixolydian,
        ScalePattern.Aeolian,
        ScalePattern.Locrian,
      ];

      modes.forEach(mode => {
        const fifthsArray = mode.getFifthsIndexArrayFromRoot();
        expect(fifthsArray).toHaveLength(7);
      });
    });

    it('境界値ケース: オクターブ（12半音）が含まれない', () => {
      const modes = [ScalePattern.Major, ScalePattern.Dorian, ScalePattern.Aeolian];

      modes.forEach(mode => {
        const fifthsArray = mode.getFifthsIndexArrayFromRoot();

        // 五度圏インデックスは0-11の範囲
        fifthsArray.forEach(index => {
          expect(index).toBeGreaterThanOrEqual(0);
          expect(index).toBeLessThan(12);
        });

        // ルート（0）は含まれる
        expect(fifthsArray).toContain(0);
      });
    });

    it('正常ケース: 全モードで五度圏インデックスが0-11の範囲内', () => {
      const modes = ScalePattern.MAJOR_MODES_BY_DEGREE;

      modes.forEach(mode => {
        const fifthsArray = mode.getFifthsIndexArrayFromRoot();
        fifthsArray.forEach(index => {
          expect(index).toBeGreaterThanOrEqual(0);
          expect(index).toBeLessThanOrEqual(11);
        });
      });
    });
  });
});
