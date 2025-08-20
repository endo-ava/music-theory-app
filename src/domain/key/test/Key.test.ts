/**
 * Key集約のユニットテスト
 * 現在のKey実装に合わせて最小限のテストに更新
 */

import { describe, it, expect } from 'vitest';
import { Key } from '../index';
import { PitchClass } from '../../common/PitchClass';
import { ScalePattern } from '../../common/ScalePattern';
import { ChordQuality } from '../../chord';

describe('Key', () => {
  describe('constructor', () => {
    it('正常ケース: PitchClassとScalePatternから調を作成できる', () => {
      const tonic = PitchClass.fromCircleOfFifths(0); // C
      const pattern = ScalePattern.Major;
      const key = new Key(tonic, pattern);

      expect(key.tonic.sharpName).toBe('C');
      expect(key.scale.pattern.name).toBe('Major');
      expect(key.keyName).toBe('C Major');
    });

    it('正常ケース: マイナーキーを作成できる', () => {
      const tonic = PitchClass.fromCircleOfFifths(3); // A
      const pattern = ScalePattern.Aeolian;
      const key = new Key(tonic, pattern);

      expect(key.tonic.sharpName).toBe('A');
      expect(key.scale.pattern.name).toBe('Minor');
      expect(key.keyName).toBe('A Minor');
    });
  });

  describe('keyName getter', () => {
    it('正常ケース: キー名を正しく取得できる', () => {
      const cMajor = new Key(
        PitchClass.fromCircleOfFifths(0), // C
        ScalePattern.Major
      );
      const dMinor = new Key(
        PitchClass.fromCircleOfFifths(2), // D
        ScalePattern.Aeolian
      );

      expect(cMajor.keyName).toBe('C Major');
      expect(dMinor.keyName).toBe('D Minor');
    });
  });

  describe('getDiatonicChord', () => {
    it('正常ケース: C Majorの各度数のダイアトニックコードを正しく生成', () => {
      const key = new Key(
        PitchClass.fromCircleOfFifths(0), // C
        ScalePattern.Major
      );

      // I度 - C Major
      const iChord = key.getDiatonicChord(1);
      expect(iChord.getNameFor(key)).toBe('C');
      expect(iChord.quality).toBe(ChordQuality.MajorTriad);

      // V度 - G Major
      const vChord = key.getDiatonicChord(5);
      expect(vChord.getNameFor(key)).toBe('G');
      expect(vChord.quality).toBe(ChordQuality.MajorTriad);

      // vi度 - A Minor
      const viChord = key.getDiatonicChord(6);
      expect(viChord.getNameFor(key)).toBe('Am');
      expect(viChord.quality).toBe(ChordQuality.MinorTriad);
    });

    it('異常ケース: 無効な度数でエラーをスロー', () => {
      const key = new Key(
        PitchClass.fromCircleOfFifths(0), // C
        ScalePattern.Major
      );

      expect(() => key.getDiatonicChord(0)).toThrow('度数は1から7の間で指定してください。');
      expect(() => key.getDiatonicChord(8)).toThrow('度数は1から7の間で指定してください。');
    });
  });

  describe('特定和音取得メソッド', () => {
    it('正常ケース: トニックコードを正しく取得', () => {
      const key = new Key(
        PitchClass.fromCircleOfFifths(0), // G
        ScalePattern.Major
      );

      const tonicChord = key.getTonicChord();
      expect(tonicChord.getNameFor(key)).toBe('C');
      expect(tonicChord.quality).toBe(ChordQuality.MajorTriad);
    });

    it('正常ケース: ドミナントコードを正しく取得', () => {
      const key = new Key(
        PitchClass.fromCircleOfFifths(0), // C
        ScalePattern.Major
      );

      const dominantChord = key.getDominantChord();
      expect(dominantChord.getNameFor(key)).toBe('G');
      expect(dominantChord.quality).toBe(ChordQuality.MajorTriad);
    });

    it('正常ケース: サブドミナントコードを正しく取得', () => {
      const key = new Key(
        PitchClass.fromCircleOfFifths(0), // C
        ScalePattern.Major
      );

      const subdominantChord = key.getSubdominantChord();
      expect(subdominantChord.getNameFor(key)).toBe('F');
      expect(subdominantChord.quality).toBe(ChordQuality.MajorTriad);
    });
  });

  describe('fromCircleOfFifths ファクトリメソッド', () => {
    it('正常ケース: 五度圏インデックスからメジャーキーを生成', () => {
      const key = Key.fromCircleOfFifths(1, true); // G Major

      expect(key.tonic.sharpName).toBe('G');
      expect(key.scale.pattern).toBe(ScalePattern.Major);
      expect(key.keyName).toBe('G Major');
    });

    it('正常ケース: 五度圏インデックスからマイナーキーを生成', () => {
      const key = Key.fromCircleOfFifths(0, false); // C Minor

      expect(key.tonic.sharpName).toBe('C');
      expect(key.scale.pattern).toBe(ScalePattern.Aeolian);
      expect(key.keyName).toBe('C Minor');
    });

    it('正常ケース: 全ての五度圏インデックスでキーを生成可能', () => {
      for (let i = 0; i < 12; i++) {
        expect(() => Key.fromCircleOfFifths(i, false)).not.toThrow();
        expect(() => Key.fromCircleOfFifths(i, true)).not.toThrow();
      }
    });
  });

  describe('primaryScale プロパティ', () => {
    it('正常ケース: 主要スケールが正しく設定される', () => {
      const key = new Key(
        PitchClass.fromCircleOfFifths(0), // C
        ScalePattern.Major
      );

      expect(key.scale.root.sharpName).toBe('C');
      expect(key.scale.pattern).toBe(ScalePattern.Major);
    });
  });

  describe('境界値テスト', () => {
    it('境界値ケース: 全ての五度圏ポジションでのキー作成', () => {
      const expectedMajorKeys = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#', 'F'];
      const expectedMinorKeys = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#', 'F'];

      for (let i = 0; i < 12; i++) {
        const majorKey = Key.fromCircleOfFifths(i, true);
        const minorKey = Key.fromCircleOfFifths(i, false);

        expect(majorKey.tonic.sharpName).toBe(expectedMajorKeys[i]);
        expect(minorKey.tonic.sharpName).toBe(expectedMinorKeys[i]);
      }
    });

    it('エンハーモニック表記: メジャーキーは♭表記、マイナーキーは#表記', () => {
      // メジャーキーの表記テスト（♭表記を使用）
      const majorKeys = [
        { position: 0, expectedShortName: 'C', expectedKeyName: 'C Major' },
        { position: 7, expectedShortName: 'D♭', expectedKeyName: 'D♭ Major' },
        { position: 8, expectedShortName: 'A♭', expectedKeyName: 'A♭ Major' },
        { position: 10, expectedShortName: 'B♭', expectedKeyName: 'B♭ Major' },
        { position: 6, expectedShortName: 'G♭', expectedKeyName: 'G♭ Major' },
      ];

      majorKeys.forEach(({ position, expectedShortName, expectedKeyName }) => {
        const key = Key.fromCircleOfFifths(position, true);
        expect(key.shortName).toBe(expectedShortName);
        expect(key.keyName).toBe(expectedKeyName);
      });

      // マイナーキーの表記テスト（#表記を使用）
      const minorKeys = [
        { position: 0, expectedShortName: 'Cm', expectedKeyName: 'C Minor' },
        { position: 7, expectedShortName: 'C#m', expectedKeyName: 'C# Minor' },
        { position: 8, expectedShortName: 'G#m', expectedKeyName: 'G# Minor' },
        { position: 10, expectedShortName: 'A#m', expectedKeyName: 'A# Minor' },
        { position: 6, expectedShortName: 'F#m', expectedKeyName: 'F# Minor' },
      ];

      minorKeys.forEach(({ position, expectedShortName, expectedKeyName }) => {
        const key = Key.fromCircleOfFifths(position, false);
        expect(key.shortName).toBe(expectedShortName);
        expect(key.keyName).toBe(expectedKeyName);
      });
    });
  });

  describe('音楽理論的特性', () => {
    it('正常ケース: C Majorキーのダイアトニックコード進行', () => {
      const key = new Key(
        PitchClass.fromCircleOfFifths(0), // C
        ScalePattern.Major
      );

      // I-vi-IV-V進行
      const progression = [
        key.getDiatonicChord(1), // C Major
        key.getDiatonicChord(6), // A Minor
        key.getDiatonicChord(4), // F Major
        key.getDiatonicChord(5), // G Major
      ];

      expect(progression[0].getNameFor(key)).toBe('C');
      expect(progression[1].getNameFor(key)).toBe('Am');
      expect(progression[2].getNameFor(key)).toBe('F');
      expect(progression[3].getNameFor(key)).toBe('G');
    });

    it('正常ケース: 相対調関係の確認', () => {
      const cMajor = new Key(
        PitchClass.fromCircleOfFifths(0), // C
        ScalePattern.Major
      );
      const aMinor = new Key(
        PitchClass.fromCircleOfFifths(3), // A
        ScalePattern.Aeolian
      );

      // C MajorとA Minorは相対調（同じ調号）
      expect(cMajor.tonic.sharpName).toBe('C');
      expect(aMinor.tonic.sharpName).toBe('A');
    });
  });

  describe('実用例', () => {
    it('正常ケース: 一般的なキーでの基本和音', () => {
      const testKeys = [
        { circleIndex: 0, name: 'C' }, // C Major
        { circleIndex: 1, name: 'G' }, // G Major
        { circleIndex: 11, name: 'F' }, // F Major
      ];

      testKeys.forEach(({ circleIndex, name }) => {
        const key = Key.fromCircleOfFifths(circleIndex, true);
        const tonic = key.getTonicChord();

        expect(tonic.rootNote._pitchClass.sharpName).toBe(name);
        expect(tonic.quality).toBe(ChordQuality.MajorTriad);
      });
    });
  });

  describe('getRelatedKeys メソッド', () => {
    it('正常ケース: C Majorの関連調を正しく取得', () => {
      const cMajor = new Key(PitchClass.fromCircleOfFifths(0), ScalePattern.Major);
      const relatedKeys = cMajor.getRelatedKeys();

      // 平行調: A minor (C Major の平行調)
      expect(relatedKeys.relative.tonic.sharpName).toBe('A');
      expect(relatedKeys.relative.isMajor).toBe(false);
      expect(relatedKeys.relative.keyName).toBe('A Minor');

      // 同主調: C minor (同じトニック、異なるモード)
      expect(relatedKeys.parallel.tonic.sharpName).toBe('C');
      expect(relatedKeys.parallel.isMajor).toBe(false);
      expect(relatedKeys.parallel.keyName).toBe('C Minor');

      // 属調: G major (V度のキー)
      expect(relatedKeys.dominant.tonic.sharpName).toBe('G');
      expect(relatedKeys.dominant.isMajor).toBe(true);
      expect(relatedKeys.dominant.keyName).toBe('G Major');

      // 下属調: F major (IV度のキー)
      expect(relatedKeys.subdominant.tonic.sharpName).toBe('F');
      expect(relatedKeys.subdominant.isMajor).toBe(true);
      expect(relatedKeys.subdominant.keyName).toBe('F Major');
    });

    it('正常ケース: A minorの関連調を正しく取得', () => {
      const aMinor = new Key(PitchClass.fromCircleOfFifths(3), ScalePattern.Aeolian);
      const relatedKeys = aMinor.getRelatedKeys();

      // 平行調: C major (A minor の平行調)
      expect(relatedKeys.relative.tonic.sharpName).toBe('C');
      expect(relatedKeys.relative.isMajor).toBe(true);
      expect(relatedKeys.relative.keyName).toBe('C Major');

      // 同主調: A major (同じトニック、異なるモード)
      expect(relatedKeys.parallel.tonic.sharpName).toBe('A');
      expect(relatedKeys.parallel.isMajor).toBe(true);
      expect(relatedKeys.parallel.keyName).toBe('A Major');

      // 属調: E minor (V度のキー)
      expect(relatedKeys.dominant.tonic.sharpName).toBe('E');
      expect(relatedKeys.dominant.isMajor).toBe(false);
      expect(relatedKeys.dominant.keyName).toBe('E Minor');

      // 下属調: D minor (IV度のキー)
      expect(relatedKeys.subdominant.tonic.sharpName).toBe('D');
      expect(relatedKeys.subdominant.isMajor).toBe(false);
      expect(relatedKeys.subdominant.keyName).toBe('D Minor');
    });

    it('境界値ケース: フラット系キー(F# Major)の関連調', () => {
      const fsSharpMajor = new Key(PitchClass.fromCircleOfFifths(6), ScalePattern.Major);
      const relatedKeys = fsSharpMajor.getRelatedKeys();

      // 平行調: D# minor
      expect(relatedKeys.relative.tonic.sharpName).toBe('D#');
      expect(relatedKeys.relative.isMajor).toBe(false);

      // 同主調: F# minor
      expect(relatedKeys.parallel.tonic.sharpName).toBe('F#');
      expect(relatedKeys.parallel.isMajor).toBe(false);

      // 属調: C# major
      expect(relatedKeys.dominant.tonic.sharpName).toBe('C#');
      expect(relatedKeys.dominant.isMajor).toBe(true);

      // 下属調: B major
      expect(relatedKeys.subdominant.tonic.sharpName).toBe('B');
      expect(relatedKeys.subdominant.isMajor).toBe(true);
    });
  });

  describe('getJapaneseScaleDegreeNames 静的メソッド', () => {
    it('正常ケース: 日本語度数名配列を正しく返す', () => {
      const degreeNames = Key.getJapaneseScaleDegreeNames();

      expect(degreeNames).toEqual(['主音', '上主音', '中音', '下属音', '属音', '下中音', '導音']);
      expect(degreeNames.length).toBe(7);
    });

    it('正常ケース: 常に同じ参照を返す', () => {
      const degreeNames1 = Key.getJapaneseScaleDegreeNames();
      const degreeNames2 = Key.getJapaneseScaleDegreeNames();

      // 同じ参照を返すことを確認（メモ化されている）
      expect(degreeNames1).toBe(degreeNames2);
    });
  });
});
