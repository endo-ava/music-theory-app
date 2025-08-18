/**
 * Interval値オブジェクトのユニットテスト
 * 新しいInterval実装（セミトーン数ベース）に対応
 */

import { describe, it, expect } from 'vitest';
import { Interval } from '../Interval';

describe('Interval', () => {
  describe('constructor', () => {
    it('正常ケース: セミトーン数でインスタンスを作成', () => {
      const testCases = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

      testCases.forEach(semitones => {
        const interval = new Interval(semitones);
        expect(interval.semitones).toBe(semitones);
      });
    });

    it('正常ケース: 負の値も受け入れる（下行音程）', () => {
      const testCases = [-12, -7, -5, -3, -1];

      testCases.forEach(semitones => {
        const interval = new Interval(semitones);
        expect(interval.semitones).toBe(semitones);
      });
    });
  });

  describe('静的プロパティ', () => {
    it('正常ケース: 基本的な音程の定義が正しい', () => {
      const expectedIntervals = [
        { interval: Interval.MinorSecond, semitones: 1, name: 'MinorSecond' },
        { interval: Interval.MajorSecond, semitones: 2, name: 'MajorSecond' },
        { interval: Interval.MinorThird, semitones: 3, name: 'MinorThird' },
        { interval: Interval.MajorThird, semitones: 4, name: 'MajorThird' },
        { interval: Interval.PerfectFourth, semitones: 5, name: 'PerfectFourth' },
        { interval: Interval.Tritone, semitones: 6, name: 'Tritone' },
        { interval: Interval.PerfectFifth, semitones: 7, name: 'PerfectFifth' },
        { interval: Interval.MinorSixth, semitones: 8, name: 'MinorSixth' },
        { interval: Interval.MajorSixth, semitones: 9, name: 'MajorSixth' },
        { interval: Interval.MinorSeventh, semitones: 10, name: 'MinorSeventh' },
        { interval: Interval.MajorSeventh, semitones: 11, name: 'MajorSeventh' },
        { interval: Interval.Octave, semitones: 12, name: 'Octave' },
      ];

      expectedIntervals.forEach(({ interval, semitones }) => {
        expect(interval.semitones).toBe(semitones);
        expect(interval).toBeInstanceOf(Interval);
      });
    });

    it('正常ケース: 便宜上の別名も正しく定義されている', () => {
      expect(Interval.Half.semitones).toBe(1);
      expect(Interval.Whole.semitones).toBe(2);
    });
  });

  describe('invert メソッド', () => {
    it('正常ケース: 音程の方向を反転する', () => {
      const majorThird = Interval.MajorThird; // +4半音
      const invertedInterval = majorThird.invert(); // -4半音

      expect(invertedInterval.semitones).toBe(-4);
    });

    it('正常ケース: 様々な音程の反転', () => {
      const testCases = [
        { original: Interval.PerfectFifth, expected: -7 },
        { original: Interval.MinorThird, expected: -3 },
        { original: Interval.Octave, expected: -12 },
        { original: new Interval(1), expected: -1 }, // MinorSecond
      ];

      testCases.forEach(({ original, expected }) => {
        const inverted = original.invert();
        expect(inverted.semitones).toBe(expected);
      });
    });

    it('正常ケース: 二重反転で元に戻る', () => {
      const original = Interval.MajorSeventh;
      const doubleInverted = original.invert().invert();

      expect(doubleInverted.semitones).toBe(original.semitones);
    });
  });

  describe('音楽理論的特性', () => {
    it('正常ケース: トライアド構築に必要な音程', () => {
      // メジャートライアド: ルート + 長3度 + 完全5度
      const majorTriadIntervals = [Interval.MajorThird, Interval.PerfectFifth];

      expect(majorTriadIntervals[0].semitones).toBe(4);
      expect(majorTriadIntervals[1].semitones).toBe(7);
    });

    it('正常ケース: マイナートライアド構築に必要な音程', () => {
      // マイナートライアド: ルート + 短3度 + 完全5度
      const minorTriadIntervals = [Interval.MinorThird, Interval.PerfectFifth];

      expect(minorTriadIntervals[0].semitones).toBe(3);
      expect(minorTriadIntervals[1].semitones).toBe(7);
    });

    it('正常ケース: セブンスコード構築に必要な音程', () => {
      // メジャー7th: ルート + 長3度 + 完全5度 + 長7度
      const major7thIntervals = [Interval.MajorThird, Interval.PerfectFifth, Interval.MajorSeventh];

      const semitones = major7thIntervals.map(i => i.semitones);
      expect(semitones).toEqual([4, 7, 11]);
    });

    it('境界値ケース: 12音階内での音程の特殊性', () => {
      // tritone（増4度/減5度）: 12音階の中点
      expect(Interval.Tritone.semitones).toBe(6);
      expect(Interval.Tritone.semitones * 2).toBe(12); // オクターブ

      // octave: 12音階の周期
      expect(Interval.Octave.semitones).toBe(12);
    });
  });

  describe('実用例', () => {
    it('正常ケース: 様々な音程の組み合わせ', () => {
      // ドミナント7thコードの構成音程
      const dom7Intervals = [
        Interval.MajorThird, // 長3度
        Interval.PerfectFifth, // 完全5度
        Interval.MinorSeventh, // 短7度
      ];

      const semitones = dom7Intervals.map(i => i.semitones);
      expect(semitones).toEqual([4, 7, 10]);
    });

    it('正常ケース: 音程の算術演算', () => {
      // 長3度 + 短3度 = 完全5度（近似）
      const majorThird = Interval.MajorThird.semitones;
      const minorThird = Interval.MinorThird.semitones;
      const sum = majorThird + minorThird;

      expect(sum).toBe(7); // 完全5度
      expect(sum).toBe(Interval.PerfectFifth.semitones);
    });
  });

  describe('equals メソッド', () => {
    it('正常ケース: 同じ半音数のIntervalは等しい', () => {
      const interval1 = new Interval(4);
      const interval2 = new Interval(4);

      expect(interval1.equals(interval2)).toBe(true);
      expect(interval2.equals(interval1)).toBe(true);
    });

    it('正常ケース: 異なる半音数のIntervalは等しくない', () => {
      const interval1 = new Interval(3); // 短3度
      const interval2 = new Interval(4); // 長3度

      expect(interval1.equals(interval2)).toBe(false);
      expect(interval2.equals(interval1)).toBe(false);
    });

    it('正常ケース: 負の値を含む比較', () => {
      const positive = new Interval(5);
      const negative = new Interval(-5);
      const zero = new Interval(0);

      expect(positive.equals(negative)).toBe(false);
      expect(positive.equals(zero)).toBe(false);
      expect(negative.equals(zero)).toBe(false);
    });

    it('正常ケース: 静的プロパティとの比較', () => {
      const majorThird = new Interval(4);

      expect(majorThird.equals(Interval.MajorThird)).toBe(true);
      expect(majorThird.equals(Interval.MinorThird)).toBe(false);
    });
  });

  describe('静的メソッド', () => {
    describe('compare', () => {
      it('正常ケース: 半音数による比較', () => {
        const minor3rd = Interval.MinorThird; // 3半音
        const major3rd = Interval.MajorThird; // 4半音
        const perfect5th = Interval.PerfectFifth; // 7半音

        expect(Interval.compare(minor3rd, major3rd)).toBeLessThan(0);
        expect(Interval.compare(major3rd, minor3rd)).toBeGreaterThan(0);
        expect(Interval.compare(major3rd, major3rd)).toBe(0);

        expect(Interval.compare(minor3rd, perfect5th)).toBeLessThan(0);
        expect(Interval.compare(perfect5th, minor3rd)).toBeGreaterThan(0);
      });

      it('正常ケース: 負の値を含む比較', () => {
        const negative = new Interval(-3);
        const positive = new Interval(3);
        const zero = new Interval(0);

        expect(Interval.compare(negative, zero)).toBeLessThan(0);
        expect(Interval.compare(zero, positive)).toBeLessThan(0);
        expect(Interval.compare(negative, positive)).toBeLessThan(0);
      });
    });

    describe('sort', () => {
      it('正常ケース: 半音数昇順でソート', () => {
        const intervals = [
          Interval.PerfectFifth, // 7半音
          Interval.MinorThird, // 3半音
          Interval.MajorSeventh, // 11半音
          Interval.Root, // 0半音
          Interval.MajorThird, // 4半音
        ];

        const sorted = Interval.sort(intervals);

        expect(sorted.map(i => i.semitones)).toEqual([0, 3, 4, 7, 11]);
        expect(sorted[0]).toBe(Interval.Root);
        expect(sorted[1]).toBe(Interval.MinorThird);
        expect(sorted[2]).toBe(Interval.MajorThird);
        expect(sorted[3]).toBe(Interval.PerfectFifth);
        expect(sorted[4]).toBe(Interval.MajorSeventh);
      });

      it('正常ケース: 元の配列は変更されない', () => {
        const intervals = [Interval.PerfectFifth, Interval.MinorThird, Interval.MajorThird];
        const originalOrder = intervals.map(i => i.semitones);

        const sorted = Interval.sort(intervals);

        // 元の配列は変更されていない
        expect(intervals.map(i => i.semitones)).toEqual(originalOrder);
        // ソート結果は異なる
        expect(sorted.map(i => i.semitones)).toEqual([3, 4, 7]);
      });

      it('正常ケース: 負の値を含むソート', () => {
        const intervals = [
          new Interval(5),
          new Interval(-3),
          new Interval(0),
          new Interval(-7),
          new Interval(2),
        ];

        const sorted = Interval.sort(intervals);
        expect(sorted.map(i => i.semitones)).toEqual([-7, -3, 0, 2, 5]);
      });

      it('エッジケース: 空の配列', () => {
        const sorted = Interval.sort([]);
        expect(sorted).toEqual([]);
      });

      it('エッジケース: 単一要素', () => {
        const intervals = [Interval.MajorThird];
        const sorted = Interval.sort(intervals);

        expect(sorted.length).toBe(1);
        expect(sorted[0]).toBe(Interval.MajorThird);
      });

      it('正常ケース: 同じ半音数の場合は元の順序を保持', () => {
        const interval1 = new Interval(4);
        const interval2 = new Interval(4);
        const intervals = [interval1, interval2];

        const sorted = Interval.sort(intervals);

        expect(sorted[0]).toBe(interval1); // 元の順序を保持
        expect(sorted[1]).toBe(interval2);
      });
    });
  });
});
