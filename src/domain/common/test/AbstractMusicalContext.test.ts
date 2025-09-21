import { describe, it, expect } from 'vitest';
import { Key } from '../../key';
import { ModalContext } from '../../modal-context';
import { PitchClass } from '../PitchClass';
import { ScalePattern } from '../ScalePattern';
import { Chord } from '../../chord';
import type { AbstractMusicalContext } from '../AbstractMusicalContext';

/**
 * AbstractMusicalContextの共通機能をテストする
 * Key/ModalContextインスタンスを使って抽象クラスの実装を検証
 */
describe('AbstractMusicalContext', () => {
  // テスト用のインスタンス
  const cMajorKey = Key.fromCircleOfFifths(0, true); // C Major
  const dDorianModal = new ModalContext(
    PitchClass.fromCircleOfFifths(2), // D
    ScalePattern.Dorian
  );

  // テスト対象のインスタンス配列（両方の具象クラスをテスト）
  const testContexts: { name: string; context: AbstractMusicalContext }[] = [
    { name: 'Key (C Major)', context: cMajorKey },
    { name: 'ModalContext (D Dorian)', context: dDorianModal },
  ];

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
    testContexts.forEach(({ name, context }) => {
      describe(`${name}`, () => {
        it('7つのダイアトニック和音を返す', () => {
          const chords = context.diatonicChords;
          expect(chords).toHaveLength(7);
          chords.forEach(chord => {
            expect(chord).toBeInstanceOf(Chord);
          });
        });

        it('キャッシュ機能が動作する（同一インスタンスを返す）', () => {
          const chords1 = context.diatonicChords;
          const chords2 = context.diatonicChords;
          expect(chords1).toBe(chords2); // 同一インスタンスかどうか
        });

        it('結果がフリーズされている（immutable）', () => {
          const chords = context.diatonicChords;
          expect(Object.isFrozen(chords)).toBe(true);
        });
      });
    });
  });

  describe('analyzeChord - 和音分析機能', () => {
    testContexts.forEach(({ name, context }) => {
      describe(`${name}`, () => {
        it('ダイアトニック和音の分析ができる', () => {
          const firstChord = context.diatonicChords[0]; // I度の和音
          const result = context.analyzeChord(firstChord);

          expect(result.romanDegreeName).toBeTypeOf('string');
          expect(result.isDiatonic).toBe(true);
        });

        it('全ダイアトニック和音が正しく分析される', () => {
          context.diatonicChords.forEach((chord, _index) => {
            const result = context.analyzeChord(chord);
            expect(result.isDiatonic).toBe(true);
            expect(result.romanDegreeName).toBeTypeOf('string');
          });
        });
      });
    });
  });

  describe('getDiatonicChordsInfo - ダイアトニック和音情報', () => {
    testContexts.forEach(({ name, context }) => {
      describe(`${name}`, () => {
        it('7つのダイアトニック和音情報を返す', () => {
          const info = context.getDiatonicChordsInfo();
          expect(info).toHaveLength(7);
        });

        it('各情報に必要なプロパティが含まれている', () => {
          const info = context.getDiatonicChordsInfo();
          info.forEach(chordInfo => {
            expect(chordInfo.chord).toBeInstanceOf(Chord);
            expect(chordInfo.romanDegreeName).toBeTypeOf('string');
            expect(chordInfo.isDiatonic).toBe(true);
          });
        });
      });
    });
  });

  describe('analyzePitchClassInContext - 音名分析機能', () => {
    testContexts.forEach(({ name, context }) => {
      describe(`${name}`, () => {
        it('スケール内の音名を正しく分析する', () => {
          const scaleNotes = context.scale.getNotes();
          scaleNotes.forEach((note, _index) => {
            const result = context.analyzePitchClassInContext(note._pitchClass);
            // 度数は1-7の範囲内である
            expect(result.degree).toBeGreaterThanOrEqual(1);
            expect(result.degree).toBeLessThanOrEqual(7);
            expect(result.degreeName).toBeTypeOf('string');
            expect(result.degreeName.length).toBeGreaterThan(0);
          });
        });
      });
    });
  });
});
