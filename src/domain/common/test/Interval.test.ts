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
});
