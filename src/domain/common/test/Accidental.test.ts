import { describe, it, expect } from 'vitest';
import { Accidental } from '../Accidental';

describe('Accidental', () => {
  describe('基本プロパティ', () => {
    it('正常ケース: sharp変化記号の基本プロパティ', () => {
      const sharp = new Accidental('sharp');

      expect(sharp.value).toBe('sharp');
      expect(sharp.getSymbol()).toBe('♯');
    });

    it('正常ケース: flat変化記号の基本プロパティ', () => {
      const flat = new Accidental('flat');

      expect(flat.value).toBe('flat');
      expect(flat.getSymbol()).toBe('♭');
    });

    it('正常ケース: natural変化記号の基本プロパティ', () => {
      const natural = new Accidental('natural');

      expect(natural.value).toBe('natural');
      expect(natural.getSymbol()).toBe('');
    });
  });

  describe('静的インスタンス', () => {
    it('正常ケース: SHARP静的インスタンス', () => {
      const sharp = Accidental.SHARP;

      expect(sharp.value).toBe('sharp');
      expect(sharp.getSymbol()).toBe('♯');
    });

    it('正常ケース: FLAT静的インスタンス', () => {
      const flat = Accidental.FLAT;

      expect(flat.value).toBe('flat');
      expect(flat.getSymbol()).toBe('♭');
    });

    it('正常ケース: NATURAL静的インスタンス', () => {
      const natural = Accidental.NATURAL;

      expect(natural.value).toBe('natural');
      expect(natural.getSymbol()).toBe('');
    });
  });

  describe('静的インスタンスの一意性', () => {
    it('正常ケース: 静的インスタンスが常に同じ参照を返す', () => {
      expect(Accidental.SHARP).toBe(Accidental.SHARP);
      expect(Accidental.FLAT).toBe(Accidental.FLAT);
      expect(Accidental.NATURAL).toBe(Accidental.NATURAL);
    });

    it('正常ケース: 新しいインスタンスとは異なる参照', () => {
      const newSharp = new Accidental('sharp');
      const newFlat = new Accidental('flat');
      const newNatural = new Accidental('natural');

      expect(Accidental.SHARP).not.toBe(newSharp);
      expect(Accidental.FLAT).not.toBe(newFlat);
      expect(Accidental.NATURAL).not.toBe(newNatural);
    });
  });

  describe('getSymbol メソッド', () => {
    it('正常ケース: sharp記号の正しい文字', () => {
      const sharp = new Accidental('sharp');
      expect(sharp.getSymbol()).toBe('♯');
    });

    it('正常ケース: flat記号の正しい文字', () => {
      const flat = new Accidental('flat');
      expect(flat.getSymbol()).toBe('♭');
    });

    it('正常ケース: natural記号は空文字', () => {
      const natural = new Accidental('natural');
      expect(natural.getSymbol()).toBe('');
    });

    it('正常ケース: 記号文字列の型確認', () => {
      const testCases = ['sharp', 'flat', 'natural'] as const;

      testCases.forEach(type => {
        const accidental = new Accidental(type);
        const symbol = accidental.getSymbol();

        expect(typeof symbol).toBe('string');
        expect(symbol.length).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe('音楽理論的検証', () => {
    it('正常ケース: 全ての変化記号タイプが適切に処理される', () => {
      const testCases = [
        { type: 'sharp', expectedSymbol: '♯' },
        { type: 'flat', expectedSymbol: '♭' },
        { type: 'natural', expectedSymbol: '' },
      ] as const;

      testCases.forEach(({ type, expectedSymbol }) => {
        const accidental = new Accidental(type);
        expect(accidental.value).toBe(type);
        expect(accidental.getSymbol()).toBe(expectedSymbol);
      });
    });

    it('正常ケース: 変化記号の表記が音楽記号として正しい', () => {
      // 実際の音楽記号（Unicode）を使用していることを確認
      expect(Accidental.SHARP.getSymbol()).toBe('\u266f'); // ♯
      expect(Accidental.FLAT.getSymbol()).toBe('\u266d'); // ♭
      expect(Accidental.NATURAL.getSymbol()).toBe(''); // 空文字（通常ナチュラル記号は♮だが、このクラスでは空文字仕様）
    });

    it('正常ケース: 変化記号の組み合わせテスト', () => {
      const accidentals = [Accidental.SHARP, Accidental.FLAT, Accidental.NATURAL];

      // 全ての変化記号が異なる記号を返すことを確認
      const symbols = accidentals.map(acc => acc.getSymbol());
      const uniqueSymbols = new Set(symbols);

      expect(uniqueSymbols.size).toBe(symbols.length);
    });
  });

  describe('不変性の確認', () => {
    it('正常ケース: valueプロパティの不変性', () => {
      const accidental = new Accidental('sharp');

      // readonlyプロパティであることを確認
      expect(accidental.value).toBe('sharp');

      // TypeScriptのreadonlyはコンパイル時チェックのため、
      // 実行時には値の確認のみ行う
      expect(accidental.value).toBe('sharp');
    });

    it('正常ケース: 静的インスタンスの不変性', () => {
      const originalSharp = Accidental.SHARP;
      const originalFlat = Accidental.FLAT;
      const originalNatural = Accidental.NATURAL;

      // 複数回アクセスしても同じインスタンスが返される
      expect(Accidental.SHARP).toBe(originalSharp);
      expect(Accidental.FLAT).toBe(originalFlat);
      expect(Accidental.NATURAL).toBe(originalNatural);
    });
  });

  describe('TypeScript型安全性の確認', () => {
    it('正常ケース: AccidentalType型の制約', () => {
      // 有効な型のみが受け入れられることを確認
      const validTypes: Array<'sharp' | 'flat' | 'natural'> = ['sharp', 'flat', 'natural'];

      validTypes.forEach(type => {
        expect(() => new Accidental(type)).not.toThrow();
      });
    });

    it('正常ケース: getSymbolメソッドの戻り値型', () => {
      const accidental = new Accidental('sharp');
      const symbol = accidental.getSymbol();

      expect(typeof symbol).toBe('string');
      expect(symbol).toBeDefined();
    });
  });

  describe('境界値・エッジケース', () => {
    it('正常ケース: 全ての有効なAccidentalTypeをテスト', () => {
      const allTypes: Array<'sharp' | 'flat' | 'natural'> = ['sharp', 'flat', 'natural'];

      allTypes.forEach(type => {
        const accidental = new Accidental(type);
        expect(accidental.value).toBe(type);
        expect(typeof accidental.getSymbol()).toBe('string');
      });
    });

    it('正常ケース: 静的インスタンスと動的インスタンスの値の一致', () => {
      expect(new Accidental('sharp').value).toBe(Accidental.SHARP.value);
      expect(new Accidental('flat').value).toBe(Accidental.FLAT.value);
      expect(new Accidental('natural').value).toBe(Accidental.NATURAL.value);

      expect(new Accidental('sharp').getSymbol()).toBe(Accidental.SHARP.getSymbol());
      expect(new Accidental('flat').getSymbol()).toBe(Accidental.FLAT.getSymbol());
      expect(new Accidental('natural').getSymbol()).toBe(Accidental.NATURAL.getSymbol());
    });
  });

  describe('ユーティリティ用途での検証', () => {
    it('正常ケース: 文字列連結での使用', () => {
      const pitchName = 'C';
      const sharpAccidental = Accidental.SHARP;
      const flatAccidental = Accidental.FLAT;
      const naturalAccidental = Accidental.NATURAL;

      expect(pitchName + sharpAccidental.getSymbol()).toBe('C♯');
      expect(pitchName + flatAccidental.getSymbol()).toBe('C♭');
      expect(pitchName + naturalAccidental.getSymbol()).toBe('C');
    });

    it('正常ケース: 条件分岐での使用', () => {
      const accidentals = [Accidental.SHARP, Accidental.FLAT, Accidental.NATURAL];

      accidentals.forEach(accidental => {
        let displayName: string;

        if (accidental.value === 'sharp') {
          displayName = 'シャープ';
        } else if (accidental.value === 'flat') {
          displayName = 'フラット';
        } else {
          displayName = 'ナチュラル';
        }

        expect(displayName).toBeDefined();
        expect(typeof displayName).toBe('string');
      });
    });

    it('正常ケース: 配列やコレクションでの使用', () => {
      const accidentalSet = new Set([
        Accidental.SHARP,
        Accidental.FLAT,
        Accidental.NATURAL,
        Accidental.SHARP, // 重複
      ]);

      // 同じ静的インスタンスなので重複が除去される
      expect(accidentalSet.size).toBe(3);
    });
  });
});
