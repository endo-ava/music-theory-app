import { describe, test, expect } from 'vitest';
import { getMusicColorKey, getMusicColorVariable } from '../musicColorSystem';
import { Key, PitchClass, ScalePattern } from '@/domain';
import { ModalContext } from '@/domain/modal-context';
import type { KeyDTO } from '@/domain';

describe('keyColorUtils', () => {
  describe('getMusicColorKey', () => {
    describe('Major/Minor (Key)', () => {
      test('正常ケース: C Majorで正確なCSS変数名を生成する', () => {
        const cMajorKey = Key.fromCircleOfFifths(0, true);
        const result = getMusicColorKey(cMajorKey);
        expect(result).toBe('key-c-ionian');
      });

      test('正常ケース: A Minorで正確なCSS変数名を生成する', () => {
        const aMinorKey = Key.fromCircleOfFifths(3, false);
        const result = getMusicColorKey(aMinorKey);
        expect(result).toBe('key-a-aeolian');
      });

      test('正常ケース: F# Majorで正確なCSS変数名を生成する', () => {
        const fsharpMajorKey = Key.fromCircleOfFifths(6, true);
        const result = getMusicColorKey(fsharpMajorKey);
        expect(result).toBe('key-fsharp-ionian');
      });
    });

    describe('全7モード対応 (ModalContext)', () => {
      test('Lydian モード: F Lydian', () => {
        const fLydian = new ModalContext(PitchClass.F, ScalePattern.Lydian);
        const result = getMusicColorKey(fLydian);
        expect(result).toBe('key-f-lydian');
      });

      test('Ionian モード: C Ionian (= C Major)', () => {
        const cIonian = new ModalContext(PitchClass.C, ScalePattern.Major);
        const result = getMusicColorKey(cIonian);
        expect(result).toBe('key-c-ionian');
      });

      test('Mixolydian モード: G Mixolydian', () => {
        const gMixolydian = new ModalContext(PitchClass.G, ScalePattern.Mixolydian);
        const result = getMusicColorKey(gMixolydian);
        expect(result).toBe('key-g-mixolydian');
      });

      test('Dorian モード: D Dorian', () => {
        const dDorian = new ModalContext(PitchClass.D, ScalePattern.Dorian);
        const result = getMusicColorKey(dDorian);
        expect(result).toBe('key-d-dorian');
      });

      test('Aeolian モード: A Aeolian (= A Minor)', () => {
        const aAeolian = new ModalContext(PitchClass.A, ScalePattern.Aeolian);
        const result = getMusicColorKey(aAeolian);
        expect(result).toBe('key-a-aeolian');
      });

      test('Phrygian モード: E Phrygian', () => {
        const ePhrygian = new ModalContext(PitchClass.E, ScalePattern.Phrygian);
        const result = getMusicColorKey(ePhrygian);
        expect(result).toBe('key-e-phrygian');
      });

      test('Locrian モード: B Locrian', () => {
        const bLocrian = new ModalContext(PitchClass.B, ScalePattern.Locrian);
        const result = getMusicColorKey(bLocrian);
        expect(result).toBe('key-b-locrian');
      });
    });

    describe('シャープ記号を含む音名', () => {
      test('C# Dorian でシャープ記号を正しく処理', () => {
        const cSharpDorian = new ModalContext(PitchClass.CSharp, ScalePattern.Dorian);
        const result = getMusicColorKey(cSharpDorian);
        expect(result).toBe('key-csharp-dorian');
      });

      test('F# Lydian でシャープ記号を正しく処理', () => {
        const fSharpLydian = new ModalContext(PitchClass.FSharp, ScalePattern.Lydian);
        const result = getMusicColorKey(fSharpLydian);
        expect(result).toBe('key-fsharp-lydian');
      });
    });
  });

  describe('getMusicColorVariable', () => {
    describe('Key型の処理', () => {
      test('正常ケース: C Major Key → var(--color-key-c-ionian)', () => {
        const cMajorKey = Key.fromCircleOfFifths(0, true);
        const result = getMusicColorVariable(cMajorKey);
        expect(result).toBe('var(--color-key-c-ionian)');
      });

      test('正常ケース: A Minor Key → var(--color-key-a-aeolian)', () => {
        const aMinorKey = Key.fromCircleOfFifths(3, false);
        const result = getMusicColorVariable(aMinorKey);
        expect(result).toBe('var(--color-key-a-aeolian)');
      });

      test('正常ケース: F# Major Key → var(--color-key-fsharp-ionian)', () => {
        const fSharpMajorKey = Key.fromCircleOfFifths(6, true);
        const result = getMusicColorVariable(fSharpMajorKey);
        expect(result).toBe('var(--color-key-fsharp-ionian)');
      });
    });

    describe('KeyDTO型の処理', () => {
      test('正常ケース: C Major KeyDTO → var(--color-key-c-ionian)', () => {
        const cMajorDTO: KeyDTO = {
          shortName: 'C',
          contextName: 'C Major',
          fifthsIndex: 0,
          type: 'key',
          isMajor: true,
        };
        const result = getMusicColorVariable(cMajorDTO);
        expect(result).toBe('var(--color-key-c-ionian)');
      });

      test('正常ケース: A Minor KeyDTO → var(--color-key-a-aeolian)', () => {
        const aMinorDTO: KeyDTO = {
          shortName: 'Am',
          contextName: 'A Minor',
          fifthsIndex: 3,
          type: 'key',
          isMajor: false,
        };
        const result = getMusicColorVariable(aMinorDTO);
        expect(result).toBe('var(--color-key-a-aeolian)');
      });

      test('正常ケース: D Major KeyDTO → var(--color-key-d-ionian)', () => {
        const dMajorDTO: KeyDTO = {
          shortName: 'D',
          contextName: 'D Major',
          fifthsIndex: 2,
          type: 'key',
          isMajor: true,
        };
        const result = getMusicColorVariable(dMajorDTO);
        expect(result).toBe('var(--color-key-d-ionian)');
      });
    });

    describe('ModalContext型の処理', () => {
      test('正常ケース: D Dorian → var(--color-key-d-dorian)', () => {
        const dDorian = new ModalContext(PitchClass.D, ScalePattern.Dorian);
        const result = getMusicColorVariable(dDorian);
        expect(result).toBe('var(--color-key-d-dorian)');
      });

      test('正常ケース: F Lydian → var(--color-key-f-lydian)', () => {
        const fLydian = new ModalContext(PitchClass.F, ScalePattern.Lydian);
        const result = getMusicColorVariable(fLydian);
        expect(result).toBe('var(--color-key-f-lydian)');
      });

      test('正常ケース: E Phrygian → var(--color-key-e-phrygian)', () => {
        const ePhrygian = new ModalContext(PitchClass.E, ScalePattern.Phrygian);
        const result = getMusicColorVariable(ePhrygian);
        expect(result).toBe('var(--color-key-e-phrygian)');
      });
    });

    describe('null処理（フォールバック）', () => {
      test('正常ケース: null → var(--border)', () => {
        const result = getMusicColorVariable(null);
        expect(result).toBe('var(--border)');
      });
    });

    describe('型判定ロジックの検証', () => {
      test('AbstractMusicalContextのインスタンス（Key）を正しく判定', () => {
        const key = Key.fromCircleOfFifths(1, true);
        const result = getMusicColorVariable(key);
        // Keyは内部でIMusicalContextとして扱われる
        expect(result).toBe('var(--color-key-g-ionian)');
      });

      test('AbstractMusicalContextのインスタンス（ModalContext）を正しく判定', () => {
        const modal = new ModalContext(PitchClass.G, ScalePattern.Mixolydian);
        const result = getMusicColorVariable(modal);
        // ModalContextは内部でIMusicalContextとして扱われる
        expect(result).toBe('var(--color-key-g-mixolydian)');
      });

      test('KeyDTOを正しく判定してKey変換', () => {
        const dto: KeyDTO = {
          shortName: 'Bm',
          contextName: 'B Minor',
          fifthsIndex: 5,
          type: 'key',
          isMajor: false,
        };
        const result = getMusicColorVariable(dto);
        // KeyDTOはKey.fromCircleOfFifthsでKeyに変換される
        // fifthsIndex=5, isMajor=false → B minor (Aeolian)
        expect(result).toBe('var(--color-key-b-aeolian)');
      });
    });
  });
});
