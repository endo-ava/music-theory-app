import { describe, it, expect } from 'vitest';
import { Key } from '../Key';
import { PitchClass } from '../../common/PitchClass';
import { ScalePattern } from '../../common/ScalePattern';

describe('Key', () => {
  describe('調の作成', () => {
    it('PitchClassとScalePatternから調を作成できる', () => {
      const tonic = new PitchClass('C');
      const pattern = ScalePattern.Major;
      const key = new Key(tonic, pattern);

      expect(key.tonic.name).toBe('C');
      expect(key.primaryPattern.type).toBe('Major');
      expect(key.isMajor).toBe(true);
      expect(key.isMinor).toBe(false);
    });

    it('ファクトリーメソッドでメジャーキーを作成できる', () => {
      const key = Key.major(new PitchClass('G'));

      expect(key.tonic.name).toBe('G');
      expect(key.isMajor).toBe(true);
      expect(key.isMinor).toBe(false);
    });

    it('ファクトリーメソッドでマイナーキーを作成できる', () => {
      const key = Key.minor(new PitchClass('A'));

      expect(key.tonic.name).toBe('A');
      expect(key.isMinor).toBe(true);
      expect(key.isMajor).toBe(false);
    });

    it('C Majorキーを作成できる', () => {
      const key = Key.cMajor();

      expect(key.tonic.name).toBe('C');
      expect(key.isMajor).toBe(true);
    });

    it('A Minorキーを作成できる', () => {
      const key = Key.aMinor();

      expect(key.tonic.name).toBe('A');
      expect(key.isMinor).toBe(true);
    });

    it('キー名文字列からメジャーキーを作成できる', () => {
      const key = Key.fromKeyName('G');

      expect(key.tonic.name).toBe('G');
      expect(key.isMajor).toBe(true);
    });

    it('キー名文字列からマイナーキーを作成できる', () => {
      const key = Key.fromKeyName('Em');

      expect(key.tonic.name).toBe('E');
      expect(key.isMinor).toBe(true);
    });

    it('無効なメジャーキー名でエラーが発生する', () => {
      expect(() => Key.fromKeyName('X')).toThrow('Invalid major key name: X');
    });

    it('無効なマイナーキー名でエラーが発生する', () => {
      expect(() => Key.fromKeyName('Xm')).toThrow('Invalid minor key name: Xm');
    });
  });

  describe('表示名', () => {
    it('メジャーキーの表示名を正しく取得できる', () => {
      const key = Key.major(new PitchClass('F#'));
      expect(key.getDisplayName()).toBe('F# Major');
    });

    it('マイナーキーの表示名を正しく取得できる', () => {
      const key = Key.minor(new PitchClass('D'));
      expect(key.getDisplayName()).toBe('D Minor');
    });

    it('短縮表示名を正しく取得できる', () => {
      const majorKey = Key.major(new PitchClass('C'));
      const minorKey = Key.minor(new PitchClass('A'));

      expect(majorKey.getShortName()).toBe('C');
      expect(minorKey.getShortName()).toBe('Am');
    });

    it('toString()で表示名を返す', () => {
      const key = Key.cMajor();
      expect(key.toString()).toBe('C Major');
    });
  });

  describe('音高クラスと音符操作', () => {
    it('指定した度数の音高クラスを取得できる', () => {
      const key = Key.cMajor();

      expect(key.getPitchClassAtDegree(1).name).toBe('C');
      expect(key.getPitchClassAtDegree(3).name).toBe('E');
      expect(key.getPitchClassAtDegree(5).name).toBe('G');
      expect(key.getPitchClassAtDegree(7).name).toBe('B');
    });

    it('調の全音高クラスを取得できる', () => {
      const key = Key.cMajor();
      const pitchClasses = key.getPitchClasses();

      expect(pitchClasses).toHaveLength(7);
      expect(pitchClasses[0].name).toBe('C');
      expect(pitchClasses[2].name).toBe('E');
      expect(pitchClasses[4].name).toBe('G');
    });

    it('音高クラスの含有判定ができる', () => {
      const key = Key.cMajor();

      expect(key.contains(new PitchClass('C'))).toBe(true);
      expect(key.contains(new PitchClass('E'))).toBe(true);
      expect(key.contains(new PitchClass('G'))).toBe(true);
      expect(key.contains(new PitchClass('C#'))).toBe(false);
      expect(key.contains(new PitchClass('F#'))).toBe(false);
    });
  });

  describe('和声機能', () => {
    it('メジャーキーの和声機能を正しく取得できる', () => {
      const key = Key.cMajor();

      expect(key.getHarmonicFunctionAtDegree(1)).toBe('tonic'); // I
      expect(key.getHarmonicFunctionAtDegree(2)).toBe('subdominant'); // ii
      expect(key.getHarmonicFunctionAtDegree(3)).toBe('tonic'); // iii
      expect(key.getHarmonicFunctionAtDegree(4)).toBe('subdominant'); // IV
      expect(key.getHarmonicFunctionAtDegree(5)).toBe('dominant'); // V
      expect(key.getHarmonicFunctionAtDegree(6)).toBe('tonic'); // vi
      expect(key.getHarmonicFunctionAtDegree(7)).toBe('dominant'); // vii°
    });

    it('マイナーキーの和声機能を正しく取得できる', () => {
      const key = Key.aMinor();

      expect(key.getHarmonicFunctionAtDegree(1)).toBe('tonic'); // i
      expect(key.getHarmonicFunctionAtDegree(2)).toBe('subdominant'); // ii°
      expect(key.getHarmonicFunctionAtDegree(3)).toBe('tonic'); // III
      expect(key.getHarmonicFunctionAtDegree(4)).toBe('subdominant'); // iv
      expect(key.getHarmonicFunctionAtDegree(5)).toBe('dominant'); // v
      expect(key.getHarmonicFunctionAtDegree(6)).toBe('tonic'); // VI
      expect(key.getHarmonicFunctionAtDegree(7)).toBe('dominant'); // VII
    });

    it('トニック機能の度数一覧を取得できる', () => {
      const majorKey = Key.cMajor();
      const minorKey = Key.aMinor();

      expect(majorKey.getTonicDegrees()).toEqual([1, 3, 6]);
      expect(minorKey.getTonicDegrees()).toEqual([1, 3, 6]);
    });

    it('サブドミナント機能の度数一覧を取得できる', () => {
      const majorKey = Key.cMajor();
      const minorKey = Key.aMinor();

      expect(majorKey.getSubdominantDegrees()).toEqual([2, 4]);
      expect(minorKey.getSubdominantDegrees()).toEqual([2, 4]);
    });

    it('ドミナント機能の度数一覧を取得できる', () => {
      const majorKey = Key.cMajor();
      const minorKey = Key.aMinor();

      expect(majorKey.getDominantDegrees()).toEqual([5, 7]);
      expect(minorKey.getDominantDegrees()).toEqual([5, 7]);
    });
  });

  describe('調の関係性', () => {
    it('相対調を正しく取得できる', () => {
      const cMajor = Key.cMajor();
      const aMinor = cMajor.getRelativeKey();

      expect(aMinor.tonic.name).toBe('A');
      expect(aMinor.isMinor).toBe(true);

      const backToMajor = aMinor.getRelativeKey();
      expect(backToMajor.tonic.name).toBe('C');
      expect(backToMajor.isMajor).toBe(true);
    });

    it('平行調を正しく取得できる', () => {
      const cMajor = Key.cMajor();
      const cMinor = cMajor.getParallelKey();

      expect(cMinor.tonic.name).toBe('C');
      expect(cMinor.isMinor).toBe(true);

      const backToMajor = cMinor.getParallelKey();
      expect(backToMajor.tonic.name).toBe('C');
      expect(backToMajor.isMajor).toBe(true);
    });

    it('モーダルキーを取得できる', () => {
      const cMajor = Key.cMajor();
      const cDorian = cMajor.getModalKey(ScalePattern.Dorian);

      expect(cDorian.tonic.name).toBe('C');
      expect(cDorian.primaryPattern.type).toBe('Dorian');
    });
  });

  describe('移調', () => {
    it('調を移調できる', () => {
      const cMajor = Key.cMajor();
      const dMajor = cMajor.transpose(2); // 2半音上

      expect(dMajor.tonic.name).toBe('D');
      expect(dMajor.isMajor).toBe(true);
    });

    it('負の値で下降移調できる', () => {
      const cMajor = Key.cMajor();
      const bFlatMajor = cMajor.transpose(-2); // 2半音下

      expect(bFlatMajor.tonic.name).toBe('A#'); // B♭の異名同音
      expect(bFlatMajor.isMajor).toBe(true);
    });
  });

  describe('主要スケール', () => {
    it('主要スケールを取得できる', () => {
      const key = Key.cMajor();
      const primaryScale = key.primaryScale;

      expect(primaryScale.root.name).toBe('C');
      expect(primaryScale.pattern.type).toBe('Major');
    });
  });

  describe('等価性判定', () => {
    it('同じトニックとパターンの調は等価である', () => {
      const key1 = Key.major(new PitchClass('C'));
      const key2 = Key.major(new PitchClass('C'));

      expect(key1.equals(key2)).toBe(true);
    });

    it('異なるトニックの調は等価でない', () => {
      const cMajor = Key.major(new PitchClass('C'));
      const dMajor = Key.major(new PitchClass('D'));

      expect(cMajor.equals(dMajor)).toBe(false);
    });

    it('異なるパターンの調は等価でない', () => {
      const cMajor = Key.major(new PitchClass('C'));
      const cMinor = Key.minor(new PitchClass('C'));

      expect(cMajor.equals(cMinor)).toBe(false);
    });
  });

  describe('シリアライゼーション', () => {
    it('JSONに変換できる', () => {
      const key = Key.major(new PitchClass('G'));
      const json = key.toJSON();

      expect(json.tonic.name).toBe('G');
      expect(json.primaryPattern.type).toBe('Major');
      expect(json.primaryPattern.intervals).toEqual([0, 2, 4, 5, 7, 9, 11]);
    });

    it('JSONから復元できる', () => {
      const json = {
        tonic: { name: 'F#' as const },
        primaryPattern: {
          name: 'Major Scale',
          type: 'Major' as const,
          intervals: [0, 2, 4, 5, 7, 9, 11],
        },
      };
      const key = Key.fromJSON(json);

      expect(key.tonic.name).toBe('F#');
      expect(key.isMajor).toBe(true);
    });

    it('JSON変換と復元で同じ調になる', () => {
      const original = Key.minor(new PitchClass('E'));
      const json = original.toJSON();
      const restored = Key.fromJSON(json);

      expect(original.equals(restored)).toBe(true);
    });
  });

  describe('デフォルト調', () => {
    it('デフォルト調はC Majorである', () => {
      const defaultKey = Key.getDefault();
      const cMajor = Key.cMajor();

      expect(defaultKey.equals(cMajor)).toBe(true);
    });
  });

  describe('バリデーション', () => {
    it('tonicがnullの場合エラーが発生する', () => {
      expect(() => {
        // @ts-expect-error Testing invalid input
        new Key(null, ScalePattern.Major);
      }).toThrow('Key must have a tonic PitchClass');
    });

    it('primaryPatternがnullの場合エラーが発生する', () => {
      expect(() => {
        // @ts-expect-error Testing invalid input
        new Key(new PitchClass('C'), null);
      }).toThrow('Key must have a primary ScalePattern');
    });
  });

  describe('すべての有効なキーのテスト', () => {
    const validMajorKeys = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#', 'F'];
    const validMinorKeys = [
      'Am',
      'Em',
      'Bm',
      'F#m',
      'C#m',
      'G#m',
      'D#m',
      'A#m',
      'Fm',
      'Cm',
      'Gm',
      'Dm',
    ];

    it.each(validMajorKeys)('メジャーキー %s で調を作成できる', keyName => {
      expect(() => Key.fromKeyName(keyName)).not.toThrow();
      const key = Key.fromKeyName(keyName);
      expect(key.isMajor).toBe(true);
    });

    it.each(validMinorKeys)('マイナーキー %s で調を作成できる', keyName => {
      expect(() => Key.fromKeyName(keyName)).not.toThrow();
      const key = Key.fromKeyName(keyName);
      expect(key.isMinor).toBe(true);
    });
  });
});
