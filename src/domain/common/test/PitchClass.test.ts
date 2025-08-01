import { describe, it, expect } from 'vitest';
import {
  PitchClass,
  type PitchClassName,
  type ChromaticIndexValue,
  type FifthsIndex,
  isValidChromaticIndex,
  isValidFifthsIndex,
} from '../PitchClass';

describe('PitchClass', () => {
  describe('音高クラス作成', () => {
    it('有効な音高クラス名でPitchClassを作成できる', () => {
      const pitchClass = new PitchClass('C');

      expect(pitchClass.name).toBe('C');
      expect(pitchClass.chromaticIndex).toBe(0);
    });

    it('すべての有効な音高クラス名で作成できる', () => {
      const validNames: PitchClassName[] = [
        'C',
        'C#',
        'D',
        'D#',
        'E',
        'F',
        'F#',
        'G',
        'G#',
        'A',
        'A#',
        'B',
      ];

      validNames.forEach((name, index) => {
        const pitchClass = new PitchClass(name);
        expect(pitchClass.name).toBe(name);
        expect(pitchClass.chromaticIndex).toBe(index);
      });
    });

    it('無効な音高クラス名でエラーが発生する', () => {
      expect(() => new PitchClass('X' as PitchClassName)).toThrow('Invalid pitch class name: X');
    });
  });

  describe('半音階インデックス', () => {
    it('正しい半音階インデックスを返す', () => {
      const testCases: Array<[PitchClassName, number]> = [
        ['C', 0],
        ['C#', 1],
        ['D', 2],
        ['D#', 3],
        ['E', 4],
        ['F', 5],
        ['F#', 6],
        ['G', 7],
        ['G#', 8],
        ['A', 9],
        ['A#', 10],
        ['B', 11],
      ];

      testCases.forEach(([name, expectedIndex]) => {
        const pitchClass = new PitchClass(name);
        expect(pitchClass.chromaticIndex).toBe(expectedIndex);
      });
    });

    it('半音階インデックスからPitchClassを作成できる', () => {
      for (let i = 0; i < 12; i++) {
        const pitchClass = PitchClass.fromChromaticIndex(i);
        expect(pitchClass.chromaticIndex).toBe(i);
      }
    });

    it('範囲外の半音階インデックスが正規化される', () => {
      expect(PitchClass.fromChromaticIndex(12).name).toBe('C'); // 12 -> 0
      expect(PitchClass.fromChromaticIndex(13).name).toBe('C#'); // 13 -> 1
      expect(PitchClass.fromChromaticIndex(-1).name).toBe('B'); // -1 -> 11
      expect(PitchClass.fromChromaticIndex(-2).name).toBe('A#'); // -2 -> 10
    });
  });

  describe('五度圏インデックス', () => {
    it('正しい五度圏インデックスを返す', () => {
      const testCases: Array<[PitchClassName, number]> = [
        ['C', 0],
        ['G', 1],
        ['D', 2],
        ['A', 3],
        ['E', 4],
        ['B', 5],
        ['F#', 6],
        ['C#', 7],
        ['G#', 8],
        ['D#', 9],
        ['A#', 10],
        ['F', 11],
      ];

      testCases.forEach(([name, expectedFifthsIndex]) => {
        const pitchClass = new PitchClass(name);
        expect(pitchClass.fifthsIndex).toBe(expectedFifthsIndex);
      });
    });

    it('五度圏インデックスからPitchClassを作成できる', () => {
      const expectedNames: PitchClassName[] = [
        'C',
        'G',
        'D',
        'A',
        'E',
        'B',
        'F#',
        'C#',
        'G#',
        'D#',
        'A#',
        'F',
      ];

      expectedNames.forEach((expectedName, fifthsIndex) => {
        const pitchClass = PitchClass.fromFifthsIndex(fifthsIndex);
        expect(pitchClass.name).toBe(expectedName);
      });
    });

    it('範囲外の五度圏インデックスが正規化される', () => {
      expect(PitchClass.fromFifthsIndex(12).name).toBe('C'); // 12 -> 0
      expect(PitchClass.fromFifthsIndex(13).name).toBe('G'); // 13 -> 1
      expect(PitchClass.fromFifthsIndex(-1).name).toBe('F'); // -1 -> 11
      expect(PitchClass.fromFifthsIndex(-2).name).toBe('A#'); // -2 -> 10
    });
  });

  describe('移調', () => {
    it('正の値で移調できる', () => {
      const c = new PitchClass('C');

      expect(c.transpose(0).name).toBe('C'); // 0半音
      expect(c.transpose(1).name).toBe('C#'); // 1半音
      expect(c.transpose(4).name).toBe('E'); // 長3度
      expect(c.transpose(7).name).toBe('G'); // 完全5度
      expect(c.transpose(12).name).toBe('C'); // オクターブ
    });

    it('負の値で移調できる（下降）', () => {
      const c = new PitchClass('C');

      expect(c.transpose(-1).name).toBe('B'); // 1半音下
      expect(c.transpose(-3).name).toBe('A'); // 短3度下
      expect(c.transpose(-7).name).toBe('F'); // 完全5度下
      expect(c.transpose(-12).name).toBe('C'); // オクターブ下
    });

    it('大きな値でも正しく正規化される', () => {
      const c = new PitchClass('C');

      expect(c.transpose(25).name).toBe('C#'); // 25 % 12 = 1
      expect(c.transpose(-25).name).toBe('B'); // -25 % 12 = -1 -> 11
    });
  });

  describe('音程計算', () => {
    it('他のPitchClassとの音程を計算できる', () => {
      const c = new PitchClass('C');
      const e = new PitchClass('E');
      const g = new PitchClass('G');
      const b = new PitchClass('B');

      expect(c.intervalTo(c)).toBe(0); // ユニゾン
      expect(c.intervalTo(e)).toBe(4); // 長3度
      expect(c.intervalTo(g)).toBe(7); // 完全5度
      expect(c.intervalTo(b)).toBe(11); // 長7度
      expect(e.intervalTo(c)).toBe(8); // 短6度（4の転回）
    });

    it('すべての組み合わせで正しい音程を計算する', () => {
      const c = new PitchClass('C');
      const allPitchClasses = PitchClass.getAllChromaticOrder();

      allPitchClasses.forEach((pitchClass, index) => {
        expect(c.intervalTo(pitchClass)).toBe(index);
      });
    });
  });

  describe('等価性判定', () => {
    it('同じ音高クラスは等価である', () => {
      const c1 = new PitchClass('C');
      const c2 = new PitchClass('C');

      expect(c1.equals(c2)).toBe(true);
    });

    it('異なる音高クラスは等価でない', () => {
      const c = new PitchClass('C');
      const d = new PitchClass('D');

      expect(c.equals(d)).toBe(false);
    });
  });

  describe('ファクトリーメソッド', () => {
    it('すべてのPitchClassを半音階順で取得できる', () => {
      const allChromaticOrder = PitchClass.getAllChromaticOrder();
      const expectedNames: PitchClassName[] = [
        'C',
        'C#',
        'D',
        'D#',
        'E',
        'F',
        'F#',
        'G',
        'G#',
        'A',
        'A#',
        'B',
      ];

      expect(allChromaticOrder).toHaveLength(12);
      allChromaticOrder.forEach((pitchClass, index) => {
        expect(pitchClass.name).toBe(expectedNames[index]);
      });
    });

    it('すべてのPitchClassを五度圏順で取得できる', () => {
      const allFifthsOrder = PitchClass.getAllFifthsOrder();
      const expectedNames: PitchClassName[] = [
        'C',
        'G',
        'D',
        'A',
        'E',
        'B',
        'F#',
        'C#',
        'G#',
        'D#',
        'A#',
        'F',
      ];

      expect(allFifthsOrder).toHaveLength(12);
      allFifthsOrder.forEach((pitchClass, index) => {
        expect(pitchClass.name).toBe(expectedNames[index]);
      });
    });
  });

  describe('シリアライゼーション', () => {
    it('JSONに変換できる', () => {
      const pitchClass = new PitchClass('F#');
      const json = pitchClass.toJSON();

      expect(json).toEqual({ name: 'F#' });
    });

    it('JSONから復元できる', () => {
      const json = { name: 'G#' as PitchClassName };
      const pitchClass = PitchClass.fromJSON(json);

      expect(pitchClass.name).toBe('G#');
      expect(pitchClass.chromaticIndex).toBe(8);
    });

    it('JSON変換と復元で同じPitchClassになる', () => {
      const original = new PitchClass('A#');
      const json = original.toJSON();
      const restored = PitchClass.fromJSON(json);

      expect(original.equals(restored)).toBe(true);
    });
  });

  describe('文字列表現', () => {
    it('toString()で音高クラス名を返す', () => {
      const pitchClass = new PitchClass('D#');
      expect(pitchClass.toString()).toBe('D#');
    });

    it('getDisplayName()で音高クラス名を返す', () => {
      const pitchClass = new PitchClass('B');
      expect(pitchClass.getDisplayName()).toBe('B');
    });
  });

  describe('セミトーン機能', () => {
    it('セミトーン数を取得できる（半音階インデックスと同値）', () => {
      const testCases: Array<[PitchClassName, ChromaticIndexValue]> = [
        ['C', 0],
        ['C#', 1],
        ['D', 2],
        ['D#', 3],
        ['E', 4],
        ['F', 5],
        ['F#', 6],
        ['G', 7],
        ['G#', 8],
        ['A', 9],
        ['A#', 10],
        ['B', 11],
      ];

      testCases.forEach(([name, expectedSemitones]) => {
        const pitchClass = new PitchClass(name);
        expect(pitchClass.semitones).toBe(expectedSemitones);
        expect(pitchClass.semitones).toBe(pitchClass.chromaticIndex);
      });
    });

    it('セミトーン数からPitchClassを作成できる', () => {
      for (let i = 0; i < 12; i++) {
        const pitchClass = PitchClass.fromSemitones(i);
        expect(pitchClass.semitones).toBe(i);
        expect(pitchClass.chromaticIndex).toBe(i);
      }
    });

    it('範囲外のセミトーン数が正規化される', () => {
      expect(PitchClass.fromSemitones(12).name).toBe('C'); // 12 -> 0
      expect(PitchClass.fromSemitones(13).name).toBe('C#'); // 13 -> 1
      expect(PitchClass.fromSemitones(-1).name).toBe('B'); // -1 -> 11
      expect(PitchClass.fromSemitones(-2).name).toBe('A#'); // -2 -> 10
    });
  });

  describe('バリデーション関数', () => {
    describe('isValidChromaticIndex', () => {
      it('有効な半音階インデックス（0-11）でtrueを返す', () => {
        const validIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        validIndices.forEach(index => {
          expect(isValidChromaticIndex(index)).toBe(true);
        });
      });

      it('無効な値でfalseを返す', () => {
        const invalidValues = [-1, 12, 13, 0.5, NaN, Infinity];
        invalidValues.forEach(value => {
          expect(isValidChromaticIndex(value)).toBe(false);
        });
      });

      it('型ガード機能が正しく動作する', () => {
        const testValue: number = 5;
        if (isValidChromaticIndex(testValue)) {
          const chromaticIndex: ChromaticIndexValue = testValue;
          expect(chromaticIndex).toBe(5);
        }
      });
    });

    describe('isValidFifthsIndex', () => {
      it('有効な五度圏インデックス（0-11）でtrueを返す', () => {
        const validIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        validIndices.forEach(index => {
          expect(isValidFifthsIndex(index)).toBe(true);
        });
      });

      it('無効な値でfalseを返す', () => {
        const invalidValues = [-1, 12, 13, 0.5, NaN, Infinity];
        invalidValues.forEach(value => {
          expect(isValidFifthsIndex(value)).toBe(false);
        });
      });

      it('型ガード機能が正しく動作する', () => {
        const testValue: number = 7;
        if (isValidFifthsIndex(testValue)) {
          const fifthsIndex: FifthsIndex = testValue;
          expect(fifthsIndex).toBe(7);
        }
      });
    });
  });
});
