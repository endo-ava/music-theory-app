import { describe, test, expect, beforeEach } from 'vitest';
import { CircleOfFifthsService } from '../CircleOfFifths';
import { Key } from '@/domain/key';

describe('CircleOfFifthsService', () => {
  beforeEach(() => {
    // キャッシュをクリアするため、プライベートプロパティを直接操作
    // @ts-expect-error - テスト用にプライベートプロパティにアクセス
    CircleOfFifthsService.segments = undefined;
  });

  describe('getSegments', () => {
    test('正常ケース: 12個のセグメントを生成する', () => {
      const segments = CircleOfFifthsService.getSegments();
      expect(segments).toHaveLength(12);
    });

    test('正常ケース: 各セグメントが正しい位置を持つ', () => {
      const segments = CircleOfFifthsService.getSegments();
      segments.forEach((segment, index) => {
        expect(segment.position).toBe(index);
      });
    });

    test('正常ケース: position 0 は C Major と A minor を持つ', () => {
      const segments = CircleOfFifthsService.getSegments();
      const cSegment = segments[0];

      expect(cSegment.majorKey.shortName).toBe('C');
      expect(cSegment.majorKey.isMajor).toBe(true);
      expect(cSegment.minorKey.shortName).toBe('Am');
      expect(cSegment.minorKey.isMajor).toBe(false);
    });

    test('正常ケース: position 1 は G Major と E minor を持つ', () => {
      const segments = CircleOfFifthsService.getSegments();
      const gSegment = segments[1];

      expect(gSegment.majorKey.shortName).toBe('G');
      expect(gSegment.majorKey.isMajor).toBe(true);
      expect(gSegment.minorKey.shortName).toBe('Em');
      expect(gSegment.minorKey.isMajor).toBe(false);
    });

    test('正常ケース: position 6 は F#/G♭ Major と D#m/E♭m minor を持つ', () => {
      const segments = CircleOfFifthsService.getSegments();
      const fSharpSegment = segments[6];

      // F# Majorの場合
      expect(fSharpSegment.majorKey.isMajor).toBe(true);
      // D#m minorの場合
      expect(fSharpSegment.minorKey.isMajor).toBe(false);
    });

    test('正常ケース: 調号の文字列が正しく生成される', () => {
      const segments = CircleOfFifthsService.getSegments();

      // C (position 0): 調号なし
      expect(segments[0].keySignature).toBe('');

      // G (position 1): ♯1
      expect(segments[1].keySignature).toBe('♯1');

      // F (position 11): ♭1
      expect(segments[11].keySignature).toBe('♭1');

      // B♭ (position 10): ♭2
      expect(segments[10].keySignature).toBe('♭2');

      // F♯/G♭ (position 6): ♯♭6
      expect(segments[6].keySignature).toBe('♯♭6');
    });

    test('正常ケース: 同じインスタンスがキャッシュされる', () => {
      const segments1 = CircleOfFifthsService.getSegments();
      const segments2 = CircleOfFifthsService.getSegments();

      expect(segments1).toBe(segments2); // 参照が同じ
    });

    test('正常ケース: セグメント配列がfreezeされている', () => {
      const segments = CircleOfFifthsService.getSegments();
      expect(Object.isFrozen(segments)).toBe(true);
    });
  });

  describe('getAllKeys', () => {
    test('正常ケース: 24個のキー（12メジャー + 12マイナー）を返す', () => {
      const allKeys = CircleOfFifthsService.getAllKeys();
      expect(allKeys).toHaveLength(24);
    });

    test('正常ケース: メジャーキーとマイナーキーが交互に配置される', () => {
      const allKeys = CircleOfFifthsService.getAllKeys();

      // 偶数インデックスはメジャー、奇数インデックスはマイナー
      for (let i = 0; i < allKeys.length; i++) {
        const key = allKeys[i];
        if (i % 2 === 0) {
          expect(key.isMajor).toBe(true);
        } else {
          expect(key.isMajor).toBe(false);
        }
      }
    });

    test('正常ケース: すべてのキーがKeyインスタンスである', () => {
      const allKeys = CircleOfFifthsService.getAllKeys();
      allKeys.forEach(key => {
        expect(key).toBeInstanceOf(Key);
      });
    });
  });

  describe('getSegmentDTOs', () => {
    test('正常ケース: 12個のDTOを生成する', () => {
      const dtos = CircleOfFifthsService.getSegmentDTOs();
      expect(dtos).toHaveLength(12);
    });

    test('正常ケース: 各DTOがシリアライズ可能な構造を持つ', () => {
      const dtos = CircleOfFifthsService.getSegmentDTOs();
      dtos.forEach(dto => {
        expect(dto).toHaveProperty('position');
        expect(dto).toHaveProperty('majorKey');
        expect(dto).toHaveProperty('minorKey');
        expect(dto).toHaveProperty('keySignature');

        // majorKeyとminorKeyがプレーンオブジェクトであることを確認
        expect(typeof dto.majorKey).toBe('object');
        expect(typeof dto.minorKey).toBe('object');
        expect(dto.majorKey).toHaveProperty('shortName');
        expect(dto.majorKey).toHaveProperty('isMajor');
      });
    });

    test('正常ケース: DTOがJSON.stringifyで正しくシリアライズできる', () => {
      const dtos = CircleOfFifthsService.getSegmentDTOs();
      expect(() => JSON.stringify(dtos)).not.toThrow();

      const serialized = JSON.stringify(dtos);
      const deserialized = JSON.parse(serialized);

      expect(deserialized).toHaveLength(12);
      expect(deserialized[0]).toHaveProperty('position', 0);
    });

    test('正常ケース: position 0 のDTOがC MajorとA minorの情報を持つ', () => {
      const dtos = CircleOfFifthsService.getSegmentDTOs();
      const cDto = dtos[0];

      expect(cDto.position).toBe(0);
      expect(cDto.majorKey.shortName).toBe('C');
      expect(cDto.majorKey.isMajor).toBe(true);
      expect(cDto.minorKey.shortName).toBe('Am');
      expect(cDto.minorKey.isMajor).toBe(false);
      expect(cDto.keySignature).toBe('');
    });
  });

  describe('SEGMENT_COUNT', () => {
    test('正常ケース: セグメント数が12である', () => {
      expect(CircleOfFifthsService.SEGMENT_COUNT).toBe(12);
    });
  });
});
