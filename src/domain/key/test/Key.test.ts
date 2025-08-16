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

      expect(key.tonic.name).toBe('C');
      expect(key.scale.pattern.name).toBe('Major');
      expect(key.keyName).toBe('C Major');
    });

    it('正常ケース: マイナーキーを作成できる', () => {
      const tonic = PitchClass.fromCircleOfFifths(3); // A
      const pattern = ScalePattern.Aeolian;
      const key = new Key(tonic, pattern);

      expect(key.tonic.name).toBe('A');
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
      expect(iChord.name).toBe('C');
      expect(iChord.quality).toBe(ChordQuality.MajorTriad);

      // V度 - G Major
      const vChord = key.getDiatonicChord(5);
      expect(vChord.name).toBe('G');
      expect(vChord.quality).toBe(ChordQuality.MajorTriad);

      // vi度 - A Minor
      const viChord = key.getDiatonicChord(6);
      expect(viChord.name).toBe('Am');
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
      expect(tonicChord.name).toBe('C');
      expect(tonicChord.quality).toBe(ChordQuality.MajorTriad);
    });

    it('正常ケース: ドミナントコードを正しく取得', () => {
      const key = new Key(
        PitchClass.fromCircleOfFifths(0), // C
        ScalePattern.Major
      );

      const dominantChord = key.getDominantChord();
      expect(dominantChord.name).toBe('G');
      expect(dominantChord.quality).toBe(ChordQuality.MajorTriad);
    });

    it('正常ケース: サブドミナントコードを正しく取得', () => {
      const key = new Key(
        PitchClass.fromCircleOfFifths(0), // C
        ScalePattern.Major
      );

      const subdominantChord = key.getSubdominantChord();
      expect(subdominantChord.name).toBe('F');
      expect(subdominantChord.quality).toBe(ChordQuality.MajorTriad);
    });
  });

  describe('fromCircleOfFifths ファクトリメソッド', () => {
    it('正常ケース: 五度圏インデックスからメジャーキーを生成', () => {
      const key = Key.fromCircleOfFifths(1, true); // G Major

      expect(key.tonic.name).toBe('G');
      expect(key.scale.pattern).toBe(ScalePattern.Major);
      expect(key.keyName).toBe('G Major');
    });

    it('正常ケース: 五度圏インデックスからマイナーキーを生成', () => {
      const key = Key.fromCircleOfFifths(0, false); // C Minor

      expect(key.tonic.name).toBe('C');
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

      expect(key.scale.root.name).toBe('C');
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

        expect(majorKey.tonic.name).toBe(expectedMajorKeys[i]);
        expect(minorKey.tonic.name).toBe(expectedMinorKeys[i]);
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

      expect(progression[0].name).toBe('C');
      expect(progression[1].name).toBe('Am');
      expect(progression[2].name).toBe('F');
      expect(progression[3].name).toBe('G');
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
      expect(cMajor.tonic.name).toBe('C');
      expect(aMinor.tonic.name).toBe('A');
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

        expect(tonic.name).toBe(name);
        expect(tonic.quality).toBe(ChordQuality.MajorTriad);
      });
    });
  });
});
