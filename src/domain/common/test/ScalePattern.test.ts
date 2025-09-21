/**
 * ScalePattern値オブジェクトのユニットテスト
 * 新しいScalePattern実装（静的プロパティベース）に対応
 */

import { describe, it, expect } from 'vitest';
import { ScalePattern } from '../ScalePattern';
import { Interval } from '../Interval';

describe('ScalePattern', () => {
  describe('constructor', () => {
    it('正常ケース: 名前とインターバル配列とshortSymbolでインスタンスを作成', () => {
      const intervals = [Interval.Whole, Interval.Whole, Interval.Half];
      const pattern = new ScalePattern('Test Pattern', intervals, 'test');

      expect(pattern.name).toBe('Test Pattern');
      expect(pattern.intervals).toEqual(intervals);
      expect(pattern.shortSymbol).toBe('test');
    });

    it('正常ケース: インスタンスがfreeze（不変）である', () => {
      const pattern = new ScalePattern('Test', [Interval.Whole], 't');
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
});
