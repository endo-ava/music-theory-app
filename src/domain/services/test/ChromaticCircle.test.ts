import { describe, test, expect } from 'vitest';
import { fc, test as fcTest } from '@fast-check/vitest';
import { ChromaticCircleService } from '../ChromaticCircle';
import { PitchClass } from '@/domain/common';

describe('ChromaticCircleService', () => {
  describe('getSegments', () => {
    test('正常ケース: 12個のセグメントを生成する', () => {
      const segments = ChromaticCircleService.getSegments();
      expect(segments).toHaveLength(12);
    });

    test('正常ケース: 各セグメントが正しい位置を持つ', () => {
      const segments = ChromaticCircleService.getSegments();
      segments.forEach((segment, index) => {
        expect(segment.position).toBe(index);
      });
    });

    test.each([
      { position: 0, sharpName: 'C', flatName: 'C', index: 0 },
      { position: 1, sharpName: 'C#', flatName: 'D♭', index: 1 },
      { position: 2, sharpName: 'D', flatName: 'D', index: 2 },
      { position: 3, sharpName: 'D#', flatName: 'E♭', index: 3 },
      { position: 4, sharpName: 'E', flatName: 'E', index: 4 },
      { position: 5, sharpName: 'F', flatName: 'F', index: 5 },
      { position: 6, sharpName: 'F#', flatName: 'G♭', index: 6 },
      { position: 7, sharpName: 'G', flatName: 'G', index: 7 },
      { position: 8, sharpName: 'G#', flatName: 'A♭', index: 8 },
      { position: 9, sharpName: 'A', flatName: 'A', index: 9 },
      { position: 10, sharpName: 'A#', flatName: 'B♭', index: 10 },
      { position: 11, sharpName: 'B', flatName: 'B', index: 11 },
    ])(
      '正常ケース: position $position は $sharpName/$flatName を持つ',
      ({ position, sharpName, flatName, index }) => {
        const segments = ChromaticCircleService.getSegments();
        const segment = segments[position];

        expect(segment.position).toBe(position);
        expect(segment.pitchClass.sharpName).toBe(sharpName);
        expect(segment.pitchClass.flatName).toBe(flatName);
        expect(segment.pitchClass.index).toBe(index);
      }
    );

    test('正常ケース: すべてのピッチクラスがPitchClassインスタンスである', () => {
      const segments = ChromaticCircleService.getSegments();
      segments.forEach(segment => {
        expect(segment.pitchClass).toBeInstanceOf(PitchClass);
      });
    });

    test('正常ケース: 半音階順（C, C#, D, D#, ...）に並んでいる', () => {
      const segments = ChromaticCircleService.getSegments();
      const expectedPitchClasses = [
        PitchClass.C,
        PitchClass.CSharp,
        PitchClass.D,
        PitchClass.DSharp,
        PitchClass.E,
        PitchClass.F,
        PitchClass.FSharp,
        PitchClass.G,
        PitchClass.GSharp,
        PitchClass.A,
        PitchClass.ASharp,
        PitchClass.B,
      ];

      segments.forEach((segment, index) => {
        expect(segment.pitchClass.index).toBe(expectedPitchClasses[index].index);
      });
    });

    test('正常ケース: 同じインスタンスがキャッシュされる', () => {
      const segments1 = ChromaticCircleService.getSegments();
      const segments2 = ChromaticCircleService.getSegments();

      expect(segments1).toBe(segments2); // 参照が同じ
    });

    test('正常ケース: セグメント配列がfreezeされている', () => {
      const segments = ChromaticCircleService.getSegments();
      expect(Object.isFrozen(segments)).toBe(true);
    });
  });

  describe('getSegmentDTOs', () => {
    test('正常ケース: 12個のDTOを生成する', () => {
      const dtos = ChromaticCircleService.getSegmentDTOs();
      expect(dtos).toHaveLength(12);
    });

    test('正常ケース: 各DTOがシリアライズ可能な構造を持つ', () => {
      const dtos = ChromaticCircleService.getSegmentDTOs();
      dtos.forEach(dto => {
        expect(dto).toHaveProperty('position');
        expect(dto).toHaveProperty('pitchClassName');

        expect(typeof dto.position).toBe('number');
        expect(typeof dto.pitchClassName).toBe('string');
      });
    });

    test.each([
      { position: 0, pitchClassName: 'C', type: '自然音' },
      { position: 1, pitchClassName: 'C#/D♭', type: '変化音' },
      { position: 2, pitchClassName: 'D', type: '自然音' },
      { position: 3, pitchClassName: 'D#/E♭', type: '変化音' },
      { position: 4, pitchClassName: 'E', type: '自然音' },
      { position: 5, pitchClassName: 'F', type: '自然音' },
      { position: 6, pitchClassName: 'F#/G♭', type: '変化音' },
      { position: 7, pitchClassName: 'G', type: '自然音' },
      { position: 8, pitchClassName: 'G#/A♭', type: '変化音' },
      { position: 9, pitchClassName: 'A', type: '自然音' },
      { position: 10, pitchClassName: 'A#/B♭', type: '変化音' },
      { position: 11, pitchClassName: 'B', type: '自然音' },
    ])(
      '正常ケース: position $position は "$pitchClassName" ($type) を持つ',
      ({ position, pitchClassName }) => {
        const dtos = ChromaticCircleService.getSegmentDTOs();
        const dto = dtos[position];

        expect(dto.position).toBe(position);
        expect(dto.pitchClassName).toBe(pitchClassName);
      }
    );

    test('正常ケース: DTOがJSON.stringifyで正しくシリアライズできる', () => {
      const dtos = ChromaticCircleService.getSegmentDTOs();
      expect(() => JSON.stringify(dtos)).not.toThrow();

      const serialized = JSON.stringify(dtos);
      const deserialized = JSON.parse(serialized);

      expect(deserialized).toHaveLength(12);
      expect(deserialized[0]).toHaveProperty('position', 0);
      expect(deserialized[0]).toHaveProperty('pitchClassName', 'C');
    });
  });

  describe('SEGMENT_COUNT', () => {
    test('正常ケース: セグメント数が12である', () => {
      expect(ChromaticCircleService.SEGMENT_COUNT).toBe(12);
    });
  });

  describe('不変性と境界値テスト', () => {
    test('境界値ケース: 範囲外のpositionにアクセスしてもundefinedを返す', () => {
      const segments = ChromaticCircleService.getSegments();
      expect(segments[12]).toBeUndefined();
      expect(segments[-1]).toBeUndefined();
      expect(segments[100]).toBeUndefined();
    });

    test('不変性テスト: セグメント配列を変更しようとしてもエラーになる', () => {
      const segments = ChromaticCircleService.getSegments();

      // freeze されているので変更できない
      expect(() => {
        // @ts-expect-error - テストのために型を無視して変更を試みる
        segments.push({ position: 12, pitchClass: PitchClass.C });
      }).toThrow();
    });

    test('不変性テスト: DTO配列は新しい配列として返される', () => {
      const dtos = ChromaticCircleService.getSegmentDTOs();

      // DTOは読み取り専用配列として返される
      expect(Array.isArray(dtos)).toBe(true);

      // 元の配列を変更しても新しい呼び出しには影響しない
      const mutableCopy = [...dtos];
      mutableCopy.push({ position: 12, pitchClassName: 'X' });
      expect(mutableCopy).toHaveLength(13);

      // 元のDTOには影響しない
      const newDtos = ChromaticCircleService.getSegmentDTOs();
      expect(newDtos).toHaveLength(12);
    });

    test('境界値ケース: すべてのセグメントのpositionが0-11の範囲内である', () => {
      const segments = ChromaticCircleService.getSegments();
      segments.forEach(segment => {
        expect(segment.position).toBeGreaterThanOrEqual(0);
        expect(segment.position).toBeLessThan(12);
      });
    });

    test('境界値ケース: すべてのピッチクラスのindexが0-11の範囲内である', () => {
      const segments = ChromaticCircleService.getSegments();
      segments.forEach(segment => {
        expect(segment.pitchClass.index).toBeGreaterThanOrEqual(0);
        expect(segment.pitchClass.index).toBeLessThan(12);
      });
    });
  });

  describe('プロパティベーステスト', () => {
    fcTest.prop([fc.integer({ min: 0, max: 11 })])(
      'プロパティ: position 0-11 の範囲でセグメントが常に有効である',
      position => {
        const segments = ChromaticCircleService.getSegments();
        const segment = segments[position];

        // セグメントが存在する
        expect(segment).toBeDefined();

        // positionが一致する
        expect(segment.position).toBe(position);

        // pitchClassがPitchClassインスタンスである
        expect(segment.pitchClass).toBeInstanceOf(PitchClass);

        // pitchClassのindexがpositionと一致する
        expect(segment.pitchClass.index).toBe(position);
      }
    );

    fcTest.prop([fc.integer({ min: 0, max: 11 })])(
      'プロパティ: すべてのpositionでセグメント配列がfreezeされている',
      () => {
        const segments = ChromaticCircleService.getSegments();
        expect(Object.isFrozen(segments)).toBe(true);
      }
    );

    fcTest.prop([fc.integer({ min: 0, max: 11 })])(
      'プロパティ: DTOは常にシリアライズ可能である',
      position => {
        const dtos = ChromaticCircleService.getSegmentDTOs();
        const dto = dtos[position];

        // JSON.stringifyでエラーが発生しない
        expect(() => JSON.stringify(dto)).not.toThrow();

        // シリアライズ・デシリアライズの往復ができる
        const serialized = JSON.stringify(dto);
        const deserialized = JSON.parse(serialized);

        expect(deserialized.position).toBe(position);
        expect(deserialized).toHaveProperty('pitchClassName');
        expect(typeof deserialized.pitchClassName).toBe('string');
      }
    );
  });
});
