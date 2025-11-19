import { Key } from '@/domain/key';
import { PitchClass } from '@/domain/common';
import type { KeyDTO } from '@/domain/common/IMusicalContext';
import type { ChromaticSegmentDTO } from '@/domain/services/ChromaticCircle';
import type { CircleSegmentDTO } from '@/domain/services/CircleOfFifths';

/**
 * テストデータファクトリ
 *
 * テスト全体で使用するモックドメインオブジェクトの生成を簡素化し、
 * ボイラープレートコードを削減します。
 */

/**
 * KeyDTOのモックを生成
 */
export function createMockKeyDTO(overrides?: Partial<KeyDTO>): KeyDTO {
  return {
    shortName: 'C',
    contextName: 'C Major',
    fifthsIndex: 0,
    type: 'key',
    isMajor: true,
    ...overrides,
  };
}

/**
 * ChromaticSegmentDTOのモックを生成
 */
export function createMockChromaticSegmentDTO(
  overrides?: Partial<ChromaticSegmentDTO>
): ChromaticSegmentDTO {
  return {
    position: 0,
    pitchClassName: 'C',
    ...overrides,
  };
}

/**
 * CircleSegmentDTOのモックを生成
 */
export function createMockCircleSegmentDTO(
  overrides?: Partial<CircleSegmentDTO>
): CircleSegmentDTO {
  return {
    position: 0,
    majorKey: createMockKeyDTO({ shortName: 'C', contextName: 'C Major', isMajor: true }),
    minorKey: createMockKeyDTO({
      shortName: 'Am',
      contextName: 'A minor',
      isMajor: false,
    }),
    keySignature: '',
    ...overrides,
  };
}

/**
 * Key（メジャー）のファクトリ
 */
export function createMockMajorKey(pitchClass: PitchClass = PitchClass.C): Key {
  return Key.major(pitchClass);
}

/**
 * Key（マイナー）のファクトリ
 */
export function createMockMinorKey(pitchClass: PitchClass = PitchClass.A): Key {
  return Key.minor(pitchClass);
}

/**
 * 五度圏の位置からKeyを生成するファクトリ
 */
export function createKeyFromFifths(position: number, isMajor: boolean): Key {
  return Key.fromCircleOfFifths(position, isMajor);
}
