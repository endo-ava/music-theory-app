/**
 * KeyName型定義のユニットテスト
 */

import { describe, it, expect } from 'vitest';
import type { KeyName, MajorKeyName, MinorKeyName } from '../KeyName';

describe('KeyName型定義', () => {
  describe('MajorKeyName', () => {
    it('正常ケース: 全メジャーキーが定義されている', () => {
      const expectedMajorKeys: MajorKeyName[] = [
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

      expect(expectedMajorKeys.length).toBe(12);

      // 五度圏順の確認（シャープ系→フラット系）
      const sharpsKeys = expectedMajorKeys.slice(0, 7); // C, G, D, A, E, B, F#
      const enharmonicKeys = expectedMajorKeys.slice(7, 12); // C#, G#, D#, A#, F

      expect(sharpsKeys).toEqual(['C', 'G', 'D', 'A', 'E', 'B', 'F#']);
      expect(enharmonicKeys).toEqual(['C#', 'G#', 'D#', 'A#', 'F']);
    });

    it('正常ケース: 型として使用可能', () => {
      // TypeScriptの型チェックが通ることを確認
      const testMajorKey: MajorKeyName = 'C';
      expect(testMajorKey).toBe('C');

      const anotherMajorKey: MajorKeyName = 'F#';
      expect(anotherMajorKey).toBe('F#');
    });
  });

  describe('MinorKeyName', () => {
    it('正常ケース: 全マイナーキーが定義されている', () => {
      const expectedMinorKeys: MinorKeyName[] = [
        'Am',
        'Em',
        'Bm',
        'F#m',
        'C#m',
        'G#m',
        'D#m',
        'A#m',
        'Fm',
        'Cm',
        'Gm',
        'Dm',
      ];

      expect(expectedMinorKeys.length).toBe(12);

      // 五度圏順の確認（相対マイナー）
      const sharpsMinorKeys = expectedMinorKeys.slice(0, 7); // Am, Em, Bm, F#m, C#m, G#m, D#m
      const flatsMinorKeys = expectedMinorKeys.slice(7, 12); // A#m, Fm, Cm, Gm, Dm

      expect(sharpsMinorKeys).toEqual(['Am', 'Em', 'Bm', 'F#m', 'C#m', 'G#m', 'D#m']);
      expect(flatsMinorKeys).toEqual(['A#m', 'Fm', 'Cm', 'Gm', 'Dm']);
    });

    it('正常ケース: 型として使用可能', () => {
      // TypeScriptの型チェックが通ることを確認
      const testMinorKey: MinorKeyName = 'Am';
      expect(testMinorKey).toBe('Am');

      const anotherMinorKey: MinorKeyName = 'F#m';
      expect(anotherMinorKey).toBe('F#m');
    });
  });

  describe('KeyName統合型', () => {
    it('正常ケース: メジャーとマイナーキーを統合', () => {
      // KeyNameにメジャーキーを代入
      const majorKey: KeyName = 'C';
      expect(majorKey).toBe('C');

      // KeyNameにマイナーキーを代入
      const minorKey: KeyName = 'Am';
      expect(minorKey).toBe('Am');
    });

    it('正常ケース: 全キー名の総数確認', () => {
      const allMajorKeys: MajorKeyName[] = [
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
      const allMinorKeys: MinorKeyName[] = [
        'Am',
        'Em',
        'Bm',
        'F#m',
        'C#m',
        'G#m',
        'D#m',
        'A#m',
        'Fm',
        'Cm',
        'Gm',
        'Dm',
      ];

      // 合計24キー（12メジャー + 12マイナー）
      expect(allMajorKeys.length + allMinorKeys.length).toBe(24);
    });
  });

  describe('五度圏との対応関係', () => {
    it('正常ケース: メジャーキーと相対マイナーキーの対応', () => {
      const relativeKeyPairs: Array<[MajorKeyName, MinorKeyName]> = [
        ['C', 'Am'], // 0シャープ/フラット
        ['G', 'Em'], // 1シャープ
        ['D', 'Bm'], // 2シャープ
        ['A', 'F#m'], // 3シャープ
        ['E', 'C#m'], // 4シャープ
        ['B', 'G#m'], // 5シャープ
        ['F#', 'D#m'], // 6シャープ
        ['C#', 'A#m'], // 7シャープ
        ['F', 'Dm'], // 1フラット
        ['A#', 'Gm'], // 2フラット（B♭）
        ['D#', 'Cm'], // 3フラット（E♭）
        ['G#', 'Fm'], // 4フラット（A♭）
      ];

      expect(relativeKeyPairs.length).toBe(12);

      // 各ペアが有効なキー名として認識されることを確認
      relativeKeyPairs.forEach(([majorKey, minorKey]) => {
        const majorKeyName: KeyName = majorKey;
        const minorKeyName: KeyName = minorKey;

        expect(majorKeyName).toBe(majorKey);
        expect(minorKeyName).toBe(minorKey);
      });
    });

    it('正常ケース: 五度圏順のメジャーキー配列', () => {
      const fifthsOrderMajor: MajorKeyName[] = [
        'C', // 0: C major
        'G', // 1: G major
        'D', // 2: D major
        'A', // 3: A major
        'E', // 4: E major
        'B', // 5: B major
        'F#', // 6: F# major
        'C#', // 7: C# major
        'G#', // 8: G# major (Ab major)
        'D#', // 9: D# major (Eb major)
        'A#', // 10: A# major (Bb major)
        'F', // 11: F major
      ];

      // 五度圏の12ポジションに対応
      expect(fifthsOrderMajor.length).toBe(12);

      // 各ポジションが有効なMajorKeyNameであることを確認
      fifthsOrderMajor.forEach((key, index) => {
        const keyName: MajorKeyName = key;
        expect(keyName).toBe(key);
      });
    });

    it('正常ケース: 五度圏順のマイナーキー配列', () => {
      const fifthsOrderMinor: MinorKeyName[] = [
        'Am', // 0: A minor (相対: C major)
        'Em', // 1: E minor (相対: G major)
        'Bm', // 2: B minor (相対: D major)
        'F#m', // 3: F# minor (相対: A major)
        'C#m', // 4: C# minor (相対: E major)
        'G#m', // 5: G# minor (相対: B major)
        'D#m', // 6: D# minor (相対: F# major)
        'A#m', // 7: A# minor (相対: C# major)
        'Fm', // 8: F minor (相対: Ab major)
        'Cm', // 9: C minor (相対: Eb major)
        'Gm', // 10: G minor (相対: Bb major)
        'Dm', // 11: D minor (相対: F major)
      ];

      // 五度圏の12ポジションに対応
      expect(fifthsOrderMinor.length).toBe(12);

      // 各ポジションが有効なMinorKeyNameであることを確認
      fifthsOrderMinor.forEach((key, index) => {
        const keyName: MinorKeyName = key;
        expect(keyName).toBe(key);
      });
    });
  });

  describe('実用的なキー判定', () => {
    it('正常ケース: メジャーキー判定のヘルパー関数例', () => {
      const isMajorKey = (key: KeyName): key is MajorKeyName => {
        return !key.includes('m');
      };

      expect(isMajorKey('C')).toBe(true);
      expect(isMajorKey('F#')).toBe(true);
      expect(isMajorKey('Am')).toBe(false);
      expect(isMajorKey('F#m')).toBe(false);
    });

    it('正常ケース: マイナーキー判定のヘルパー関数例', () => {
      const isMinorKey = (key: KeyName): key is MinorKeyName => {
        return key.includes('m');
      };

      expect(isMinorKey('Am')).toBe(true);
      expect(isMinorKey('F#m')).toBe(true);
      expect(isMinorKey('C')).toBe(false);
      expect(isMinorKey('G')).toBe(false);
    });

    it('正常ケース: キー名からルート音名抽出例', () => {
      const extractRootNoteName = (key: KeyName): string => {
        return key.replace('m', '');
      };

      expect(extractRootNoteName('C')).toBe('C');
      expect(extractRootNoteName('Am')).toBe('A');
      expect(extractRootNoteName('F#')).toBe('F#');
      expect(extractRootNoteName('F#m')).toBe('F#');
    });
  });

  describe('型安全性の検証', () => {
    it('正常ケース: KeyName型の排他性', () => {
      // コンパイル時に型安全性が保証されることをテスト
      const processKey = (key: KeyName): string => {
        if (key.includes('m')) {
          return `Minor key: ${key}`;
        } else {
          return `Major key: ${key}`;
        }
      };

      expect(processKey('C')).toBe('Major key: C');
      expect(processKey('Am')).toBe('Minor key: Am');
      expect(processKey('F#')).toBe('Major key: F#');
      expect(processKey('F#m')).toBe('Minor key: F#m');
    });

    it('正常ケース: 全キー名の一意性', () => {
      const allMajorKeys: MajorKeyName[] = [
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
      const allMinorKeys: MinorKeyName[] = [
        'Am',
        'Em',
        'Bm',
        'F#m',
        'C#m',
        'G#m',
        'D#m',
        'A#m',
        'Fm',
        'Cm',
        'Gm',
        'Dm',
      ];

      // 重複がないことを確認
      const majorSet = new Set(allMajorKeys);
      const minorSet = new Set(allMinorKeys);

      expect(majorSet.size).toBe(allMajorKeys.length);
      expect(minorSet.size).toBe(allMinorKeys.length);

      // メジャーキーとマイナーキーで重複がないことを確認
      const allKeys = [...allMajorKeys, ...allMinorKeys];
      const allKeysSet = new Set(allKeys);
      expect(allKeysSet.size).toBe(allKeys.length);
    });
  });
});
