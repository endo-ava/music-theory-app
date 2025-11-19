import { describe, test, expect } from 'vitest';
import { CircleOfFifthsService } from '../CircleOfFifths';
import { Key } from '@/domain/key';
import { PitchClass } from '@/domain/common';

describe('CircleOfFifthsService', () => {
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

    test.each([
      { position: 0, majorShortName: 'C', minorShortName: 'Am', keySignature: '' },
      { position: 1, majorShortName: 'G', minorShortName: 'Em', keySignature: '♯1' },
      { position: 2, majorShortName: 'D', minorShortName: 'Bm', keySignature: '♯2' },
      { position: 3, majorShortName: 'A', minorShortName: 'F#m', keySignature: '♯3' },
      { position: 4, majorShortName: 'E', minorShortName: 'C#m', keySignature: '♯4' },
      { position: 5, majorShortName: 'B', minorShortName: 'G#m', keySignature: '♯5' },
      { position: 6, majorShortName: 'G♭', minorShortName: 'D#m', keySignature: '♯♭6' },
      { position: 7, majorShortName: 'D♭', minorShortName: 'A#m', keySignature: '♭5' },
      { position: 8, majorShortName: 'A♭', minorShortName: 'Fm', keySignature: '♭4' },
      { position: 9, majorShortName: 'E♭', minorShortName: 'Cm', keySignature: '♭3' },
      { position: 10, majorShortName: 'B♭', minorShortName: 'Gm', keySignature: '♭2' },
      { position: 11, majorShortName: 'F', minorShortName: 'Dm', keySignature: '♭1' },
    ])(
      '正常ケース: position $position は $majorShortName Major と $minorShortName minor を持つ',
      ({ position, majorShortName, minorShortName, keySignature }) => {
        const segments = CircleOfFifthsService.getSegments();
        const segment = segments[position];

        expect(segment.majorKey.shortName).toBe(majorShortName);
        expect(segment.majorKey.isMajor).toBe(true);
        expect(segment.minorKey.shortName).toBe(minorShortName);
        expect(segment.minorKey.isMajor).toBe(false);
        expect(segment.keySignature).toBe(keySignature);
      }
    );

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

  describe('不変性と境界値テスト', () => {
    test('境界値ケース: 範囲外のpositionにアクセスしてもundefinedを返す', () => {
      const segments = CircleOfFifthsService.getSegments();
      expect(segments[12]).toBeUndefined();
      expect(segments[-1]).toBeUndefined();
      expect(segments[100]).toBeUndefined();
    });

    test('不変性テスト: セグメント配列を変更しようとしてもエラーになる', () => {
      const segments = CircleOfFifthsService.getSegments();

      // freeze されているので変更できない
      expect(() => {
        // @ts-expect-error - テストのために型を無視して変更を試みる
        segments.push({
          position: 12,
          majorKey: Key.major(PitchClass.C),
          minorKey: Key.minor(PitchClass.A),
          keySignature: '',
        });
      }).toThrow();
    });

    test('不変性テスト: DTO配列は変更可能である（シャローコピー）', () => {
      const dtos = CircleOfFifthsService.getSegmentDTOs();

      // DTOは通常の配列なので変更可能（新しい配列として返される）
      expect(() => {
        dtos.push({
          position: 12,
          majorKey: { shortName: 'X', isMajor: true },
          minorKey: { shortName: 'Xm', isMajor: false },
          keySignature: '',
        });
      }).not.toThrow();

      // しかし元のDTOには影響しない
      const newDtos = CircleOfFifthsService.getSegmentDTOs();
      expect(newDtos).toHaveLength(12);
    });

    test('境界値ケース: すべてのセグメントのpositionが0-11の範囲内である', () => {
      const segments = CircleOfFifthsService.getSegments();
      segments.forEach(segment => {
        expect(segment.position).toBeGreaterThanOrEqual(0);
        expect(segment.position).toBeLessThan(12);
      });
    });

    test('境界値ケース: すべてのキーがKeyインスタンスの不変条件を満たす', () => {
      const allKeys = CircleOfFifthsService.getAllKeys();
      allKeys.forEach(key => {
        // Keyインスタンスは必ずshortNameを持つ
        expect(key.shortName).toBeTruthy();
        expect(typeof key.shortName).toBe('string');
        // isMajorはbooleanである
        expect(typeof key.isMajor).toBe('boolean');
      });
    });

    test('境界値ケース: 調号の文字列が有効な範囲である', () => {
      const dtos = CircleOfFifthsService.getSegmentDTOs();
      dtos.forEach(dto => {
        // 調号は空文字列、または♯/♭ + 数字の形式
        expect(dto.keySignature).toMatch(/^$|^[♯♭]+\d{1,2}$/);
      });
    });
  });
});
