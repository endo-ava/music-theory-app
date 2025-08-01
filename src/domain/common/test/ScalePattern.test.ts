import { describe, it, expect } from 'vitest';
import { ScalePattern, type ScalePatternType } from '../ScalePattern';
import { Interval } from '../Interval';

describe('ScalePattern', () => {
  describe('基本的なパターン作成', () => {
    it('メジャースケールパターンを作成できる', () => {
      const major = ScalePattern.major();

      expect(major.name).toBe('Major Scale');
      expect(major.type).toBe('Major');
      expect(major.length).toBe(7);
      expect(major.isHeptatonic()).toBe(true);
      expect(major.getSemitonePattern()).toEqual([0, 2, 4, 5, 7, 9, 11]);
    });

    it('ナチュラルマイナーパターンを作成できる', () => {
      const minor = ScalePattern.minor();

      expect(minor.name).toBe('Natural Minor Scale');
      expect(minor.type).toBe('Minor');
      expect(minor.length).toBe(7);
      expect(minor.isHeptatonic()).toBe(true);
      expect(minor.getSemitonePattern()).toEqual([0, 2, 3, 5, 7, 8, 10]);
    });

    it('ドリアンモードパターンを作成できる', () => {
      const dorian = ScalePattern.dorian();

      expect(dorian.name).toBe('Dorian Mode');
      expect(dorian.type).toBe('Dorian');
      expect(dorian.isMode()).toBe(true);
      expect(dorian.getSemitonePattern()).toEqual([0, 2, 3, 5, 7, 9, 10]);
    });

    it('フリジアンモードパターンを作成できる', () => {
      const phrygian = ScalePattern.phrygian();

      expect(phrygian.name).toBe('Phrygian Mode');
      expect(phrygian.type).toBe('Phrygian');
      expect(phrygian.isMode()).toBe(true);
      expect(phrygian.getSemitonePattern()).toEqual([0, 1, 3, 5, 7, 8, 10]);
    });

    it('リディアンモードパターンを作成できる', () => {
      const lydian = ScalePattern.lydian();

      expect(lydian.name).toBe('Lydian Mode');
      expect(lydian.type).toBe('Lydian');
      expect(lydian.isMode()).toBe(true);
      expect(lydian.getSemitonePattern()).toEqual([0, 2, 4, 6, 7, 9, 11]);
    });

    it('ミクソリディアンモードパターンを作成できる', () => {
      const mixolydian = ScalePattern.mixolydian();

      expect(mixolydian.name).toBe('Mixolydian Mode');
      expect(mixolydian.type).toBe('Mixolydian');
      expect(mixolydian.isMode()).toBe(true);
      expect(mixolydian.getSemitonePattern()).toEqual([0, 2, 4, 5, 7, 9, 10]);
    });

    it('ロクリアンモードパターンを作成できる', () => {
      const locrian = ScalePattern.locrian();

      expect(locrian.name).toBe('Locrian Mode');
      expect(locrian.type).toBe('Locrian');
      expect(locrian.isMode()).toBe(true);
      expect(locrian.getSemitonePattern()).toEqual([0, 1, 3, 5, 6, 8, 10]);
    });

    it('ハーモニックマイナーパターンを作成できる', () => {
      const harmonicMinor = ScalePattern.harmonicMinor();

      expect(harmonicMinor.name).toBe('Harmonic Minor Scale');
      expect(harmonicMinor.type).toBe('HarmonicMinor');
      expect(harmonicMinor.getSemitonePattern()).toEqual([0, 2, 3, 5, 7, 8, 11]);
    });

    it('ペンタトニックパターンを作成できる', () => {
      const pentatonic = ScalePattern.pentatonic();

      expect(pentatonic.name).toBe('Pentatonic Scale');
      expect(pentatonic.type).toBe('Pentatonic');
      expect(pentatonic.length).toBe(5);
      expect(pentatonic.isPentatonic()).toBe(true);
      expect(pentatonic.getSemitonePattern()).toEqual([0, 2, 4, 7, 9]);
    });
  });

  describe('パターンの特性判定', () => {
    it('7音階パターンを正しく判定する', () => {
      expect(ScalePattern.major().isHeptatonic()).toBe(true);
      expect(ScalePattern.minor().isHeptatonic()).toBe(true);
      expect(ScalePattern.dorian().isHeptatonic()).toBe(true);
      expect(ScalePattern.pentatonic().isHeptatonic()).toBe(false);
    });

    it('ペンタトニックパターンを正しく判定する', () => {
      expect(ScalePattern.pentatonic().isPentatonic()).toBe(true);
      expect(ScalePattern.major().isPentatonic()).toBe(false);
      expect(ScalePattern.minor().isPentatonic()).toBe(false);
    });

    it('モードパターンを正しく判定する', () => {
      expect(ScalePattern.dorian().isMode()).toBe(true);
      expect(ScalePattern.phrygian().isMode()).toBe(true);
      expect(ScalePattern.lydian().isMode()).toBe(true);
      expect(ScalePattern.mixolydian().isMode()).toBe(true);
      expect(ScalePattern.locrian().isMode()).toBe(true);

      // Major/Minorはモードではない
      expect(ScalePattern.major().isMode()).toBe(false);
      expect(ScalePattern.minor().isMode()).toBe(false);

      // 7音階でないものもモードではない
      expect(ScalePattern.pentatonic().isMode()).toBe(false);
    });
  });

  describe('度数アクセス', () => {
    it('特定の度数の音程を取得できる', () => {
      const major = ScalePattern.major();

      expect(major.getInterval(1).semitones).toBe(0); // 1度 = ユニゾン
      expect(major.getInterval(2).semitones).toBe(2); // 2度 = 長2度
      expect(major.getInterval(3).semitones).toBe(4); // 3度 = 長3度
      expect(major.getInterval(4).semitones).toBe(5); // 4度 = 完全4度
      expect(major.getInterval(5).semitones).toBe(7); // 5度 = 完全5度
      expect(major.getInterval(6).semitones).toBe(9); // 6度 = 長6度
      expect(major.getInterval(7).semitones).toBe(11); // 7度 = 長7度
    });

    it('無効な度数でエラーが発生する', () => {
      const major = ScalePattern.major();

      expect(() => major.getInterval(0)).toThrow('Invalid degree: 0');
      expect(() => major.getInterval(8)).toThrow('Invalid degree: 8');
      expect(() => major.getInterval(-1)).toThrow('Invalid degree: -1');
    });
  });

  describe('表示名', () => {
    it('表示名を正しく取得できる', () => {
      expect(ScalePattern.major().getDisplayName()).toBe('Major Scale');
      expect(ScalePattern.minor().getDisplayName()).toBe('Natural Minor Scale');
      expect(ScalePattern.dorian().getDisplayName()).toBe('Dorian Mode');
    });

    it('短縮表示名を正しく取得できる', () => {
      expect(ScalePattern.major().getShortName()).toBe('Maj');
      expect(ScalePattern.minor().getShortName()).toBe('Min');
      expect(ScalePattern.dorian().getShortName()).toBe('Dor');
      expect(ScalePattern.phrygian().getShortName()).toBe('Phr');
      expect(ScalePattern.lydian().getShortName()).toBe('Lyd');
      expect(ScalePattern.mixolydian().getShortName()).toBe('Mix');
      expect(ScalePattern.locrian().getShortName()).toBe('Loc');
      expect(ScalePattern.harmonicMinor().getShortName()).toBe('HMin');
      expect(ScalePattern.pentatonic().getShortName()).toBe('Pent');
    });
  });

  describe('等価性判定', () => {
    it('同じパターンは等価である', () => {
      const major1 = ScalePattern.major();
      const major2 = ScalePattern.major();

      expect(major1.equals(major2)).toBe(true);
    });

    it('異なるパターンは等価でない', () => {
      const major = ScalePattern.major();
      const minor = ScalePattern.minor();

      expect(major.equals(minor)).toBe(false);
    });

    it('同じ音程構造でもタイプが異なれば等価でない', () => {
      // カスタムパターンで同じ音程構造を作成
      const custom1 = new ScalePattern('Custom Major', 'Major', [
        Interval.unison(),
        Interval.majorSecond(),
        Interval.majorThird(),
        Interval.perfectFourth(),
        Interval.perfectFifth(),
        Interval.majorSixth(),
        Interval.majorSeventh(),
      ]);

      const custom2 = new ScalePattern('Custom Lydian', 'Lydian', [
        Interval.unison(),
        Interval.majorSecond(),
        Interval.majorThird(),
        Interval.perfectFourth(),
        Interval.perfectFifth(),
        Interval.majorSixth(),
        Interval.majorSeventh(),
      ]);

      expect(custom1.equals(custom2)).toBe(false);
    });
  });

  describe('シリアライゼーション', () => {
    it('JSONに変換できる', () => {
      const major = ScalePattern.major();
      const json = major.toJSON();

      expect(json).toEqual({
        name: 'Major Scale',
        type: 'Major',
        intervals: [0, 2, 4, 5, 7, 9, 11],
      });
    });

    it('JSONから復元できる', () => {
      const json = {
        name: 'Minor Scale',
        type: 'Minor' as ScalePatternType,
        intervals: [0, 2, 3, 5, 7, 8, 10],
      };
      const pattern = ScalePattern.fromJSON(json);

      expect(pattern.name).toBe('Minor Scale');
      expect(pattern.type).toBe('Minor');
      expect(pattern.getSemitonePattern()).toEqual([0, 2, 3, 5, 7, 8, 10]);
    });

    it('JSON変換と復元で同じパターンになる', () => {
      const original = ScalePattern.dorian();
      const json = original.toJSON();
      const restored = ScalePattern.fromJSON(json);

      expect(original.equals(restored)).toBe(true);
    });
  });

  describe('バリデーション', () => {
    it('空の音程配列でエラーが発生する', () => {
      expect(() => {
        new ScalePattern('Empty', 'Major', []);
      }).toThrow('ScalePattern must have at least one interval');
    });

    it('最初の音程がユニゾンでない場合エラーが発生する', () => {
      expect(() => {
        new ScalePattern('Invalid', 'Major', [Interval.majorSecond(), Interval.majorThird()]);
      }).toThrow('First interval must be unison (0 semitones)');
    });

    it('音程が昇順でない場合エラーが発生する', () => {
      expect(() => {
        new ScalePattern('Invalid', 'Major', [
          Interval.unison(),
          Interval.majorThird(),
          Interval.majorSecond(), // 順序が逆
        ]);
      }).toThrow('Intervals must be in ascending order');
    });

    it('オクターブを超える音程でエラーが発生する', () => {
      expect(() => {
        ScalePattern.fromJSON({
          name: 'Invalid',
          type: 'Major',
          intervals: [0, 2, 4, 12], // 12セミトーンはオクターブなのでNG
        });
      }).toThrow('Scale pattern intervals must not exceed an octave (12 semitones)');
    });
  });

  describe('デフォルトパターン', () => {
    it('デフォルトパターンはメジャースケールである', () => {
      const defaultPattern = ScalePattern.getDefault();
      const major = ScalePattern.major();

      expect(defaultPattern.equals(major)).toBe(true);
    });
  });

  describe('文字列表現', () => {
    it('toString()でパターン情報を表示する', () => {
      const major = ScalePattern.major();
      expect(major.toString()).toBe('Major Scale (0-2-4-5-7-9-11)');
    });
  });
});
