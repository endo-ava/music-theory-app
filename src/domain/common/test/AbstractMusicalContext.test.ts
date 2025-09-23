import { describe, it, expect } from 'vitest';
import { Key } from '../../key';
import { ModalContext } from '../../modal-context';
import { PitchClass } from '../PitchClass';
import { ScalePattern } from '../ScalePattern';
import { Scale } from '../../scale';
import { Chord } from '../../chord';
import { Note } from '../Note';
import { ChordPattern } from '../ChordPattern';
import { AbstractMusicalContext } from '../AbstractMusicalContext';

/**
 * テスト専用のAbstractMusicalContextの実装
 */
class TestContext extends AbstractMusicalContext {
  constructor(centerPitch: PitchClass, scale: Scale) {
    super(centerPitch, scale);
  }
}

/**
 * AbstractMusicalContextの共通機能をテストする
 * Key/ModalContextインスタンスを使って抽象クラスの実装を検証
 */
describe('AbstractMusicalContext', () => {
  // テスト対象のインスタンス配列（包括的なケースをテスト）
  const testContexts: { name: string; context: AbstractMusicalContext }[] = [
    // メジャーキー
    { name: 'Key (C Major)', context: Key.major(PitchClass.C) },
    { name: 'Key (G Major - Sharp)', context: Key.major(PitchClass.G) },
    { name: 'Key (F Major - Flat)', context: Key.major(PitchClass.F) },

    // マイナーキー
    { name: 'Key (A Minor)', context: Key.minor(PitchClass.A) },
    { name: 'Key (E Minor - Sharp)', context: Key.minor(PitchClass.E) },
    { name: 'Key (D Minor - Flat)', context: Key.minor(PitchClass.D) },

    // モード
    {
      name: 'ModalContext (D Dorian)',
      context: new ModalContext(PitchClass.D, ScalePattern.Dorian),
    },
    {
      name: 'ModalContext (E Phrygian)',
      context: new ModalContext(PitchClass.E, ScalePattern.Phrygian),
    },
    {
      name: 'ModalContext (F Lydian)',
      context: new ModalContext(PitchClass.F, ScalePattern.Lydian),
    },
    {
      name: 'ModalContext (G Mixolydian)',
      context: new ModalContext(PitchClass.G, ScalePattern.Mixolydian),
    },
  ];

  describe('getDegreeNameFromNumber - 静的メソッド', () => {
    it('正常ケース: 1-7度の各度数で正しいローマ数字を返す', () => {
      expect(
        AbstractMusicalContext.getDegreeNameFromNumber({ degree: 1, keySignature: 'natural' })
      ).toBe('Ⅰ');
      expect(
        AbstractMusicalContext.getDegreeNameFromNumber({ degree: 2, keySignature: 'natural' })
      ).toBe('Ⅱ');
      expect(
        AbstractMusicalContext.getDegreeNameFromNumber({ degree: 3, keySignature: 'natural' })
      ).toBe('Ⅲ');
      expect(
        AbstractMusicalContext.getDegreeNameFromNumber({ degree: 4, keySignature: 'natural' })
      ).toBe('Ⅳ');
      expect(
        AbstractMusicalContext.getDegreeNameFromNumber({ degree: 5, keySignature: 'natural' })
      ).toBe('Ⅴ');
      expect(
        AbstractMusicalContext.getDegreeNameFromNumber({ degree: 6, keySignature: 'natural' })
      ).toBe('Ⅵ');
      expect(
        AbstractMusicalContext.getDegreeNameFromNumber({ degree: 7, keySignature: 'natural' })
      ).toBe('Ⅶ');
    });

    it('正常ケース: sharp記号付き度数名を正しく返す', () => {
      expect(
        AbstractMusicalContext.getDegreeNameFromNumber({ degree: 1, keySignature: 'sharp' })
      ).toBe('♯Ⅰ');
      expect(
        AbstractMusicalContext.getDegreeNameFromNumber({ degree: 4, keySignature: 'sharp' })
      ).toBe('♯Ⅳ');
      expect(
        AbstractMusicalContext.getDegreeNameFromNumber({ degree: 7, keySignature: 'sharp' })
      ).toBe('♯Ⅶ');
    });

    it('正常ケース: flat記号付き度数名を正しく返す', () => {
      expect(
        AbstractMusicalContext.getDegreeNameFromNumber({ degree: 2, keySignature: 'flat' })
      ).toBe('♭Ⅱ');
      expect(
        AbstractMusicalContext.getDegreeNameFromNumber({ degree: 6, keySignature: 'flat' })
      ).toBe('♭Ⅵ');
      expect(
        AbstractMusicalContext.getDegreeNameFromNumber({ degree: 7, keySignature: 'flat' })
      ).toBe('♭Ⅶ');
    });

    it('異常ケース: 範囲外の度数でエラーをスロー', () => {
      expect(() =>
        AbstractMusicalContext.getDegreeNameFromNumber({ degree: 0, keySignature: 'natural' })
      ).toThrow('度数は1から7の間で指定してください。');
      expect(() =>
        AbstractMusicalContext.getDegreeNameFromNumber({ degree: 8, keySignature: 'natural' })
      ).toThrow('度数は1から7の間で指定してください。');
      expect(() =>
        AbstractMusicalContext.getDegreeNameFromNumber({ degree: -1, keySignature: 'natural' })
      ).toThrow('度数は1から7の間で指定してください。');
    });

    it('境界値ケース: 最小値と最大値で正しく動作', () => {
      expect(
        AbstractMusicalContext.getDegreeNameFromNumber({ degree: 1, keySignature: 'natural' })
      ).toBe('Ⅰ');
      expect(
        AbstractMusicalContext.getDegreeNameFromNumber({ degree: 7, keySignature: 'natural' })
      ).toBe('Ⅶ');
    });
  });

  describe('基本プロパティ', () => {
    testContexts.forEach(({ name, context }) => {
      describe(`${name}`, () => {
        it('centerPitchが正しく設定されている', () => {
          expect(context.centerPitch).toBeDefined();
          expect(context.centerPitch.fifthsIndex).toBeTypeOf('number');
        });

        it('scaleが正しく設定されている', () => {
          expect(context.scale).toBeDefined();
          expect(context.scale.pattern).toBeDefined();
        });

        it('contextNameが生成される', () => {
          expect(context.contextName).toBeTypeOf('string');
          expect(context.contextName.length).toBeGreaterThan(0);
        });

        it('shortNameが生成される', () => {
          expect(context.shortName).toBeTypeOf('string');
          expect(context.shortName.length).toBeGreaterThan(0);
        });
      });
    });
  });

  describe('buildTriad - 三和音構築機能', () => {
    testContexts.forEach(({ name, context }) => {
      describe(`${name}`, () => {
        it('1-7度の三和音を構築できる', () => {
          for (let degree = 1; degree <= 7; degree++) {
            const chord = context.buildTriad(degree);
            expect(chord).toBeInstanceOf(Chord);
            expect(chord.constituentNotes).toHaveLength(3);
          }
        });

        it('範囲外の度数でエラーが投げられる', () => {
          expect(() => context.buildTriad(0)).toThrow();
          expect(() => context.buildTriad(8)).toThrow();
          expect(() => context.buildTriad(-1)).toThrow();
        });
      });
    });
  });

  describe('diatonicChords - ダイアトニック和音配列', () => {
    // 個別の完全一致テスト
    describe('特定キーの完全一致検証', () => {
      it('正常ケース: C Majorの7つのダイアトニック和音を完全検証', () => {
        const cMajor = Key.major(PitchClass.C);
        const chords = cMajor.diatonicChords;

        expect(chords).toHaveLength(7);
        expect(chords[0].getNameFor(cMajor)).toBe('C'); // I度 = C major
        expect(chords[1].getNameFor(cMajor)).toBe('Dm'); // ii度 = D minor
        expect(chords[2].getNameFor(cMajor)).toBe('Em'); // iii度 = E minor
        expect(chords[3].getNameFor(cMajor)).toBe('F'); // IV度 = F major
        expect(chords[4].getNameFor(cMajor)).toBe('G'); // V度 = G major
        expect(chords[5].getNameFor(cMajor)).toBe('Am'); // vi度 = A minor
        expect(chords[6].getNameFor(cMajor)).toBe('Bdim'); // vii度 = B diminished
      });

      it('正常ケース: A Minorの7つのダイアトニック和音を完全検証', () => {
        const aMinor = Key.minor(PitchClass.A);
        const chords = aMinor.diatonicChords;

        expect(chords).toHaveLength(7);
        expect(chords[0].getNameFor(aMinor)).toBe('Am'); // i度 = A minor
        expect(chords[1].getNameFor(aMinor)).toBe('Bdim'); // ii度 = B diminished
        expect(chords[2].getNameFor(aMinor)).toBe('C'); // III度 = C major
        expect(chords[3].getNameFor(aMinor)).toBe('Dm'); // iv度 = D minor
        expect(chords[4].getNameFor(aMinor)).toBe('Em'); // v度 = E minor
        expect(chords[5].getNameFor(aMinor)).toBe('F'); // VI度 = F major
        expect(chords[6].getNameFor(aMinor)).toBe('G'); // VII度 = G major
      });

      it('正常ケース: G Majorの7つのダイアトニック和音を完全検証', () => {
        const gMajor = Key.major(PitchClass.G);
        const chords = gMajor.diatonicChords;

        expect(chords).toHaveLength(7);
        expect(chords[0].getNameFor(gMajor)).toBe('G'); // I度 = G major
        expect(chords[1].getNameFor(gMajor)).toBe('Am'); // ii度 = A minor
        expect(chords[2].getNameFor(gMajor)).toBe('Bm'); // iii度 = B minor
        expect(chords[3].getNameFor(gMajor)).toBe('C'); // IV度 = C major
        expect(chords[4].getNameFor(gMajor)).toBe('D'); // V度 = D major
        expect(chords[5].getNameFor(gMajor)).toBe('Em'); // vi度 = E minor
        expect(chords[6].getNameFor(gMajor)).toBe('F#dim'); // vii度 = F# diminished
      });
    });

    // 共通機能テスト
    testContexts.forEach(({ name, context }) => {
      describe(`${name}`, () => {
        it('正常ケース: 7つのダイアトニック和音を返す', () => {
          const chords = context.diatonicChords;
          expect(chords).toHaveLength(7);
          chords.forEach(chord => {
            expect(chord).toBeInstanceOf(Chord);
            expect(chord.rootNote).toBeDefined();
            expect(chord.quality).toBeDefined();
          });
        });

        it('正常ケース: キャッシュ機能が動作する（同一インスタンスを返す）', () => {
          const chords1 = context.diatonicChords;
          const chords2 = context.diatonicChords;
          expect(chords1).toBe(chords2);
        });

        it('正常ケース: 結果がフリーズされている（immutable）', () => {
          const chords = context.diatonicChords;
          expect(Object.isFrozen(chords)).toBe(true);
        });

        it('正常ケース: 各和音が有効なコード名を持つ', () => {
          const chords = context.diatonicChords;
          chords.forEach(chord => {
            expect(chord.rootNote).toBeDefined();
            expect(chord.quality.quality).toMatch(/^(major|minor|diminished|augmented)$/);
            expect(chord.quality.nameSuffix).toBeDefined();
          });
        });
      });
    });
  });

  describe('analyzeChord - 和音分析機能', () => {
    // 特定キーの完全一致テスト
    describe('特定キーの分析結果完全検証', () => {
      it('正常ケース: C Majorの各ダイアトニック和音分析を完全検証', () => {
        const cMajor = Key.major(PitchClass.C);
        const chords = cMajor.diatonicChords;

        // I度 (C major)
        const result1 = cMajor.analyzeChord(chords[0]);
        expect(result1.perfectDegreeName).toBe('Ⅰ');
        expect(result1.isDiatonic).toBe(true);
        expect(result1.chord).toBe(chords[0]);

        // ii度 (D minor)
        const result2 = cMajor.analyzeChord(chords[1]);
        expect(result2.perfectDegreeName).toBe('Ⅱm');
        expect(result2.isDiatonic).toBe(true);
        expect(result2.chord).toBe(chords[1]);

        // V度 (G major)
        const result5 = cMajor.analyzeChord(chords[4]);
        expect(result5.perfectDegreeName).toBe('Ⅴ');
        expect(result5.isDiatonic).toBe(true);
        expect(result5.chord).toBe(chords[4]);

        // vii度 (B diminished)
        const result7 = cMajor.analyzeChord(chords[6]);
        expect(result7.perfectDegreeName).toBe('Ⅶ°');
        expect(result7.isDiatonic).toBe(true);
        expect(result7.chord).toBe(chords[6]);
      });

      it('正常ケース: A Minorの各ダイアトニック和音分析を完全検証', () => {
        const aMinor = Key.minor(PitchClass.A);
        const chords = aMinor.diatonicChords;

        // i度 (A minor)
        const result1 = aMinor.analyzeChord(chords[0]);
        expect(result1.perfectDegreeName).toBe('Ⅰm');
        expect(result1.isDiatonic).toBe(true);
        expect(result1.chord).toBe(chords[0]);

        // ii度 (B diminished)
        const result2 = aMinor.analyzeChord(chords[1]);
        expect(result2.perfectDegreeName).toBe('Ⅱ°');
        expect(result2.isDiatonic).toBe(true);
        expect(result2.chord).toBe(chords[1]);

        // III度 (C major)
        const result3 = aMinor.analyzeChord(chords[2]);
        expect(result3.perfectDegreeName).toBe('Ⅲ');
        expect(result3.isDiatonic).toBe(true);
        expect(result3.chord).toBe(chords[2]);

        // v度 (E minor)
        const result5 = aMinor.analyzeChord(chords[4]);
        expect(result5.perfectDegreeName).toBe('Ⅴm');
        expect(result5.isDiatonic).toBe(true);
        expect(result5.chord).toBe(chords[4]);
      });
    });

    // 共通機能テスト
    testContexts.forEach(({ name, context }) => {
      describe(`${name}`, () => {
        it('正常ケース: ダイアトニック和音の分析結果構造を検証', () => {
          const firstChord = context.diatonicChords[0];
          const result = context.analyzeChord(firstChord);

          expect(result.perfectDegreeName).toMatch(/^[♯♭]?[ⅠⅡⅢⅣⅤⅥⅦⅰⅱⅲⅳⅴⅵⅶ]+[mMdimaugdim°+]?$/);
          expect(result.isDiatonic).toBe(true);
          expect(result.chord).toBe(firstChord);
          expect(result.flatDegreeName).toBeTypeOf('string');
          expect(result.sharpDegreeName).toBeTypeOf('string');
        });

        it('正常ケース: 全ダイアトニック和音が正しく分析される', () => {
          context.diatonicChords.forEach(chord => {
            const result = context.analyzeChord(chord);
            expect(result.isDiatonic).toBe(true);
            expect(result.perfectDegreeName).toMatch(/^[♯♭]?[ⅠⅡⅢⅣⅤⅥⅦⅰⅱⅲⅳⅴⅵⅶ]+[mMdimaugdim°+]?$/);
            expect(result.chord).toBe(chord);
          });
        });

        it('正常ケース: 和音分析結果の詳細プロパティを検証', () => {
          const chords = context.diatonicChords;
          expect(chords).toHaveLength(7);

          chords.forEach(chord => {
            const result = context.analyzeChord(chord);

            // 基本構造の検証
            expect(chord.constituentNotes).toHaveLength(3);
            expect(chord.rootNote).toBeDefined();
            expect(chord.quality).toBeDefined();

            // 分析結果の検証
            expect(result.flatDegreeName.length).toBeGreaterThan(0);
            expect(result.sharpDegreeName.length).toBeGreaterThan(0);
            expect(result.perfectDegreeName.length).toBeGreaterThan(0);
          });
        });
      });
    });

    // ノンダイアトニック和音の分析テスト
    describe('ノンダイアトニック和音の分析', () => {
      it('正常ケース: C Majorにおけるセカンダリードミナント（V/V = D major）の分析', () => {
        const cMajor = Key.major(PitchClass.C);

        // D major chord (V/V) - C Majorではノンダイアトニック
        const dNote = new Note(PitchClass.D, 4);
        const dMajorChord = Chord.major(dNote);
        const result = cMajor.analyzeChord(dMajorChord);

        expect(result.isDiatonic).toBe(false);
        expect(result.chord).toBe(dMajorChord);
        expect(result.perfectDegreeName).toMatch(
          /^([♯♭]?[ⅠⅡⅢⅣⅤⅥⅦⅠⅡⅢⅣⅤⅥⅦ]+[mMdimaugdim°+]?)(\s*\/\s*[♯♭]?[ⅠⅡⅢⅣⅤⅥⅦⅠⅡⅢⅣⅤⅥⅦ]+[mMdimaugdim°+]?)?$/
        );
        expect(result.flatDegreeName).toBeTypeOf('string');
        expect(result.sharpDegreeName).toBeTypeOf('string');
      });

      it('正常ケース: A Minorにおけるナポリタン6度（♭Ⅱ = B♭ major）の分析', () => {
        const aMinor = Key.minor(PitchClass.A);

        // B♭ major chord (Neapolitan sixth) - A minorではノンダイアトニック
        const bFlatNote = new Note(PitchClass.ASharp, 4); // A#/B♭
        const bFlatMajorChord = Chord.major(bFlatNote);
        const result = aMinor.analyzeChord(bFlatMajorChord);

        expect(result.isDiatonic).toBe(false);
        expect(result.chord).toBe(bFlatMajorChord);
        expect(result.perfectDegreeName).toMatch(
          /^([♯♭]?[ⅠⅡⅢⅣⅤⅥⅦⅠⅡⅢⅣⅤⅥⅦ]+[mMdimaugdim°+]?)(\s*\/\s*[♯♭]?[ⅠⅡⅢⅣⅤⅥⅦⅠⅡⅢⅣⅤⅥⅦ]+[mMdimaugdim°+]?)?$/
        );
        expect(result.flatDegreeName).toBeTypeOf('string');
        expect(result.sharpDegreeName).toBeTypeOf('string');
      });

      it('正常ケース: C Majorにおける借用和音（ⅵ♭ = A♭ major）の分析', () => {
        const cMajor = Key.major(PitchClass.C);

        // A♭ major chord (borrowed from C minor) - C Majorではノンダイアトニック
        const aFlatNote = new Note(PitchClass.GSharp, 4); // G#/A♭
        const aFlatMajorChord = Chord.major(aFlatNote);
        const result = cMajor.analyzeChord(aFlatMajorChord);

        expect(result.isDiatonic).toBe(false);
        expect(result.chord).toBe(aFlatMajorChord);
        expect(result.perfectDegreeName).toMatch(
          /^([♯♭]?[ⅠⅡⅢⅣⅤⅥⅦⅠⅡⅢⅣⅤⅥⅦ]+[mMdimaugdim°+]?)(\s*\/\s*[♯♭]?[ⅠⅡⅢⅣⅤⅥⅦⅠⅡⅢⅣⅤⅥⅦ]+[mMdimaugdim°+]?)?$/
        );
        expect(result.flatDegreeName).toBeTypeOf('string');
        expect(result.sharpDegreeName).toBeTypeOf('string');
      });

      it('正常ケース: G Majorにおけるクロマチック和音（F diminished）の分析', () => {
        const gMajor = Key.major(PitchClass.G);

        // F diminished chord - G Majorではノンダイアトニック
        const fNote = new Note(PitchClass.F, 4);
        const fDimChord = Chord.from(fNote, ChordPattern.DiminishedTriad);
        const result = gMajor.analyzeChord(fDimChord);

        expect(result.isDiatonic).toBe(false);
        expect(result.chord).toBe(fDimChord);
        expect(result.perfectDegreeName).toMatch(
          /^([♯♭]?[ⅠⅡⅢⅣⅤⅥⅦⅠⅡⅢⅣⅤⅥⅦ]+[mMdimaugdim°+]?)(\s*\/\s*[♯♭]?[ⅠⅡⅢⅣⅤⅥⅦⅠⅡⅢⅣⅤⅥⅦ]+[mMdimaugdim°+]?)?$/
        );
        expect(result.flatDegreeName).toBeTypeOf('string');
        expect(result.sharpDegreeName).toBeTypeOf('string');
      });

      it('正常ケース: F Majorにおける増六和音（ドイツ増六 = D♭ major）の分析', () => {
        const fMajor = Key.major(PitchClass.F);

        // D♭ major chord (German augmented sixth) - F Majorではノンダイアトニック
        const dFlatNote = new Note(PitchClass.CSharp, 4); // C#/D♭
        const dFlatMajorChord = Chord.major(dFlatNote);
        const result = fMajor.analyzeChord(dFlatMajorChord);

        expect(result.isDiatonic).toBe(false);
        expect(result.chord).toBe(dFlatMajorChord);
        expect(result.perfectDegreeName).toMatch(
          /^([♯♭]?[ⅠⅡⅢⅣⅤⅥⅦⅠⅡⅢⅣⅤⅥⅦ]+[mMdimaugdim°+]?)(\s*\/\s*[♯♭]?[ⅠⅡⅢⅣⅤⅥⅦⅠⅡⅢⅣⅤⅥⅦ]+[mMdimaugdim°+]?)?$/
        );
        expect(result.flatDegreeName).toBeTypeOf('string');
        expect(result.sharpDegreeName).toBeTypeOf('string');
      });

      // 複数のキーでのノンダイアトニック和音テスト
      testContexts.forEach(({ name, context }) => {
        describe(`${name} - ノンダイアトニック和音`, () => {
          it('正常ケース: 完全に異なる調の和音をfalseと分析', () => {
            // トライトーン離れた調の和音（確実にノンダイアトニック）
            const distantFifthsIndex = (context.centerPitch.fifthsIndex + 6) % 12;
            const distantKey = Key.major(PitchClass.fromCircleOfFifths(distantFifthsIndex));
            const nonDiatonicChord = distantKey.diatonicChords[0];

            const result = context.analyzeChord(nonDiatonicChord);
            expect(result.isDiatonic).toBe(false);
            expect(result.chord).toBe(nonDiatonicChord);
            expect(result.perfectDegreeName).toMatch(
              /^([♯♭]?[ⅠⅡⅢⅣⅤⅥⅦⅠⅡⅢⅣⅤⅥⅦ]+[mMdimaugdim°+]?)(\s*\/\s*[♯♭]?[ⅠⅡⅢⅣⅤⅥⅦⅠⅡⅢⅣⅤⅥⅦ]+[mMdimaugdim°+]?)?$/
            );
          });

          it('正常ケース: 異なるクオリティの同じルート音和音をfalseと分析', () => {
            // 同じルート音だが異なるクオリティの和音（例：メジャーキーのI度をマイナー化）
            const firstDiatonicChord = context.diatonicChords[0];
            const rootPitch = firstDiatonicChord.rootNote._pitchClass;
            const rootNote = new Note(rootPitch, 4);

            // 元のクオリティと逆のクオリティで和音を作成
            const oppositeChord =
              firstDiatonicChord.quality.quality === 'major'
                ? Chord.minor(rootNote)
                : Chord.major(rootNote);

            const result = context.analyzeChord(oppositeChord);
            expect(result.isDiatonic).toBe(false);
            expect(result.chord).toBe(oppositeChord);
            expect(result.perfectDegreeName).toMatch(
              /^([♯♭]?[ⅠⅡⅢⅣⅤⅥⅦⅠⅡⅢⅣⅤⅥⅦ]+[mMdimaugdim°+]?)(\s*\/\s*[♯♭]?[ⅠⅡⅢⅣⅤⅥⅦⅠⅡⅢⅣⅤⅥⅦ]+[mMdimaugdim°+]?)?$/
            );
          });

          it('正常ケース: ノンダイアトニック和音の分析結果構造検証', () => {
            // 確実にノンダイアトニックな和音を作成（トライトーン離れた位置のメジャー和音）
            const chromaticRootIndex = (context.centerPitch.fifthsIndex + 6) % 12; // トライトーン離れた位置
            const chromaticRoot = PitchClass.fromCircleOfFifths(chromaticRootIndex);
            const chromaticNote = new Note(chromaticRoot, 4);
            const chromaticChord = Chord.major(chromaticNote);

            const result = context.analyzeChord(chromaticChord);

            // 基本構造の検証
            expect(result.chord).toBe(chromaticChord);
            expect(result.isDiatonic).toBe(false);
            expect(result.perfectDegreeName).toBeTypeOf('string');
            expect(result.flatDegreeName).toBeTypeOf('string');
            expect(result.sharpDegreeName).toBeTypeOf('string');
            expect(result.perfectDegreeName.length).toBeGreaterThan(0);
            expect(result.flatDegreeName.length).toBeGreaterThan(0);
            expect(result.sharpDegreeName.length).toBeGreaterThan(0);
          });
        });
      });
    });
  });

  describe('getDiatonicChordsInfo - ダイアトニック和音情報', () => {
    // 特定キーの完全一致テスト
    describe('特定キーの和音情報完全検証', () => {
      it('正常ケース: C Majorの和音情報を完全検証', () => {
        const cMajor = Key.major(PitchClass.C);
        const info = cMajor.getDiatonicChordsInfo();

        expect(info).toHaveLength(7);

        // I度 - C major
        expect(info[0].chord.getNameFor(cMajor)).toBe('C');
        expect(info[0].perfectDegreeName).toBe('Ⅰ');
        expect(info[0].isDiatonic).toBe(true);
        expect(info[0].flatDegreeName).toBe('Ⅰ');
        expect(info[0].sharpDegreeName).toBe('Ⅰ');

        // ii度 - D minor
        expect(info[1].chord.getNameFor(cMajor)).toBe('Dm');
        expect(info[1].perfectDegreeName).toBe('Ⅱm');
        expect(info[1].isDiatonic).toBe(true);

        // V度 - G major
        expect(info[4].chord.getNameFor(cMajor)).toBe('G');
        expect(info[4].perfectDegreeName).toBe('Ⅴ');
        expect(info[4].isDiatonic).toBe(true);

        // vii度 - B diminished
        expect(info[6].chord.getNameFor(cMajor)).toBe('Bdim');
        expect(info[6].perfectDegreeName).toBe('Ⅶ°');
        expect(info[6].isDiatonic).toBe(true);
      });

      it('正常ケース: A Minorの和音情報を完全検証', () => {
        const aMinor = Key.minor(PitchClass.A);
        const info = aMinor.getDiatonicChordsInfo();

        expect(info).toHaveLength(7);

        // i度 - A minor
        expect(info[0].chord.getNameFor(aMinor)).toBe('Am');
        expect(info[0].perfectDegreeName).toBe('Ⅰm');
        expect(info[0].isDiatonic).toBe(true);

        // ii度 - B diminished
        expect(info[1].chord.getNameFor(aMinor)).toBe('Bdim');
        expect(info[1].perfectDegreeName).toBe('Ⅱ°');
        expect(info[1].isDiatonic).toBe(true);

        // III度 - C major
        expect(info[2].chord.getNameFor(aMinor)).toBe('C');
        expect(info[2].perfectDegreeName).toBe('Ⅲ');
        expect(info[2].isDiatonic).toBe(true);
      });
    });

    // 共通機能テスト
    testContexts.forEach(({ name, context }) => {
      describe(`${name}`, () => {
        it('正常ケース: 7つのダイアトニック和音情報を返す', () => {
          const info = context.getDiatonicChordsInfo();
          expect(info).toHaveLength(7);
        });

        it('正常ケース: 各情報に必要なプロパティが完全に含まれている', () => {
          const info = context.getDiatonicChordsInfo();
          info.forEach(chordInfo => {
            expect(chordInfo.chord).toBeInstanceOf(Chord);
            expect(chordInfo.perfectDegreeName).toMatch(/^[♯♭]?[ⅠⅡⅢⅣⅤⅥⅦⅰⅱⅲⅳⅴⅵⅶ]+[mMdimaugdim°+]?$/);
            expect(chordInfo.isDiatonic).toBe(true);
            expect(chordInfo.flatDegreeName).toBeTypeOf('string');
            expect(chordInfo.sharpDegreeName).toBeTypeOf('string');
            expect(chordInfo.flatDegreeName.length).toBeGreaterThan(0);
            expect(chordInfo.sharpDegreeName.length).toBeGreaterThan(0);
          });
        });

        it('正常ケース: 和音情報とdiatonicChordsとanalyzeChordの一貫性を検証', () => {
          const info = context.getDiatonicChordsInfo();
          const chords = context.diatonicChords;

          expect(info.length).toBe(chords.length);

          info.forEach((chordInfo, index) => {
            const correspondingChord = chords[index];
            const directAnalysis = context.analyzeChord(correspondingChord);

            // getDiatonicChordsInfoとanalyzeChordの結果が一致することを確認
            expect(chordInfo.chord).toBe(correspondingChord);
            expect(chordInfo.perfectDegreeName).toBe(directAnalysis.perfectDegreeName);
            expect(chordInfo.isDiatonic).toBe(directAnalysis.isDiatonic);
            expect(chordInfo.flatDegreeName).toBe(directAnalysis.flatDegreeName);
            expect(chordInfo.sharpDegreeName).toBe(directAnalysis.sharpDegreeName);
          });
        });
      });
    });
  });

  describe('isDiatonicChord - ダイアトニックコード判定', () => {
    // 特定キーの完全検証
    describe('特定キーでの判定完全検証', () => {
      it('正常ケース: C Majorダイアトニック和音を正しく判定', () => {
        const cMajor = Key.major(PitchClass.C);

        // 自身のダイアトニック和音は全てtrue
        cMajor.diatonicChords.forEach(chord => {
          expect(cMajor.isDiatonicChord(chord)).toBe(true);
        });

        // 明確な非ダイアトニック和音（F# major）はfalse
        const fSharpMajor = Key.major(PitchClass.FSharp);
        expect(cMajor.isDiatonicChord(fSharpMajor.diatonicChords[0])).toBe(false);
      });

      it('正常ケース: A Minorダイアトニック和音を正しく判定', () => {
        const aMinor = Key.minor(PitchClass.A);

        // 自身のダイアトニック和音は全てtrue
        aMinor.diatonicChords.forEach(chord => {
          expect(aMinor.isDiatonicChord(chord)).toBe(true);
        });

        // 明確な非ダイアトニック和音（D# major）はfalse
        const dSharpMajor = Key.major(PitchClass.DSharp);
        expect(aMinor.isDiatonicChord(dSharpMajor.diatonicChords[0])).toBe(false);
      });
    });

    // 共通機能テスト
    testContexts.forEach(({ name, context }) => {
      describe(`${name}`, () => {
        it('正常ケース: 自身のダイアトニック和音を正しく判定', () => {
          context.diatonicChords.forEach(chord => {
            expect(context.isDiatonicChord(chord)).toBe(true);
          });
        });

        it('正常ケース: 遠い調の和音をfalseと判定', () => {
          // トライトーン離れた調の和音（確実に非ダイアトニック）
          const distantFifthsIndex = (context.centerPitch.fifthsIndex + 6) % 12;
          const distantKey = Key.major(PitchClass.fromCircleOfFifths(distantFifthsIndex));
          const nonDiatonicChord = distantKey.diatonicChords[0];

          expect(context.isDiatonicChord(nonDiatonicChord)).toBe(false);
        });
      });
    });

    // エッジケース
    describe('音楽理論的エッジケース', () => {
      it('正常ケース: 関係調の共通和音を正しく判定', () => {
        const cMajor = Key.major(PitchClass.C);
        const gMajor = Key.major(PitchClass.G);

        // C MajorのV度 = G major（G MajorのI度）は同じ和音
        const gMajorChord = gMajor.diatonicChords[0];
        expect(cMajor.isDiatonicChord(gMajorChord)).toBe(true);
      });

      it('正常ケース: 異なるモードの和音をfalseと判定', () => {
        const cMajor = Key.major(PitchClass.C);
        const cDorian = new ModalContext(PitchClass.C, ScalePattern.Dorian);

        // C majorとC dorianは異なるスケール
        expect(cMajor.isDiatonicChord(cDorian.diatonicChords[0])).toBe(false);
      });
    });
  });

  describe('toJSON - JSON出力', () => {
    testContexts.forEach(({ name, context }) => {
      describe(`${name}`, () => {
        it('正常ケース: JSON形式で正しく出力される', () => {
          const json = context.toJSON();

          // 基本的なプロパティの存在確認
          expect(json).toHaveProperty('shortName');
          expect(json).toHaveProperty('contextName');
          expect(json).toHaveProperty('fifthsIndex');
          expect(json).toHaveProperty('type');
          expect(json).toHaveProperty('isMajor');

          // 型の確認
          expect(typeof json.shortName).toBe('string');
          expect(typeof json.contextName).toBe('string');
          expect(typeof json.fifthsIndex).toBe('number');
          expect(typeof json.type).toBe('string');
          expect(typeof json.isMajor).toBe('boolean');
        });

        it('正常ケース: shortNameとcontextNameが適切に設定されている', () => {
          const json = context.toJSON();

          expect(json.shortName).toBe(context.shortName);
          expect(json.contextName).toBe(context.contextName);
        });

        it('正常ケース: fifthsIndexが中心音のfifthsIndexと一致', () => {
          const json = context.toJSON();

          expect(json.fifthsIndex).toBe(context.centerPitch.fifthsIndex);
        });

        it('正常ケース: JSON文字列化が可能', () => {
          const json = context.toJSON();

          expect(() => {
            JSON.stringify(json);
          }).not.toThrow();

          const jsonString = JSON.stringify(json);
          expect(typeof jsonString).toBe('string');
          expect(jsonString.length).toBeGreaterThan(0);
        });

        it('正常ケース: JSONから復元可能な形式', () => {
          const json = context.toJSON();
          const jsonString = JSON.stringify(json);
          const parsed = JSON.parse(jsonString);

          expect(parsed).toEqual(json);
          expect(parsed.shortName).toBe(json.shortName);
          expect(parsed.contextName).toBe(json.contextName);
          expect(parsed.fifthsIndex).toBe(json.fifthsIndex);
          expect(parsed.type).toBe(json.type);
          expect(parsed.isMajor).toBe(json.isMajor);
        });
      });
    });

    describe('型固有のプロパティ検証', () => {
      it('正常ケース: Keyタイプの場合type="key"とisMajorが適切に設定', () => {
        const cMajorKey = Key.major(PitchClass.C);
        const aMinorKey = Key.minor(PitchClass.A);

        const cMajorJson = cMajorKey.toJSON();
        expect(cMajorJson.type).toBe('key');
        expect(cMajorJson.isMajor).toBe(true);

        const aMinorJson = aMinorKey.toJSON();
        expect(aMinorJson.type).toBe('key');
        expect(aMinorJson.isMajor).toBe(false);
      });

      it('正常ケース: ModalContextタイプの場合type="modal"', () => {
        const modalContext = new ModalContext(PitchClass.C, ScalePattern.Dorian);

        const json = modalContext.toJSON();
        expect(json.type).toBe('modal');
        expect(json.isMajor).toBe(false); // デフォルト値
      });
    });

    describe('境界値とエッジケース', () => {
      it('正常ケース: 全ての五度圏ポジションでの出力', () => {
        for (let i = 0; i < 12; i++) {
          const key = Key.major(PitchClass.fromCircleOfFifths(i));
          const json = key.toJSON();

          expect(json.fifthsIndex).toBe(i);
          expect(json.type).toBe('key');
          expect(typeof json.shortName).toBe('string');
          expect(typeof json.contextName).toBe('string');
        }
      });

      it('正常ケース: 特殊文字を含む名前での出力', () => {
        // C# major (シャープを含む) - fifthsIndex: 7
        const cSharpMajor = Key.major(PitchClass.fromCircleOfFifths(7));
        const json = cSharpMajor.toJSON();

        expect(() => JSON.stringify(json)).not.toThrow();
        // シャープまたはフラットの記号のどちらかが含まれることを確認
        const hasSpecialChar = json.shortName.includes('#') || json.shortName.includes('♭');
        expect(hasSpecialChar).toBe(true);
      });

      it('正常ケース: AbstractMusicalContextの基本実装', () => {
        // AbstractMusicalContextを継承したクラスでtoJSONをテスト
        const testContext = new TestContext(
          PitchClass.C,
          new Scale(PitchClass.C, ScalePattern.Major)
        );

        const json = testContext.toJSON();

        // AbstractMusicalContextのデフォルト実装
        expect(json.type).toBe('modal'); // デフォルト値
        expect(json.isMajor).toBe(false); // デフォルト値
      });
    });

    describe('不変性の確認', () => {
      it('正常ケース: toJSONで返されるオブジェクトの変更が元オブジェクトに影響しない', () => {
        const context = testContexts[0].context;
        const json1 = context.toJSON();
        const json2 = context.toJSON();

        // 異なるオブジェクトインスタンス
        expect(json1).not.toBe(json2);
        expect(json1).toEqual(json2);

        // json1を変更してもjson2に影響しない
        json1.shortName = 'Modified';
        expect(json2.shortName).not.toBe('Modified');

        // 元のcontextから再度取得した結果も変更されていない
        const json3 = context.toJSON();
        expect(json3.shortName).toBe(json2.shortName);
        expect(json3.shortName).not.toBe('Modified');
      });
    });
  });
});
