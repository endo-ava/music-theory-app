import { describe, test, expect, vi, beforeEach, type Mock } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useFunctionalHarmonyData } from '../useFunctionalHarmonyData';
import { useLayerStore } from '@/stores/layerStore';
import { getCircleOfFifthsData } from '../../utils/circleOfFifthsData';
import { Key, PitchClass } from '@/domain';
import type { IAnalysisResultWithFunction } from '@/domain';

// モックの定義
vi.mock('@/stores/layerStore');
vi.mock('../../utils/circleOfFifthsData');

describe('useFunctionalHarmonyData', () => {
  const mockSegments = [
    {
      segment: { position: 0, majorKey: { fifthsIndex: 0 }, minorKey: { fifthsIndex: 3 } }, // C Major / A Minor
      textPositions: { majorTextPos: { x: 10, y: 10 }, minorTextPos: { x: 20, y: 20 } },
    },
    {
      segment: { position: 1, majorKey: { fifthsIndex: 1 }, minorKey: { fifthsIndex: 4 } }, // G Major / E Minor
      textPositions: { majorTextPos: { x: 30, y: 30 }, minorTextPos: { x: 40, y: 40 } },
    },
    {
      segment: { position: 11, majorKey: { fifthsIndex: -1 }, minorKey: { fifthsIndex: 2 } }, // F Major / D Minor
      textPositions: { majorTextPos: { x: 50, y: 50 }, minorTextPos: { x: 60, y: 60 } },
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    // useLayerStoreのモック
    (useLayerStore as unknown as Mock).mockReturnValue({
      isFunctionalHarmonyVisible: true,
    });

    // getCircleOfFifthsDataのモック
    (getCircleOfFifthsData as unknown as Mock).mockReturnValue({
      segments: mockSegments,
    });
  });

  test('正常ケース: レイヤー非表示時は空配列を返す', () => {
    (useLayerStore as unknown as Mock).mockReturnValue({
      isFunctionalHarmonyVisible: false,
    });

    const currentKey = Key.major(PitchClass.C);
    const { result } = renderHook(() => useFunctionalHarmonyData(currentKey));

    expect(result.current).toEqual([]);
  });

  test('正常ケース: C Majorキーでの機能和声データを正しく生成する', () => {
    const currentKey = Key.major(PitchClass.C);

    // getDiatonicChordsInfoの戻り値をモックする必要があるが、
    // Keyクラスの実装が正しければ、実際のインスタンスを使っても良い。
    // ただし、functionプロパティが含まれているか確認が必要。
    // フック内でキャストしているので、ここでは実際のKeyクラスの挙動に依存せず、
    // getDiatonicChordsInfoをスパイしてモックデータを返すようにする。

    const mockDiatonicChords = [
      {
        chord: { rootNote: { pitchClass: { fifthsIndex: 0 } }, quality: { quality: 'major' } },
        function: 'Tonic',
      },
      {
        chord: { rootNote: { pitchClass: { fifthsIndex: 1 } }, quality: { quality: 'major' } },
        function: 'Dominant',
      },
      {
        chord: { rootNote: { pitchClass: { fifthsIndex: -1 } }, quality: { quality: 'major' } },
        function: 'Subdominant',
      },
      {
        chord: { rootNote: { pitchClass: { fifthsIndex: 2 } }, quality: { quality: 'minor' } },
        function: 'Subdominant', // ii
      },
    ] as IAnalysisResultWithFunction[];

    vi.spyOn(currentKey, 'getDiatonicChordsInfo').mockReturnValue(mockDiatonicChords);

    const { result } = renderHook(() => useFunctionalHarmonyData(currentKey));

    expect(result.current).toHaveLength(4);

    // Tonic (C Major)
    const tonic = result.current.find(d => d.function === 'Tonic');
    expect(tonic).toBeDefined();
    expect(tonic?.abbreviation).toBe('T');
    expect(tonic?.fifthsIndex).toBe(0);
    expect(tonic?.isMajor).toBe(true);
    expect(tonic?.textPosition).toEqual({ x: 10, y: 10 });

    // Dominant (G Major)
    const dominant = result.current.find(d => d.function === 'Dominant');
    expect(dominant).toBeDefined();
    expect(dominant?.abbreviation).toBe('D');
    expect(dominant?.fifthsIndex).toBe(1);
    expect(dominant?.isMajor).toBe(true);
    expect(dominant?.textPosition).toEqual({ x: 30, y: 30 });

    // Subdominant (F Major)
    const subdominant = result.current.find(d => d.function === 'Subdominant' && d.isMajor);
    expect(subdominant).toBeDefined();
    expect(subdominant?.abbreviation).toBe('SD');
    expect(subdominant?.fifthsIndex).toBe(-1);
    expect(subdominant?.textPosition).toEqual({ x: 50, y: 50 });
  });

  test('正常ケース: Other機能は除外される', () => {
    const currentKey = Key.major(PitchClass.C);
    const mockDiatonicChords = [
      {
        chord: { rootNote: { pitchClass: { fifthsIndex: 0 } }, quality: { quality: 'major' } },
        function: 'Tonic',
      },
      {
        chord: { rootNote: { pitchClass: { fifthsIndex: 4 } }, quality: { quality: 'minor' } }, // iii
        function: 'Other', // iii usually behaves as Tonic or Dominant depending on context, but here assuming Other for test
      },
    ] as IAnalysisResultWithFunction[];

    vi.spyOn(currentKey, 'getDiatonicChordsInfo').mockReturnValue(mockDiatonicChords);

    const { result } = renderHook(() => useFunctionalHarmonyData(currentKey));

    expect(result.current).toHaveLength(1);
    expect(result.current[0].function).toBe('Tonic');
  });

  test('異常ケース: セグメントが見つからない場合はスキップされる', () => {
    const currentKey = Key.major(PitchClass.C);
    const mockDiatonicChords = [
      {
        chord: { rootNote: { pitchClass: { fifthsIndex: 99 } }, quality: { quality: 'major' } }, // 存在しないインデックス
        function: 'Tonic',
      },
    ] as IAnalysisResultWithFunction[];

    vi.spyOn(currentKey, 'getDiatonicChordsInfo').mockReturnValue(mockDiatonicChords);

    const { result } = renderHook(() => useFunctionalHarmonyData(currentKey));

    expect(result.current).toHaveLength(0);
  });
});
