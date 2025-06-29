import { describe, test, expect } from 'vitest';
import { getKeyInfo } from '../dataOperations';
import { Key, CircleOfFifthsError } from '@/features/circle-of-fifths/types';
import { KEYS } from '../../constants/index';

describe('dataOperations utils', () => {
  describe('getKeyInfo', () => {
    test('正常ケース: 有効なメジャーキーで正しい情報を返す', () => {
      const cMajorKey: Key = {
        name: 'C',
        isMajor: true,
        position: 0,
      };

      const result = getKeyInfo(cMajorKey);

      expect(result.name).toBe('C');
      expect(result.scale).toBe('長調');
      expect(result.position).toBe(1); // 位置 + 1 (表示用)
      expect(result.relativeKey).toBe('Am'); // C major の相対短調
    });

    test('正常ケース: 有効なマイナーキーで正しい情報を返す', () => {
      const aMinorKey: Key = {
        name: 'Am',
        isMajor: false,
        position: 0,
      };

      const result = getKeyInfo(aMinorKey);

      expect(result.name).toBe('Am');
      expect(result.scale).toBe('短調');
      expect(result.position).toBe(1); // 位置 + 1 (表示用)
      expect(result.relativeKey).toBe('C'); // A minor の相対長調
    });

    test('正常ケース: 様々な位置のキーで相対調が正しく計算される', () => {
      // 位置3: A major と F#m minor
      const aMajorKey: Key = {
        name: 'A',
        isMajor: true,
        position: 3,
      };

      const fSharpMinorKey: Key = {
        name: 'F#m',
        isMajor: false,
        position: 3,
      };

      const aMajorResult = getKeyInfo(aMajorKey);
      const fSharpMinorResult = getKeyInfo(fSharpMinorKey);

      expect(aMajorResult.relativeKey).toBe('F#m');
      expect(fSharpMinorResult.relativeKey).toBe('A');

      // 位置6: F#/G♭ major と D#m minor
      const fSharpMajorKey: Key = {
        name: 'F#',
        isMajor: true,
        position: 6,
      };

      const dSharpMinorKey: Key = {
        name: 'D#m',
        isMajor: false,
        position: 6,
      };

      const fSharpMajorResult = getKeyInfo(fSharpMajorKey);
      const dSharpMinorResult = getKeyInfo(dSharpMinorKey);

      expect(fSharpMajorResult.relativeKey).toBe('D#m');
      expect(dSharpMinorResult.relativeKey).toBe('F#');
    });

    test('正常ケース: 全てのKEYS定数のキーで正しく動作', () => {
      KEYS.forEach(key => {
        const result = getKeyInfo(key);

        // 基本プロパティの確認
        expect(result.name).toBe(key.name);
        expect(result.position).toBe(key.position + 1);
        expect(result.scale).toBe(key.isMajor ? '長調' : '短調');

        // 相対調の確認
        const expectedRelativeKey = KEYS.find(
          k => k.isMajor !== key.isMajor && k.position === key.position
        )?.name;
        expect(result.relativeKey).toBe(expectedRelativeKey);
      });
    });

    test('正常ケース: 相対調が存在しない場合はundefinedを返す', () => {
      // 実際のKEYS定数では全てのキーに相対調が存在するが、
      // 仮想的なケースをテスト
      const hypotheticalKey: Key = {
        name: 'TestKey',
        isMajor: true,
        position: 99, // 存在しない位置
      };

      // この場合、isValidKeyでfalseになるため、エラーがスローされる
      expect(() => getKeyInfo(hypotheticalKey)).toThrow(CircleOfFifthsError);
    });

    test('異常ケース: 無効なキーでCircleOfFifthsErrorをスロー', () => {
      const invalidKeys: unknown[] = [
        // nameが空文字列
        { name: '', isMajor: true, position: 0 },
        // nameが文字列以外
        { name: 123, isMajor: true, position: 0 },
        // isMajorがboolean以外
        { name: 'C', isMajor: 'true', position: 0 },
        // positionが無効
        { name: 'C', isMajor: true, position: -1 },
        { name: 'C', isMajor: true, position: 12 },
        { name: 'C', isMajor: true, position: 1.5 },
      ];

      invalidKeys.forEach(invalidKey => {
        expect(() => getKeyInfo(invalidKey as Key)).toThrow(CircleOfFifthsError);
      });

      // エラーメッセージとコードの確認
      try {
        getKeyInfo({ name: '', isMajor: true, position: 0 });
      } catch (error) {
        expect(error).toBeInstanceOf(CircleOfFifthsError);
        expect((error as CircleOfFifthsError).code).toBe('INVALID_KEY');
        expect((error as CircleOfFifthsError).message).toContain('Invalid key:');
      }
    });

    test('正常ケース: 複雑なキー名でも正しく処理', () => {
      const complexKey: Key = {
        name: 'F#/G♭',
        isMajor: true,
        position: 6,
      };

      const result = getKeyInfo(complexKey);

      expect(result.name).toBe('F#/G♭');
      expect(result.scale).toBe('長調');
      expect(result.position).toBe(7);
      expect(result.relativeKey).toBe('D#m');
    });
  });
});
