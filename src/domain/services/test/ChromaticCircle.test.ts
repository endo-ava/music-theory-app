import { describe, test, expect, beforeEach } from 'vitest';
import { ChromaticCircleService } from '../ChromaticCircle';
import { PitchClass } from '@/domain/common';

describe('ChromaticCircleService', () => {
  beforeEach(() => {
    // キャッシュをクリアするため、プライベートプロパティを直接操作
    // @ts-expect-error - テスト用にプライベートプロパティにアクセス
    ChromaticCircleService.segments = undefined;
  });

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

    test('正常ケース: position 0 は C を持つ', () => {
      const segments = ChromaticCircleService.getSegments();
      const cSegment = segments[0];

      expect(cSegment.position).toBe(0);
      expect(cSegment.pitchClass.sharpName).toBe('C');
      expect(cSegment.pitchClass.index).toBe(0);
    });

    test('正常ケース: position 1 は C#/D♭ を持つ', () => {
      const segments = ChromaticCircleService.getSegments();
      const cSharpSegment = segments[1];

      expect(cSharpSegment.position).toBe(1);
      expect(cSharpSegment.pitchClass.sharpName).toBe('C#');
      expect(cSharpSegment.pitchClass.flatName).toBe('D♭');
      expect(cSharpSegment.pitchClass.index).toBe(1);
    });

    test('正常ケース: position 11 は B を持つ', () => {
      const segments = ChromaticCircleService.getSegments();
      const bSegment = segments[11];

      expect(bSegment.position).toBe(11);
      expect(bSegment.pitchClass.sharpName).toBe('B');
      expect(bSegment.pitchClass.index).toBe(11);
    });

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

    test('正常ケース: position 0 は "C" を持つ', () => {
      const dtos = ChromaticCircleService.getSegmentDTOs();
      const cDto = dtos[0];

      expect(cDto.position).toBe(0);
      expect(cDto.pitchClassName).toBe('C');
    });

    test('正常ケース: position 1 は "C#/D♭" を持つ', () => {
      const dtos = ChromaticCircleService.getSegmentDTOs();
      const cSharpDto = dtos[1];

      expect(cSharpDto.position).toBe(1);
      expect(cSharpDto.pitchClassName).toBe('C#/D♭');
    });

    test('正常ケース: 自然音は単独表記である', () => {
      const dtos = ChromaticCircleService.getSegmentDTOs();

      expect(dtos[0].pitchClassName).toBe('C'); // C
      expect(dtos[2].pitchClassName).toBe('D'); // D
      expect(dtos[4].pitchClassName).toBe('E'); // E
      expect(dtos[5].pitchClassName).toBe('F'); // F
      expect(dtos[7].pitchClassName).toBe('G'); // G
      expect(dtos[9].pitchClassName).toBe('A'); // A
      expect(dtos[11].pitchClassName).toBe('B'); // B
    });

    test('正常ケース: 変化音は異名同音併記である', () => {
      const dtos = ChromaticCircleService.getSegmentDTOs();

      expect(dtos[1].pitchClassName).toBe('C#/D♭'); // C#/D♭
      expect(dtos[3].pitchClassName).toBe('D#/E♭'); // D#/E♭
      expect(dtos[6].pitchClassName).toBe('F#/G♭'); // F#/G♭
      expect(dtos[8].pitchClassName).toBe('G#/A♭'); // G#/A♭
      expect(dtos[10].pitchClassName).toBe('A#/B♭'); // A#/B♭
    });

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
});
