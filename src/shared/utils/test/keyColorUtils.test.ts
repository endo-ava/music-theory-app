import { describe, test, expect } from 'vitest';
import { getMusicColorKey } from '../musicColorSystem';
import type { KeyDTO } from '@/domain';

describe('keyColorUtils', () => {
  describe('getMusicColorKey', () => {
    test('正常ケース: C Majorで正確なCSS変数名を生成する', () => {
      const cMajorKey: KeyDTO = {
        shortName: 'C',
        keyName: 'C Major',
        fifthsIndex: 0,
        isMajor: true,
      };

      const result = getMusicColorKey(cMajorKey);
      expect(result).toBe('key-c-ionian');
    });

    test('正常ケース: A Minorで正確なCSS変数名を生成する', () => {
      const aMinorKey: KeyDTO = {
        shortName: 'Am',
        keyName: 'A Minor',
        fifthsIndex: 3,
        isMajor: false,
      };

      const result = getMusicColorKey(aMinorKey);
      expect(result).toBe('key-a-aeolian');
    });

    test('正常ケース: F# Majorで正確なCSS変数名を生成する', () => {
      const fsharpMajorKey: KeyDTO = {
        shortName: 'F#',
        keyName: 'F# Major',
        fifthsIndex: 6,
        isMajor: true,
      };

      const result = getMusicColorKey(fsharpMajorKey);
      expect(result).toBe('key-fsharp-ionian');
    });
  });
});
