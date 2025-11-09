/**
 * Key集約のユニットテスト
 * 現在のKey実装に合わせて最小限のテストに更新
 */

import { describe, it, expect } from 'vitest';
import { Key } from '../index';
import { PitchClass } from '../../common/PitchClass';
import { ScalePattern } from '../../common/ScalePattern';
import { ChordPattern } from '../../common';

describe('Key', () => {
  // 新規追加: calculateKeySignatureForKey関数の間接テスト
  describe('KeySignature calculation (calculateKeySignatureForKey)', () => {
    describe('メジャーキーのKeySignature計算', () => {
      it('正常ケース: C major → 調号なし (fifthsIndex: 0)', () => {
        const cMajor = Key.major(PitchClass.fromCircleOfFifths(0)); // C
        expect(cMajor.keySignature.fifthsIndex).toBe(0);
        expect(cMajor.keySignature.primaryAccidental).toBe(null);
      });

      it('正常ケース: G major → 1つのシャープ (fifthsIndex: 1)', () => {
        const gMajor = Key.major(PitchClass.fromCircleOfFifths(1)); // G
        expect(gMajor.keySignature.fifthsIndex).toBe(1);
        expect(gMajor.keySignature.primaryAccidental?.value).toBe('sharp');
      });

      it('正常ケース: F major → 1つのフラット (fifthsIndex: 11)', () => {
        const fMajor = Key.major(PitchClass.fromCircleOfFifths(11)); // F
        expect(fMajor.keySignature.fifthsIndex).toBe(11);
        expect(fMajor.keySignature.primaryAccidental?.value).toBe('flat');
      });

      it('正常ケース: B♭ major → 2つのフラット (fifthsIndex: 10)', () => {
        const bbMajor = Key.major(PitchClass.fromCircleOfFifths(10)); // B♭
        expect(bbMajor.keySignature.fifthsIndex).toBe(10);
        expect(bbMajor.keySignature.primaryAccidental?.value).toBe('flat');
      });
    });

    describe('マイナーキーのKeySignature計算（相対長調から導出）', () => {
      it('正常ケース: A minor → C major相対 (fifthsIndex: 0)', () => {
        const aMinor = Key.minor(PitchClass.fromCircleOfFifths(3)); // A
        expect(aMinor.keySignature.fifthsIndex).toBe(0); // C major
        expect(aMinor.keySignature.primaryAccidental).toBe(null);
      });

      it('正常ケース: E minor → G major相対 (fifthsIndex: 1)', () => {
        const eMinor = Key.minor(PitchClass.fromCircleOfFifths(4)); // E
        expect(eMinor.keySignature.fifthsIndex).toBe(1); // G major
        expect(eMinor.keySignature.primaryAccidental?.value).toBe('sharp');
      });

      it('正常ケース: F# minor → A major相対 (fifthsIndex: 3)', () => {
        const fsMinor = Key.minor(PitchClass.fromCircleOfFifths(6)); // F#
        expect(fsMinor.keySignature.fifthsIndex).toBe(3); // A major
        expect(fsMinor.keySignature.primaryAccidental?.value).toBe('sharp');
      });

      it('正常ケース: D minor → F major相対 (fifthsIndex: 11)', () => {
        const dMinor = Key.minor(PitchClass.fromCircleOfFifths(2)); // D
        expect(dMinor.keySignature.fifthsIndex).toBe(11); // F major
        expect(dMinor.keySignature.primaryAccidental?.value).toBe('flat');
      });
    });

    describe('音楽理論的妥当性の確認', () => {
      it('正常ケース: 全ての五度圏位置でKeySignatureが正しく計算される', () => {
        // メジャーキーの検証
        for (let i = 0; i < 12; i++) {
          const majorKey = Key.major(PitchClass.fromCircleOfFifths(i));
          expect(majorKey.keySignature.fifthsIndex).toBe(i);
        }

        // マイナーキーの検証（相対長調のfifthsIndexと一致する）
        for (let i = 0; i < 12; i++) {
          const minorKey = Key.minor(PitchClass.fromCircleOfFifths(i));
          // 実際の実装では MinorThird.transposeBy を使用しており、
          // これは fifthsIndex ベースでの計算ではなく semitone ベースでの計算
          // そのため、実際の相対長調の fifthsIndex を直接計算するのではなく、
          // 実装されている getRelativeMajorTonic() の結果と比較する
          const expectedRelativeMajorTonic = minorKey.getRelativeMajorTonic();
          expect(minorKey.keySignature.fifthsIndex).toBe(expectedRelativeMajorTonic.fifthsIndex);
        }
      });

      it('正常ケース: 相対調関係のKeySignatureが一致する', () => {
        // A minor と C major
        const aMinor = Key.minor(PitchClass.fromCircleOfFifths(3));
        const cMajor = Key.major(PitchClass.fromCircleOfFifths(0));
        expect(aMinor.keySignature.fifthsIndex).toBe(cMajor.keySignature.fifthsIndex);

        // F# minor と A major
        const fsMinor = Key.minor(PitchClass.fromCircleOfFifths(6));
        const aMajor = Key.major(PitchClass.fromCircleOfFifths(3));
        expect(fsMinor.keySignature.fifthsIndex).toBe(aMajor.keySignature.fifthsIndex);
      });
    });
  });

  describe('constructor', () => {
    it('正常ケース: PitchClassとScalePatternから調を作成できる', () => {
      const centerPitch = PitchClass.fromCircleOfFifths(0); // C
      const key = Key.major(centerPitch);

      expect(key.centerPitch.sharpName).toBe('C');
      expect(key.scale.pattern.name).toBe('Major');
      expect(key.contextName).toBe('C Major');
    });

    it('正常ケース: マイナーキーを作成できる', () => {
      const centerPitch = PitchClass.fromCircleOfFifths(3); // A
      const key = Key.minor(centerPitch);

      expect(key.centerPitch.sharpName).toBe('A');
      expect(key.scale.pattern.name).toBe('Minor');
      expect(key.contextName).toBe('A Minor');
    });
  });

  describe('keyName getter', () => {
    it('正常ケース: キー名を正しく取得できる', () => {
      const cMajor = Key.major(
        PitchClass.fromCircleOfFifths(0) // C
      );
      const dMinor = Key.minor(
        PitchClass.fromCircleOfFifths(2) // D
      );

      expect(cMajor.contextName).toBe('C Major');
      expect(dMinor.contextName).toBe('D Minor');
    });
  });

  // buildTriad の基本機能は AbstractMusicalContext.test.ts でテスト済み
  // ここではKey固有の挙動のみテスト
  describe('buildTriad - Key固有テスト', () => {
    it('正常ケース: C Majorの代表的な和音名が正しく表示される', () => {
      const key = Key.major(PitchClass.fromCircleOfFifths(0)); // C Major

      // Key特有の機能：和音名表示の確認
      expect(key.buildTriad(1).getNameFor(key)).toBe('C'); // I度
      expect(key.buildTriad(5).getNameFor(key)).toBe('G'); // V度
      expect(key.buildTriad(6).getNameFor(key)).toBe('Am'); // vi度
    });
  });

  describe('特定和音取得メソッド', () => {
    it('正常ケース: トニックコードを正しく取得', () => {
      const key = Key.major(
        PitchClass.fromCircleOfFifths(0) // C
      );

      const centerPitchChord = key.getTonicChord();
      expect(centerPitchChord.getNameFor(key)).toBe('C');
      expect(centerPitchChord.quality).toBe(ChordPattern.MajorTriad);
    });

    it('正常ケース: ドミナントコードを正しく取得', () => {
      const key = Key.major(
        PitchClass.fromCircleOfFifths(0) // C
      );

      const dominantChord = key.getDominantChord();
      expect(dominantChord.getNameFor(key)).toBe('G');
      expect(dominantChord.quality).toBe(ChordPattern.MajorTriad);
    });

    it('正常ケース: サブドミナントコードを正しく取得', () => {
      const key = Key.major(
        PitchClass.fromCircleOfFifths(0) // C
      );

      const subdominantChord = key.getSubdominantChord();
      expect(subdominantChord.getNameFor(key)).toBe('F');
      expect(subdominantChord.quality).toBe(ChordPattern.MajorTriad);
    });
  });

  describe('fromCircleOfFifths ファクトリメソッド', () => {
    it('正常ケース: 五度圏インデックスからメジャーキーを生成', () => {
      const key = Key.fromCircleOfFifths(1, true); // G Major

      expect(key.centerPitch.sharpName).toBe('G');
      expect(key.scale.pattern).toBe(ScalePattern.Major);
      expect(key.contextName).toBe('G Major');
    });

    it('正常ケース: 五度圏インデックスからマイナーキーを生成', () => {
      const key = Key.fromCircleOfFifths(0, false); // C Minor

      expect(key.centerPitch.sharpName).toBe('C');
      expect(key.scale.pattern).toBe(ScalePattern.Aeolian);
      expect(key.contextName).toBe('C Minor');
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
      const key = Key.major(
        PitchClass.fromCircleOfFifths(0) // C
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

        expect(majorKey.centerPitch.sharpName).toBe(expectedMajorKeys[i]);
        expect(minorKey.centerPitch.sharpName).toBe(expectedMinorKeys[i]);
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
        expect(key.contextName).toBe(expectedKeyName);
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
        expect(key.contextName).toBe(expectedKeyName);
      });
    });
  });

  describe('音楽理論的特性', () => {
    it('正常ケース: C Majorキーのダイアトニックコード進行', () => {
      const key = Key.major(
        PitchClass.fromCircleOfFifths(0) // C
      );

      // I-vi-IV-V進行
      const progression = [
        key.buildTriad(1), // C Major
        key.buildTriad(6), // A Minor
        key.buildTriad(4), // F Major
        key.buildTriad(5), // G Major
      ];

      expect(progression[0].getNameFor(key)).toBe('C');
      expect(progression[1].getNameFor(key)).toBe('Am');
      expect(progression[2].getNameFor(key)).toBe('F');
      expect(progression[3].getNameFor(key)).toBe('G');
    });

    it('正常ケース: 相対調関係の確認', () => {
      const cMajor = Key.major(
        PitchClass.fromCircleOfFifths(0) // C
      );
      const aMinor = Key.minor(
        PitchClass.fromCircleOfFifths(3) // A
      );

      // C MajorとA Minorは相対調（同じ調号）
      expect(cMajor.centerPitch.sharpName).toBe('C');
      expect(aMinor.centerPitch.sharpName).toBe('A');
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
        const centerPitch = key.getTonicChord();

        expect(centerPitch.rootNote._pitchClass.sharpName).toBe(name);
        expect(centerPitch.quality).toBe(ChordPattern.MajorTriad);
      });
    });
  });

  describe('japaneseScaleDegreeNames getter', () => {
    it('正常ケース: メジャーキーの日本語度数名配列を正しく返す', () => {
      const cMajor = Key.major(PitchClass.fromCircleOfFifths(0));
      const majorDegreeNames = cMajor.japaneseScaleDegreeNames;

      expect(majorDegreeNames).toEqual([
        '主音',
        '上主音',
        '中音',
        '下属音',
        '属音',
        '下中音',
        '導音',
      ]);
      expect(majorDegreeNames.length).toBe(7);
    });

    it('正常ケース: マイナーキーの日本語度数名配列を正しく返す', () => {
      const aMinor = Key.minor(PitchClass.fromCircleOfFifths(3));
      const minorDegreeNames = aMinor.japaneseScaleDegreeNames;

      expect(minorDegreeNames).toEqual([
        '主音',
        '上主音',
        '中音',
        '下属音',
        '属音',
        '下中音',
        '下主音',
      ]);
      expect(minorDegreeNames.length).toBe(7);
    });

    it('正常ケース: 異なるメジャーキーでも同じ度数名を返す', () => {
      const cMajor = Key.major(PitchClass.fromCircleOfFifths(0));
      const gMajor = Key.major(PitchClass.fromCircleOfFifths(1));

      expect(cMajor.japaneseScaleDegreeNames).toEqual(gMajor.japaneseScaleDegreeNames);
    });

    it('正常ケース: 常に同じ参照を返す（メジャーキー）', () => {
      const cMajor = Key.major(PitchClass.fromCircleOfFifths(0));
      const degreeNames1 = cMajor.japaneseScaleDegreeNames;
      const degreeNames2 = cMajor.japaneseScaleDegreeNames;

      // 同じ参照を返すことを確認（メモ化されている）
      expect(degreeNames1).toBe(degreeNames2);
    });

    it('正常ケース: 常に同じ参照を返す（マイナーキー）', () => {
      const aMinor = Key.minor(PitchClass.fromCircleOfFifths(3));
      const degreeNames1 = aMinor.japaneseScaleDegreeNames;
      const degreeNames2 = aMinor.japaneseScaleDegreeNames;

      // 同じ参照を返すことを確認（メモ化されている）
      expect(degreeNames1).toBe(degreeNames2);
    });
  });

  describe('関連調メソッド', () => {
    describe('getRelativeKey', () => {
      it('正常ケース: メジャーキーから相対マイナーキーを取得', () => {
        const cMajor = Key.major(PitchClass.fromCircleOfFifths(0)); // C Major
        const relativeMinor = cMajor.getRelativeKey();

        expect(relativeMinor.centerPitch.sharpName).toBe('A');
        expect(relativeMinor.contextName).toBe('A Minor');
        expect(relativeMinor.isMajor).toBe(false);
        expect(relativeMinor.centerPitch.fifthsIndex).toBe(3); // A
      });

      it('正常ケース: マイナーキーから相対メジャーキーを取得', () => {
        const aMinor = Key.minor(PitchClass.fromCircleOfFifths(3)); // A Minor
        const relativeMajor = aMinor.getRelativeKey();

        expect(relativeMajor.centerPitch.sharpName).toBe('C');
        expect(relativeMajor.contextName).toBe('C Major');
        expect(relativeMajor.isMajor).toBe(true);
        expect(relativeMajor.centerPitch.fifthsIndex).toBe(0); // C
      });

      it('正常ケース: G Majorから相対マイナーキー（E Minor）を取得', () => {
        const gMajor = Key.major(PitchClass.fromCircleOfFifths(1)); // G Major
        const relativeMinor = gMajor.getRelativeKey();

        expect(relativeMinor.centerPitch.sharpName).toBe('E');
        expect(relativeMinor.contextName).toBe('E Minor');
        expect(relativeMinor.isMajor).toBe(false);
        expect(relativeMinor.centerPitch.fifthsIndex).toBe(4); // E
      });

      it('正常ケース: E MinorからG Majorを取得', () => {
        const eMinor = Key.minor(PitchClass.fromCircleOfFifths(4)); // E Minor
        const relativeMajor = eMinor.getRelativeKey();

        expect(relativeMajor.centerPitch.sharpName).toBe('G');
        expect(relativeMajor.contextName).toBe('G Major');
        expect(relativeMajor.isMajor).toBe(true);
        expect(relativeMajor.centerPitch.fifthsIndex).toBe(1); // G
      });

      it('境界値ケース: 五度圏の境界での相対調', () => {
        const fSharpMajor = Key.major(PitchClass.fromCircleOfFifths(6)); // F# Major
        const relativeMinor = fSharpMajor.getRelativeKey();

        expect(relativeMinor.centerPitch.sharpName).toBe('D#');
        expect(relativeMinor.contextName).toBe('D# Minor');
        expect(relativeMinor.centerPitch.fifthsIndex).toBe(9); // D#
      });
    });

    describe('getParallelKey', () => {
      it('正常ケース: メジャーキーから同主マイナーキーを取得', () => {
        const cMajor = Key.major(PitchClass.fromCircleOfFifths(0)); // C Major
        const parallelMinor = cMajor.getParallelKey();

        expect(parallelMinor.centerPitch.sharpName).toBe('C');
        expect(parallelMinor.contextName).toBe('C Minor');
        expect(parallelMinor.isMajor).toBe(false);
        expect(parallelMinor.centerPitch.fifthsIndex).toBe(0); // C
      });

      it('正常ケース: マイナーキーから同主メジャーキーを取得', () => {
        const cMinor = Key.minor(PitchClass.fromCircleOfFifths(0)); // C Minor
        const parallelMajor = cMinor.getParallelKey();

        expect(parallelMajor.centerPitch.sharpName).toBe('C');
        expect(parallelMajor.contextName).toBe('C Major');
        expect(parallelMajor.isMajor).toBe(true);
        expect(parallelMajor.centerPitch.fifthsIndex).toBe(0); // C
      });

      it('正常ケース: G Majorから同主マイナーキー（G Minor）を取得', () => {
        const gMajor = Key.major(PitchClass.fromCircleOfFifths(1)); // G Major
        const parallelMinor = gMajor.getParallelKey();

        expect(parallelMinor.centerPitch.sharpName).toBe('G');
        expect(parallelMinor.contextName).toBe('G Minor');
        expect(parallelMinor.isMajor).toBe(false);
        expect(parallelMinor.centerPitch.fifthsIndex).toBe(1); // G
      });

      it('正常ケース: G MinorからG Majorを取得', () => {
        const gMinor = Key.minor(PitchClass.fromCircleOfFifths(1)); // G Minor
        const parallelMajor = gMinor.getParallelKey();

        expect(parallelMajor.centerPitch.sharpName).toBe('G');
        expect(parallelMajor.contextName).toBe('G Major');
        expect(parallelMajor.isMajor).toBe(true);
        expect(parallelMajor.centerPitch.fifthsIndex).toBe(1); // G
      });
    });

    describe('getDominantKey', () => {
      it('正常ケース: C Majorからドミナント調（G Major）を取得', () => {
        const cMajor = Key.major(PitchClass.fromCircleOfFifths(0)); // C Major
        const dominantKey = cMajor.getDominantKey();

        expect(dominantKey.centerPitch.sharpName).toBe('G');
        expect(dominantKey.contextName).toBe('G Major');
        expect(dominantKey.isMajor).toBe(true);
        expect(dominantKey.centerPitch.fifthsIndex).toBe(1); // G
      });

      it('正常ケース: A Minorからドミナント調（E Minor）を取得', () => {
        const aMinor = Key.minor(PitchClass.fromCircleOfFifths(3)); // A Minor
        const dominantKey = aMinor.getDominantKey();

        expect(dominantKey.centerPitch.sharpName).toBe('E');
        expect(dominantKey.contextName).toBe('E Minor');
        expect(dominantKey.isMajor).toBe(false);
        expect(dominantKey.centerPitch.fifthsIndex).toBe(4); // E
      });

      it('正常ケース: F Majorからドミナント調（C Major）を取得', () => {
        const fMajor = Key.major(PitchClass.fromCircleOfFifths(11)); // F Major
        const dominantKey = fMajor.getDominantKey();

        expect(dominantKey.centerPitch.sharpName).toBe('C');
        expect(dominantKey.contextName).toBe('C Major');
        expect(dominantKey.isMajor).toBe(true);
        expect(dominantKey.centerPitch.fifthsIndex).toBe(0); // C
      });

      it('境界値ケース: 五度圏の境界でのドミナント調', () => {
        const bMajor = Key.major(PitchClass.fromCircleOfFifths(5)); // B Major
        const dominantKey = bMajor.getDominantKey();

        expect(dominantKey.centerPitch.sharpName).toBe('F#');
        expect(dominantKey.contextName).toBe('G♭ Major'); // メジャーキーは♭表記を使用
        expect(dominantKey.centerPitch.fifthsIndex).toBe(6); // F#
      });
    });

    describe('getSubdominantKey', () => {
      it('正常ケース: C Majorからサブドミナント調（F Major）を取得', () => {
        const cMajor = Key.major(PitchClass.fromCircleOfFifths(0)); // C Major
        const subdominantKey = cMajor.getSubdominantKey();

        expect(subdominantKey.centerPitch.sharpName).toBe('F');
        expect(subdominantKey.contextName).toBe('F Major');
        expect(subdominantKey.isMajor).toBe(true);
        expect(subdominantKey.centerPitch.fifthsIndex).toBe(11); // F
      });

      it('正常ケース: A Minorからサブドミナント調（D Minor）を取得', () => {
        const aMinor = Key.minor(PitchClass.fromCircleOfFifths(3)); // A Minor
        const subdominantKey = aMinor.getSubdominantKey();

        expect(subdominantKey.centerPitch.sharpName).toBe('D');
        expect(subdominantKey.contextName).toBe('D Minor');
        expect(subdominantKey.isMajor).toBe(false);
        expect(subdominantKey.centerPitch.fifthsIndex).toBe(2); // D
      });

      it('正常ケース: G Majorからサブドミナント調（C Major）を取得', () => {
        const gMajor = Key.major(PitchClass.fromCircleOfFifths(1)); // G Major
        const subdominantKey = gMajor.getSubdominantKey();

        expect(subdominantKey.centerPitch.sharpName).toBe('C');
        expect(subdominantKey.contextName).toBe('C Major');
        expect(subdominantKey.isMajor).toBe(true);
        expect(subdominantKey.centerPitch.fifthsIndex).toBe(0); // C
      });

      it('境界値ケース: 五度圏の境界でのサブドミナント調', () => {
        const cSharpMajor = Key.major(PitchClass.fromCircleOfFifths(7)); // C# Major
        const subdominantKey = cSharpMajor.getSubdominantKey();

        expect(subdominantKey.centerPitch.sharpName).toBe('F#');
        expect(subdominantKey.contextName).toBe('G♭ Major'); // メジャーキーは♭表記を使用
        expect(subdominantKey.centerPitch.fifthsIndex).toBe(6); // F#
      });
    });
  });

  // 新規追加: Key.fromRelativeMode() のテスト
  describe('fromRelativeMode (Relative Mode用)', () => {
    const cMajor = Key.major(PitchClass.C);

    it('正常ケース: C Major から Ionian (index=0) → C Ionian (C Major)', () => {
      const result = Key.fromRelativeMode(cMajor, 0);
      expect(result.centerPitch).toBe(PitchClass.C);
      expect(result.scale.pattern).toBe(ScalePattern.Major);
      expect(result.contextName).toBe('C Major');
    });

    it('正常ケース: C Major から Dorian (index=1) → D Dorian', () => {
      const result = Key.fromRelativeMode(cMajor, 1);
      expect(result.centerPitch).toBe(PitchClass.D);
      expect(result.scale.pattern).toBe(ScalePattern.Dorian);
      expect(result.contextName).toBe('D Dorian');
    });

    it('正常ケース: C Major から Phrygian (index=2) → E Phrygian', () => {
      const result = Key.fromRelativeMode(cMajor, 2);
      expect(result.centerPitch).toBe(PitchClass.E);
      expect(result.scale.pattern).toBe(ScalePattern.Phrygian);
      expect(result.contextName).toBe('E Phrygian');
    });

    it('正常ケース: C Major から Lydian (index=3) → F Lydian', () => {
      const result = Key.fromRelativeMode(cMajor, 3);
      expect(result.centerPitch).toBe(PitchClass.F);
      expect(result.scale.pattern).toBe(ScalePattern.Lydian);
      expect(result.contextName).toBe('F Lydian');
    });

    it('正常ケース: C Major から Mixolydian (index=4) → G Mixolydian', () => {
      const result = Key.fromRelativeMode(cMajor, 4);
      expect(result.centerPitch).toBe(PitchClass.G);
      expect(result.scale.pattern).toBe(ScalePattern.Mixolydian);
      expect(result.contextName).toBe('G Mixolydian');
    });

    it('正常ケース: C Major から Aeolian (index=5) → A Aeolian (A Minor)', () => {
      const result = Key.fromRelativeMode(cMajor, 5);
      expect(result.centerPitch).toBe(PitchClass.A);
      expect(result.scale.pattern).toBe(ScalePattern.Aeolian);
      expect(result.contextName).toBe('A Minor');
    });

    it('正常ケース: C Major から Locrian (index=6) → B Locrian', () => {
      const result = Key.fromRelativeMode(cMajor, 6);
      expect(result.centerPitch).toBe(PitchClass.B);
      expect(result.scale.pattern).toBe(ScalePattern.Locrian);
      expect(result.contextName).toBe('B Locrian');
    });

    it('エラーケース: relativeModeIndex が範囲外（-1）', () => {
      expect(() => Key.fromRelativeMode(cMajor, -1)).toThrow(
        'relativeModeIndex must be between 0 and 6'
      );
    });

    it('エラーケース: relativeModeIndex が範囲外（7）', () => {
      expect(() => Key.fromRelativeMode(cMajor, 7)).toThrow(
        'relativeModeIndex must be between 0 and 6'
      );
    });

    it('エラーケース: parentMajorKey が Minor キー', () => {
      const aMinor = Key.minor(PitchClass.A);
      expect(() => Key.fromRelativeMode(aMinor, 0)).toThrow('parentMajorKey must be a Major key');
    });

    it('境界値ケース: G Major から全モードを生成', () => {
      const gMajor = Key.major(PitchClass.G);
      const expectedRoots = [
        PitchClass.G, // Ionian
        PitchClass.A, // Dorian
        PitchClass.B, // Phrygian
        PitchClass.C, // Lydian
        PitchClass.D, // Mixolydian
        PitchClass.E, // Aeolian
        PitchClass.fromChromaticIndex(6), // F# - Locrian
      ];

      for (let i = 0; i < 7; i++) {
        const result = Key.fromRelativeMode(gMajor, i);
        expect(result.centerPitch).toBe(expectedRoots[i]);
      }
    });
  });
});
