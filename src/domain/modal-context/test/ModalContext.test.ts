import { describe, test, expect } from 'vitest';
import { ModalContext } from '../index';
import { PitchClass, ScalePattern } from '@/domain';

describe('ModalContext', () => {
  describe('constructor', () => {
    describe('正常ケース: 全7モードの親Key計算', () => {
      test('C Ionian (1st mode) → 親Key: C Major, modeOf: 1', () => {
        const modal = new ModalContext(PitchClass.C, ScalePattern.Major);
        expect(modal.parentKey.centerPitch).toBe(PitchClass.C);
        expect(modal.parentKey.isMajor).toBe(true);
        expect(modal.modeOf).toBe(1);
      });

      test('D Dorian (2nd mode) → 親Key: C Major, modeOf: 2', () => {
        const modal = new ModalContext(PitchClass.D, ScalePattern.Dorian);
        expect(modal.parentKey.centerPitch).toBe(PitchClass.C);
        expect(modal.parentKey.isMajor).toBe(true);
        expect(modal.modeOf).toBe(2);
      });

      test('E Phrygian (3rd mode) → 親Key: C Major, modeOf: 3', () => {
        const modal = new ModalContext(PitchClass.E, ScalePattern.Phrygian);
        expect(modal.parentKey.centerPitch).toBe(PitchClass.C);
        expect(modal.parentKey.isMajor).toBe(true);
        expect(modal.modeOf).toBe(3);
      });

      test('F Lydian (4th mode) → 親Key: C Major, modeOf: 4', () => {
        const modal = new ModalContext(PitchClass.F, ScalePattern.Lydian);
        expect(modal.parentKey.centerPitch).toBe(PitchClass.C);
        expect(modal.parentKey.isMajor).toBe(true);
        expect(modal.modeOf).toBe(4);
      });

      test('G Mixolydian (5th mode) → 親Key: C Major, modeOf: 5', () => {
        const modal = new ModalContext(PitchClass.G, ScalePattern.Mixolydian);
        expect(modal.parentKey.centerPitch).toBe(PitchClass.C);
        expect(modal.parentKey.isMajor).toBe(true);
        expect(modal.modeOf).toBe(5);
      });

      test('A Aeolian (6th mode) → 親Key: C Major, modeOf: 6', () => {
        const modal = new ModalContext(PitchClass.A, ScalePattern.Aeolian);
        expect(modal.parentKey.centerPitch).toBe(PitchClass.C);
        expect(modal.parentKey.isMajor).toBe(true);
        expect(modal.modeOf).toBe(6);
      });

      test('B Locrian (7th mode) → 親Key: C Major, modeOf: 7', () => {
        const modal = new ModalContext(PitchClass.B, ScalePattern.Locrian);
        expect(modal.parentKey.centerPitch).toBe(PitchClass.C);
        expect(modal.parentKey.isMajor).toBe(true);
        expect(modal.modeOf).toBe(7);
      });
    });

    describe('正常ケース: シャープ系モードの親Key計算', () => {
      test('F# Lydian → 親Key: C# Major', () => {
        const modal = new ModalContext(PitchClass.FSharp, ScalePattern.Lydian);
        expect(modal.parentKey.centerPitch).toBe(PitchClass.CSharp);
        expect(modal.parentKey.isMajor).toBe(true);
        expect(modal.modeOf).toBe(4);
      });

      test('C# Dorian → 親Key: B Major', () => {
        const modal = new ModalContext(PitchClass.CSharp, ScalePattern.Dorian);
        expect(modal.parentKey.centerPitch).toBe(PitchClass.B);
        expect(modal.parentKey.isMajor).toBe(true);
        expect(modal.modeOf).toBe(2);
      });

      test('G# Phrygian → 親Key: E Major', () => {
        const modal = new ModalContext(PitchClass.GSharp, ScalePattern.Phrygian);
        expect(modal.parentKey.centerPitch).toBe(PitchClass.E);
        expect(modal.parentKey.isMajor).toBe(true);
        expect(modal.modeOf).toBe(3);
      });
    });

    describe('異常ケース: メジャーモード以外のパターンを拒否', () => {
      test('Harmonic Minor を渡すとエラー', () => {
        expect(() => {
          new ModalContext(PitchClass.A, ScalePattern.HarmonicMinor);
        }).toThrow('ModalContext requires a mode derived from Major scale');
      });
    });
  });

  describe('getRelativeMajorTonic', () => {
    test('正常ケース: D Dorian → C (相対メジャートニック)', () => {
      const modal = new ModalContext(PitchClass.D, ScalePattern.Dorian);
      const tonic = modal.getRelativeMajorTonic();
      expect(tonic).toBe(PitchClass.C);
    });

    test('正常ケース: E Phrygian → C', () => {
      const modal = new ModalContext(PitchClass.E, ScalePattern.Phrygian);
      const tonic = modal.getRelativeMajorTonic();
      expect(tonic).toBe(PitchClass.C);
    });

    test('正常ケース: F# Lydian → C# (シャープ系)', () => {
      const modal = new ModalContext(PitchClass.FSharp, ScalePattern.Lydian);
      const tonic = modal.getRelativeMajorTonic();
      expect(tonic).toBe(PitchClass.CSharp);
    });

    test('正常ケース: A Aeolian → C (Natural Minorと同等)', () => {
      const modal = new ModalContext(PitchClass.A, ScalePattern.Aeolian);
      const tonic = modal.getRelativeMajorTonic();
      expect(tonic).toBe(PitchClass.C);
    });

    test('正常ケース: C Ionian → C (自分自身)', () => {
      const modal = new ModalContext(PitchClass.C, ScalePattern.Major);
      const tonic = modal.getRelativeMajorTonic();
      expect(tonic).toBe(PitchClass.C);
    });
  });

  describe('keySignature (調号の正確性)', () => {
    test('D Dorian → fifthsIndex = 0（親がC Major、調号なし）', () => {
      const modal = new ModalContext(PitchClass.D, ScalePattern.Dorian);
      expect(modal.keySignature.fifthsIndex).toBe(0);
      expect(modal.keySignature.primaryAccidental).toBeNull();
    });

    test('E Dorian → fifthsIndex = 2（親がD Major、2シャープ）', () => {
      const modal = new ModalContext(PitchClass.E, ScalePattern.Dorian);
      // D Majorは2シャープ（F#, C#）
      expect(modal.keySignature.fifthsIndex).toBe(2);
      expect(modal.keySignature.accidentals.size).toBe(2);
    });

    test('F Lydian → fifthsIndex = 0（親がC Major、調号なし）', () => {
      const modal = new ModalContext(PitchClass.F, ScalePattern.Lydian);
      expect(modal.keySignature.fifthsIndex).toBe(0);
      expect(modal.keySignature.primaryAccidental).toBeNull();
    });

    test('G Mixolydian → fifthsIndex = 0（親がC Major、調号なし）', () => {
      const modal = new ModalContext(PitchClass.G, ScalePattern.Mixolydian);
      expect(modal.keySignature.fifthsIndex).toBe(0);
      expect(modal.keySignature.primaryAccidental).toBeNull();
    });

    test('B Locrian → fifthsIndex = 0（親がC Major、調号なし）', () => {
      const modal = new ModalContext(PitchClass.B, ScalePattern.Locrian);
      expect(modal.keySignature.fifthsIndex).toBe(0);
      expect(modal.keySignature.primaryAccidental).toBeNull();
    });
  });

  describe('centerPitch と scale プロパティ', () => {
    test('centerPitch が正しく設定される', () => {
      const modal = new ModalContext(PitchClass.D, ScalePattern.Dorian);
      expect(modal.centerPitch).toBe(PitchClass.D);
    });

    test('scale.pattern が正しく設定される', () => {
      const modal = new ModalContext(PitchClass.E, ScalePattern.Phrygian);
      expect(modal.scale.pattern).toBe(ScalePattern.Phrygian);
    });

    test('scale.root が centerPitch と一致する', () => {
      const modal = new ModalContext(PitchClass.F, ScalePattern.Lydian);
      expect(modal.scale.root).toBe(PitchClass.F);
      expect(modal.scale.root).toBe(modal.centerPitch);
    });
  });
});
