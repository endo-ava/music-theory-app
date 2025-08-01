import { describe, it, expect } from 'vitest';
import { Scale } from '../Scale';
import { PitchClass } from '../../common/PitchClass';
import { ScalePattern } from '../../common/ScalePattern';

describe('Scale', () => {
  describe('スケール作成', () => {
    it('PitchClassとScalePatternからスケールを作成できる', () => {
      const root = new PitchClass('C');
      const pattern = ScalePattern.Major;
      const scale = new Scale(root, pattern);

      expect(scale.root.name).toBe('C');
      expect(scale.pattern.type).toBe('Major');
      expect(scale.type).toBe('Major');
      expect(scale.length).toBe(7);
    });

    it('ファクトリーメソッドでメジャースケールを作成できる', () => {
      const scale = Scale.major(new PitchClass('G'));

      expect(scale.root.name).toBe('G');
      expect(scale.isMajor).toBe(true);
      expect(scale.isMinor).toBe(false);
    });

    it('ファクトリーメソッドでマイナースケールを作成できる', () => {
      const scale = Scale.minor(new PitchClass('A'));

      expect(scale.root.name).toBe('A');
      expect(scale.isMinor).toBe(true);
      expect(scale.isMajor).toBe(false);
    });

    it('ドリアンモードを作成できる', () => {
      const scale = Scale.dorian(new PitchClass('D'));

      expect(scale.root.name).toBe('D');
      expect(scale.type).toBe('Dorian');
      expect(scale.isMode).toBe(true);
    });

    it('C Majorスケールを作成できる', () => {
      const scale = Scale.cMajor();

      expect(scale.root.name).toBe('C');
      expect(scale.isMajor).toBe(true);
    });

    it('A Minorスケールを作成できる', () => {
      const scale = Scale.aMinor();

      expect(scale.root.name).toBe('A');
      expect(scale.isMinor).toBe(true);
    });
  });

  describe('音高クラス操作', () => {
    it('スケールの音高クラス配列を取得できる', () => {
      const scale = Scale.cMajor();
      const pitchClasses = scale.getPitchClasses();

      expect(pitchClasses).toHaveLength(7);
      expect(pitchClasses[0].name).toBe('C'); // 1度
      expect(pitchClasses[1].name).toBe('D'); // 2度
      expect(pitchClasses[2].name).toBe('E'); // 3度
      expect(pitchClasses[3].name).toBe('F'); // 4度
      expect(pitchClasses[4].name).toBe('G'); // 5度
      expect(pitchClasses[5].name).toBe('A'); // 6度
      expect(pitchClasses[6].name).toBe('B'); // 7度
    });

    it('指定した度数の音高クラスを取得できる', () => {
      const scale = Scale.cMajor();

      expect(scale.getPitchClassAtDegree(1).name).toBe('C');
      expect(scale.getPitchClassAtDegree(3).name).toBe('E');
      expect(scale.getPitchClassAtDegree(5).name).toBe('G');
      expect(scale.getPitchClassAtDegree(7).name).toBe('B');
    });

    it('無効な度数でエラーが発生する', () => {
      const scale = Scale.cMajor();

      expect(() => scale.getPitchClassAtDegree(0)).toThrow('Invalid degree: 0');
      expect(() => scale.getPitchClassAtDegree(8)).toThrow('Invalid degree: 8');
    });

    it('音高クラスの含有判定ができる', () => {
      const scale = Scale.cMajor();

      expect(scale.contains(new PitchClass('C'))).toBe(true);
      expect(scale.contains(new PitchClass('E'))).toBe(true);
      expect(scale.contains(new PitchClass('G'))).toBe(true);
      expect(scale.contains(new PitchClass('C#'))).toBe(false);
      expect(scale.contains(new PitchClass('F#'))).toBe(false);
    });
  });

  describe('移調', () => {
    it('スケールを移調できる', () => {
      const cMajor = Scale.cMajor();
      const dMajor = cMajor.transpose(2); // 2半音上（長2度）

      expect(dMajor.root.name).toBe('D');
      expect(dMajor.isMajor).toBe(true);

      const pitchClasses = dMajor.getPitchClasses();
      expect(pitchClasses[0].name).toBe('D'); // 1度
      expect(pitchClasses[1].name).toBe('E'); // 2度
      expect(pitchClasses[2].name).toBe('F#'); // 3度
    });

    it('負の値で下降移調できる', () => {
      const cMajor = Scale.cMajor();
      const bFlatMajor = cMajor.transpose(-2); // 2半音下

      expect(bFlatMajor.root.name).toBe('A#'); // B♭の異名同音
      expect(bFlatMajor.isMajor).toBe(true);
    });
  });

  describe('スケール特性判定', () => {
    it('メジャー・マイナー判定が正しく動作する', () => {
      const major = Scale.major(new PitchClass('F'));
      const minor = Scale.minor(new PitchClass('D'));

      expect(major.isMajor).toBe(true);
      expect(major.isMinor).toBe(false);
      expect(minor.isMajor).toBe(false);
      expect(minor.isMinor).toBe(true);
    });

    it('モード判定が正しく動作する', () => {
      const dorian = Scale.dorian(new PitchClass('E'));
      const major = Scale.major(new PitchClass('C'));

      expect(dorian.isMode).toBe(true);
      expect(major.isMode).toBe(false);
    });

    it('音階タイプ判定が正しく動作する', () => {
      const major = Scale.major(new PitchClass('G'));
      const pentatonic = Scale.fromPattern(new PitchClass('C'), ScalePattern.Pentatonic);

      expect(major.isHeptatonic).toBe(true);
      expect(major.isPentatonic).toBe(false);
      expect(pentatonic.isHeptatonic).toBe(false);
      expect(pentatonic.isPentatonic).toBe(true);
    });
  });

  describe('表示名', () => {
    it('表示名を正しく生成する', () => {
      const scale = Scale.major(new PitchClass('F#'));
      expect(scale.getDisplayName()).toBe('F# Major Scale');
    });

    it('短縮表示名を正しく生成する', () => {
      const major = Scale.major(new PitchClass('D'));
      const minor = Scale.minor(new PitchClass('G'));

      expect(major.getShortName()).toBe('DMaj');
      expect(minor.getShortName()).toBe('GMin');
    });

    it('toString()で表示名を返す', () => {
      const scale = Scale.aMinor();
      expect(scale.toString()).toBe('A Natural Minor Scale');
    });
  });

  describe('等価性判定', () => {
    it('同じ主音とパターンのスケールは等価である', () => {
      const scale1 = Scale.major(new PitchClass('C'));
      const scale2 = Scale.major(new PitchClass('C'));

      expect(scale1.equals(scale2)).toBe(true);
    });

    it('異なる主音のスケールは等価でない', () => {
      const cMajor = Scale.major(new PitchClass('C'));
      const dMajor = Scale.major(new PitchClass('D'));

      expect(cMajor.equals(dMajor)).toBe(false);
    });

    it('異なるパターンのスケールは等価でない', () => {
      const cMajor = Scale.major(new PitchClass('C'));
      const cMinor = Scale.minor(new PitchClass('C'));

      expect(cMajor.equals(cMinor)).toBe(false);
    });
  });

  describe('シリアライゼーション', () => {
    it('JSONに変換できる', () => {
      const scale = Scale.major(new PitchClass('G'));
      const json = scale.toJSON();

      expect(json.root.name).toBe('G');
      expect(json.pattern.type).toBe('Major');
      expect(json.pattern.intervals).toEqual([0, 2, 4, 5, 7, 9, 11]);
    });

    it('JSONから復元できる', () => {
      const json = {
        root: { name: 'F#' as const },
        pattern: {
          name: 'Major Scale',
          type: 'Major' as const,
          intervals: [0, 2, 4, 5, 7, 9, 11],
        },
      };
      const scale = Scale.fromJSON(json);

      expect(scale.root.name).toBe('F#');
      expect(scale.isMajor).toBe(true);
    });

    it('JSON変換と復元で同じスケールになる', () => {
      const original = Scale.minor(new PitchClass('E'));
      const json = original.toJSON();
      const restored = Scale.fromJSON(json);

      expect(original.equals(restored)).toBe(true);
    });
  });

  describe('デフォルトスケール', () => {
    it('デフォルトスケールはC Majorである', () => {
      const defaultScale = Scale.getDefault();
      const cMajor = Scale.cMajor();

      expect(defaultScale.equals(cMajor)).toBe(true);
    });
  });

  describe('バリデーション', () => {
    it('rootがnullの場合エラーが発生する', () => {
      expect(() => {
        // @ts-expect-error Testing invalid input
        new Scale(null, ScalePattern.Major);
      }).toThrow('Scale must have a root PitchClass');
    });

    it('patternがnullの場合エラーが発生する', () => {
      expect(() => {
        // @ts-expect-error Testing invalid input
        new Scale(new PitchClass('C'), null);
      }).toThrow('Scale must have a ScalePattern');
    });
  });

  describe('特定の音階テスト', () => {
    it('C Majorスケールの音が正しい', () => {
      const scale = Scale.cMajor();
      const pitchClasses = scale.getPitchClasses();
      const expectedNames = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

      pitchClasses.forEach((pitchClass, index) => {
        expect(pitchClass.name).toBe(expectedNames[index]);
      });
    });

    it('A Minorスケールの音が正しい', () => {
      const scale = Scale.aMinor();
      const pitchClasses = scale.getPitchClasses();
      const expectedNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

      pitchClasses.forEach((pitchClass, index) => {
        expect(pitchClass.name).toBe(expectedNames[index]);
      });
    });

    it('G Majorスケールの音が正しい', () => {
      const scale = Scale.major(new PitchClass('G'));
      const pitchClasses = scale.getPitchClasses();
      const expectedNames = ['G', 'A', 'B', 'C', 'D', 'E', 'F#'];

      pitchClasses.forEach((pitchClass, index) => {
        expect(pitchClass.name).toBe(expectedNames[index]);
      });
    });
  });
});
