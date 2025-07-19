/**
 * Interval値オブジェクトのユニットテスト
 */

import { describe, it, expect } from 'vitest';
import { Interval, type IntervalType, type Semitones } from '../Interval';

describe('Interval', () => {
  describe('constructor', () => {
    it('正常ケース: 有効なIntervalTypeでインスタンスを作成', () => {
      const validTypes: IntervalType[] = [
        'unison',
        'minor2nd',
        'major2nd',
        'minor3rd',
        'major3rd',
        'perfect4th',
        'tritone',
        'perfect5th',
        'minor6th',
        'major6th',
        'minor7th',
        'major7th',
        'octave',
      ];

      validTypes.forEach(type => {
        const interval = new Interval(type);
        expect(interval.type).toBe(type);
      });
    });

    it('異常ケース: 無効なIntervalTypeでエラーをスロー', () => {
      const invalidTypes = ['invalid', 'perfect9th', 'minor4th', ''];

      invalidTypes.forEach(type => {
        expect(() => new Interval(type as IntervalType)).toThrow(`Invalid interval type: ${type}`);
      });
    });
  });

  describe('semitones getter', () => {
    it('正常ケース: 各音程タイプが正しいセミトーン数を返す', () => {
      const expectedMapping: Array<[IntervalType, Semitones]> = [
        ['unison', 0],
        ['minor2nd', 1],
        ['major2nd', 2],
        ['minor3rd', 3],
        ['major3rd', 4],
        ['perfect4th', 5],
        ['tritone', 6],
        ['perfect5th', 7],
        ['minor6th', 8],
        ['major6th', 9],
        ['minor7th', 10],
        ['major7th', 11],
        ['octave', 12],
      ];

      expectedMapping.forEach(([intervalType, expectedSemitones]) => {
        const interval = new Interval(intervalType);
        expect(interval.semitones).toBe(expectedSemitones);
      });
    });
  });

  describe('getDisplayName', () => {
    it('正常ケース: 各音程タイプが正しい日本語表示名を返す', () => {
      const expectedMapping: Array<[IntervalType, string]> = [
        ['unison', '1度'],
        ['minor2nd', '短2度'],
        ['major2nd', '長2度'],
        ['minor3rd', '短3度'],
        ['major3rd', '長3度'],
        ['perfect4th', '完全4度'],
        ['tritone', '増4度'],
        ['perfect5th', '完全5度'],
        ['minor6th', '短6度'],
        ['major6th', '長6度'],
        ['minor7th', '短7度'],
        ['major7th', '長7度'],
        ['octave', 'オクターブ'],
      ];

      expectedMapping.forEach(([intervalType, expectedDisplayName]) => {
        const interval = new Interval(intervalType);
        expect(interval.getDisplayName()).toBe(expectedDisplayName);
      });
    });
  });

  describe('equals', () => {
    it('正常ケース: 同じ音程タイプでtrueを返す', () => {
      const interval1 = new Interval('major3rd');
      const interval2 = new Interval('major3rd');

      expect(interval1.equals(interval2)).toBe(true);
    });

    it('正常ケース: 異なる音程タイプでfalseを返す', () => {
      const interval1 = new Interval('major3rd');
      const interval2 = new Interval('minor3rd');

      expect(interval1.equals(interval2)).toBe(false);
    });

    it('正常ケース: 同じセミトーン数でも異なる音程タイプはfalse', () => {
      // tritone(6)とminor6th(8)は異なる音程
      const tritone = new Interval('tritone');
      const minor6th = new Interval('minor6th');

      expect(tritone.equals(minor6th)).toBe(false);
    });
  });

  describe('toString', () => {
    it('正常ケース: 日本語表示名とセミトーン数を含む文字列を返す', () => {
      const testCases: Array<[IntervalType, string]> = [
        ['unison', '1度 (0半音)'],
        ['minor3rd', '短3度 (3半音)'],
        ['major3rd', '長3度 (4半音)'],
        ['perfect5th', '完全5度 (7半音)'],
        ['octave', 'オクターブ (12半音)'],
      ];

      testCases.forEach(([intervalType, expectedString]) => {
        const interval = new Interval(intervalType);
        expect(interval.toString()).toBe(expectedString);
      });
    });
  });

  describe('ファクトリーメソッド', () => {
    it('正常ケース: unison()が1度を作成', () => {
      const interval = Interval.unison();

      expect(interval.type).toBe('unison');
      expect(interval.semitones).toBe(0);
      expect(interval.getDisplayName()).toBe('1度');
    });

    it('正常ケース: majorThird()が長3度を作成', () => {
      const interval = Interval.majorThird();

      expect(interval.type).toBe('major3rd');
      expect(interval.semitones).toBe(4);
      expect(interval.getDisplayName()).toBe('長3度');
    });

    it('正常ケース: minorThird()が短3度を作成', () => {
      const interval = Interval.minorThird();

      expect(interval.type).toBe('minor3rd');
      expect(interval.semitones).toBe(3);
      expect(interval.getDisplayName()).toBe('短3度');
    });

    it('正常ケース: perfectFifth()が完全5度を作成', () => {
      const interval = Interval.perfectFifth();

      expect(interval.type).toBe('perfect5th');
      expect(interval.semitones).toBe(7);
      expect(interval.getDisplayName()).toBe('完全5度');
    });

    it('正常ケース: minorSeventh()が短7度を作成', () => {
      const interval = Interval.minorSeventh();

      expect(interval.type).toBe('minor7th');
      expect(interval.semitones).toBe(10);
      expect(interval.getDisplayName()).toBe('短7度');
    });

    it('正常ケース: majorSeventh()が長7度を作成', () => {
      const interval = Interval.majorSeventh();

      expect(interval.type).toBe('major7th');
      expect(interval.semitones).toBe(11);
      expect(interval.getDisplayName()).toBe('長7度');
    });
  });

  describe('音楽理論的特性', () => {
    it('正常ケース: トライアド構築に必要な音程', () => {
      // メジャートライアド: 1度 + 長3度 + 完全5度
      const majorTriadIntervals = [
        Interval.unison(),
        Interval.majorThird(),
        Interval.perfectFifth(),
      ];

      expect(majorTriadIntervals[0].semitones).toBe(0);
      expect(majorTriadIntervals[1].semitones).toBe(4);
      expect(majorTriadIntervals[2].semitones).toBe(7);
    });

    it('正常ケース: マイナートライアド構築に必要な音程', () => {
      // マイナートライアド: 1度 + 短3度 + 完全5度
      const minorTriadIntervals = [
        Interval.unison(),
        Interval.minorThird(),
        Interval.perfectFifth(),
      ];

      expect(minorTriadIntervals[0].semitones).toBe(0);
      expect(minorTriadIntervals[1].semitones).toBe(3);
      expect(minorTriadIntervals[2].semitones).toBe(7);
    });

    it('正常ケース: セブンスコード構築に必要な音程', () => {
      // メジャー7th: 1度 + 長3度 + 完全5度 + 長7度
      const major7thIntervals = [
        Interval.unison(),
        Interval.majorThird(),
        Interval.perfectFifth(),
        Interval.majorSeventh(),
      ];

      const semitones = major7thIntervals.map(i => i.semitones);
      expect(semitones).toEqual([0, 4, 7, 11]);
    });

    it('境界値ケース: 12音階内での音程の特殊性', () => {
      // tritone（増4度/減5度）: 12音階の中点
      const tritone = new Interval('tritone');
      expect(tritone.semitones).toBe(6);
      expect(tritone.semitones * 2).toBe(12); // オクターブ

      // octave: 12音階の周期
      const octave = new Interval('octave');
      expect(octave.semitones).toBe(12);
    });
  });

  describe('型安全性の検証', () => {
    it('正常ケース: IntervalTypeの完全性', () => {
      // 全てのIntervalTypeが定義されていることを確認
      const allTypes: IntervalType[] = [
        'unison',
        'minor2nd',
        'major2nd',
        'minor3rd',
        'major3rd',
        'perfect4th',
        'tritone',
        'perfect5th',
        'minor6th',
        'major6th',
        'minor7th',
        'major7th',
        'octave',
      ];

      // 全ての型でIntervalを作成できることを確認
      allTypes.forEach(type => {
        expect(() => new Interval(type)).not.toThrow();
      });

      // セミトーン数が0-12の範囲内であることを確認
      allTypes.forEach(type => {
        const interval = new Interval(type);
        expect(interval.semitones).toBeGreaterThanOrEqual(0);
        expect(interval.semitones).toBeLessThanOrEqual(12);
      });
    });
  });
});
