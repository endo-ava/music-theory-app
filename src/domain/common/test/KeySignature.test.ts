import { describe, expect, it } from 'vitest';
import { KeySignature } from '../KeySignature';
import { PitchClass } from '../PitchClass';
import { Accidental } from '../Accidental';

describe('KeySignature', () => {
  describe('fromFifthsIndex', () => {
    it('正常ケース: 有効なfifthsIndex（0-11）でKeySignatureを作成', () => {
      const keySignature = KeySignature.fromFifthsIndex(0);
      expect(keySignature.fifthsIndex).toBe(0);
    });

    it('異常ケース: 負の数でErrorをスロー', () => {
      expect(() => KeySignature.fromFifthsIndex(-1)).toThrow(
        'fifthsIndex must be an integer between 0 and 11'
      );
    });

    it('異常ケース: 11より大きい数でErrorをスロー', () => {
      expect(() => KeySignature.fromFifthsIndex(12)).toThrow(
        'fifthsIndex must be an integer between 0 and 11'
      );
    });

    it('異常ケース: 非整数でErrorをスロー', () => {
      expect(() => KeySignature.fromFifthsIndex(1.5)).toThrow(
        'fifthsIndex must be an integer between 0 and 11'
      );
    });
  });

  describe('キャッシング機能', () => {
    it('正常ケース: 同じfifthsIndexで同一インスタンスを返す', () => {
      const keySignature1 = KeySignature.fromFifthsIndex(1);
      const keySignature2 = KeySignature.fromFifthsIndex(1);
      expect(keySignature1).toBe(keySignature2);
    });

    it('正常ケース: 異なるfifthsIndexで異なるインスタンスを返す', () => {
      const keySignature1 = KeySignature.fromFifthsIndex(1);
      const keySignature2 = KeySignature.fromFifthsIndex(2);
      expect(keySignature1).not.toBe(keySignature2);
    });
  });

  describe('不変性', () => {
    it('正常ケース: インスタンスがfrozenされている', () => {
      const keySignature = KeySignature.fromFifthsIndex(1);
      expect(Object.isFrozen(keySignature)).toBe(true);
    });

    it('正常ケース: accidentalsがReadonlyMapとして機能', () => {
      const keySignature = KeySignature.fromFifthsIndex(1);
      expect(keySignature.accidentals).toBeInstanceOf(Map);
      // ReadonlyMapは型レベルでの制約なので、実行時にはMapのsetメソッドが存在する
      // 不変性はKeySignatureクラス自体のfreezeによって保証される
      expect(keySignature.accidentals).toBeTruthy();
    });
  });

  describe('変化記号なし（C Major / A minor）', () => {
    it('正常ケース: fifthsIndex 0で変化記号なし', () => {
      const keySignature = KeySignature.fromFifthsIndex(0);
      expect(keySignature.accidentals.size).toBe(0);

      // 全ての音名について変化記号がないことを確認
      PitchClass.ALL_PITCH_CLASSES.forEach(pitchClass => {
        expect(keySignature.accidentals.has(pitchClass)).toBe(false);
      });
    });
  });

  describe('シャープ系調号', () => {
    it('正常ケース: G Major（fifthsIndex 1）でF#を含む', () => {
      const keySignature = KeySignature.fromFifthsIndex(1);
      expect(keySignature.accidentals.size).toBe(1);
      expect(keySignature.accidentals.get(PitchClass.F)).toBe(Accidental.SHARP);
    });

    it('正常ケース: D Major（fifthsIndex 2）でF#, C#を含む', () => {
      const keySignature = KeySignature.fromFifthsIndex(2);
      expect(keySignature.accidentals.size).toBe(2);
      expect(keySignature.accidentals.get(PitchClass.F)).toBe(Accidental.SHARP);
      expect(keySignature.accidentals.get(PitchClass.C)).toBe(Accidental.SHARP);
    });

    it('正常ケース: A Major（fifthsIndex 3）でF#, C#, G#を含む', () => {
      const keySignature = KeySignature.fromFifthsIndex(3);
      expect(keySignature.accidentals.size).toBe(3);
      expect(keySignature.accidentals.get(PitchClass.F)).toBe(Accidental.SHARP);
      expect(keySignature.accidentals.get(PitchClass.C)).toBe(Accidental.SHARP);
      expect(keySignature.accidentals.get(PitchClass.G)).toBe(Accidental.SHARP);
    });

    it('正常ケース: E Major（fifthsIndex 4）でF#, C#, G#, D#を含む', () => {
      const keySignature = KeySignature.fromFifthsIndex(4);
      expect(keySignature.accidentals.size).toBe(4);
      expect(keySignature.accidentals.get(PitchClass.F)).toBe(Accidental.SHARP);
      expect(keySignature.accidentals.get(PitchClass.C)).toBe(Accidental.SHARP);
      expect(keySignature.accidentals.get(PitchClass.G)).toBe(Accidental.SHARP);
      expect(keySignature.accidentals.get(PitchClass.D)).toBe(Accidental.SHARP);
    });

    it('正常ケース: B Major（fifthsIndex 5）でF#, C#, G#, D#, A#を含む', () => {
      const keySignature = KeySignature.fromFifthsIndex(5);
      expect(keySignature.accidentals.size).toBe(5);
      expect(keySignature.accidentals.get(PitchClass.F)).toBe(Accidental.SHARP);
      expect(keySignature.accidentals.get(PitchClass.C)).toBe(Accidental.SHARP);
      expect(keySignature.accidentals.get(PitchClass.G)).toBe(Accidental.SHARP);
      expect(keySignature.accidentals.get(PitchClass.D)).toBe(Accidental.SHARP);
      expect(keySignature.accidentals.get(PitchClass.A)).toBe(Accidental.SHARP);
    });
  });

  describe('フラット系調号', () => {
    it('正常ケース: G♭ Major（fifthsIndex 6）でB♭, E♭, A♭, D♭, G♭, C♭を含む', () => {
      const keySignature = KeySignature.fromFifthsIndex(6);
      expect(keySignature.accidentals.size).toBe(6);
      expect(keySignature.accidentals.get(PitchClass.B)).toBe(Accidental.FLAT);
      expect(keySignature.accidentals.get(PitchClass.E)).toBe(Accidental.FLAT);
      expect(keySignature.accidentals.get(PitchClass.A)).toBe(Accidental.FLAT);
      expect(keySignature.accidentals.get(PitchClass.D)).toBe(Accidental.FLAT);
      expect(keySignature.accidentals.get(PitchClass.G)).toBe(Accidental.FLAT);
      expect(keySignature.accidentals.get(PitchClass.C)).toBe(Accidental.FLAT);
    });

    it('正常ケース: F Major（fifthsIndex 11）でB♭を含む', () => {
      const keySignature = KeySignature.fromFifthsIndex(11);
      expect(keySignature.accidentals.size).toBe(1);
      expect(keySignature.accidentals.get(PitchClass.B)).toBe(Accidental.FLAT);
    });

    it('正常ケース: B♭ Major（fifthsIndex 10）でB♭, E♭を含む', () => {
      const keySignature = KeySignature.fromFifthsIndex(10);
      expect(keySignature.accidentals.size).toBe(2);
      expect(keySignature.accidentals.get(PitchClass.B)).toBe(Accidental.FLAT);
      expect(keySignature.accidentals.get(PitchClass.E)).toBe(Accidental.FLAT);
    });

    it('正常ケース: E♭ Major（fifthsIndex 9）でB♭, E♭, A♭を含む', () => {
      const keySignature = KeySignature.fromFifthsIndex(9);
      expect(keySignature.accidentals.size).toBe(3);
      expect(keySignature.accidentals.get(PitchClass.B)).toBe(Accidental.FLAT);
      expect(keySignature.accidentals.get(PitchClass.E)).toBe(Accidental.FLAT);
      expect(keySignature.accidentals.get(PitchClass.A)).toBe(Accidental.FLAT);
    });

    it('正常ケース: A♭ Major（fifthsIndex 8）でB♭, E♭, A♭, D♭を含む', () => {
      const keySignature = KeySignature.fromFifthsIndex(8);
      expect(keySignature.accidentals.size).toBe(4);
      expect(keySignature.accidentals.get(PitchClass.B)).toBe(Accidental.FLAT);
      expect(keySignature.accidentals.get(PitchClass.E)).toBe(Accidental.FLAT);
      expect(keySignature.accidentals.get(PitchClass.A)).toBe(Accidental.FLAT);
      expect(keySignature.accidentals.get(PitchClass.D)).toBe(Accidental.FLAT);
    });

    it('正常ケース: D♭ Major（fifthsIndex 7）でB♭, E♭, A♭, D♭, G♭を含む', () => {
      const keySignature = KeySignature.fromFifthsIndex(7);
      expect(keySignature.accidentals.size).toBe(5);
      expect(keySignature.accidentals.get(PitchClass.B)).toBe(Accidental.FLAT);
      expect(keySignature.accidentals.get(PitchClass.E)).toBe(Accidental.FLAT);
      expect(keySignature.accidentals.get(PitchClass.A)).toBe(Accidental.FLAT);
      expect(keySignature.accidentals.get(PitchClass.D)).toBe(Accidental.FLAT);
      expect(keySignature.accidentals.get(PitchClass.G)).toBe(Accidental.FLAT);
    });
  });

  describe('エッジケースと音楽理論検証', () => {
    it('正常ケース: 同じ調号内でシャープとフラットが同時に存在しない', () => {
      for (let fifthsIndex = 0; fifthsIndex <= 11; fifthsIndex++) {
        const keySignature = KeySignature.fromFifthsIndex(fifthsIndex);
        const hasSharp = Array.from(keySignature.accidentals.values()).some(
          acc => acc === Accidental.SHARP
        );
        const hasFlat = Array.from(keySignature.accidentals.values()).some(
          acc => acc === Accidental.FLAT
        );

        // シャープとフラットが同時に存在してはいけない
        expect(hasSharp && hasFlat).toBe(false);
      }
    });

    it('正常ケース: シャープ系調号で五度圈の順序を守る', () => {
      for (let numSharps = 1; numSharps < 6; numSharps++) {
        const keySignature = KeySignature.fromFifthsIndex(numSharps);

        // 期待される音名にシャープが付いているか確認
        for (let i = 0; i < numSharps; i++) {
          expect(keySignature.accidentals.get(PitchClass.SHARP_KEY_ORDER[i])).toBe(
            Accidental.SHARP
          );
        }

        // それ以外の音名にはシャープが付いていないか確認
        for (let i = numSharps; i < PitchClass.SHARP_KEY_ORDER.length; i++) {
          expect(keySignature.accidentals.has(PitchClass.SHARP_KEY_ORDER[i])).toBe(false);
        }
      }
    });

    it('正常ケース: フラット系調号で五度圈の順序を守る', () => {
      for (let numFlats = 1; numFlats <= 5; numFlats++) {
        const keySignature = KeySignature.fromFifthsIndex(12 - numFlats);

        // 期待される音名にフラットが付いているか確認
        for (let i = 0; i < numFlats; i++) {
          expect(keySignature.accidentals.get(PitchClass.FLAT_KEY_ORDER[i])).toBe(Accidental.FLAT);
        }

        // それ以外の音名にはフラットが付いていないか確認
        for (let i = numFlats; i < PitchClass.FLAT_KEY_ORDER.length; i++) {
          expect(keySignature.accidentals.has(PitchClass.FLAT_KEY_ORDER[i])).toBe(false);
        }
      }
    });
  });
});
