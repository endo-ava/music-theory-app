import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useDiatonicHighlight } from '../useDiatonicHighlight';
import { useLayerStore } from '@/stores/layerStore';
import { IMusicalContext } from '@/domain';
import { PitchClass } from '@/domain/common';
import { Scale, KeySignature, Chord } from '@/domain';

// Mock the stores
vi.mock('@/stores/layerStore', () => ({
  useLayerStore: vi.fn(),
}));

const mockedUseLayerStore = vi.mocked(useLayerStore);

// Create mock implementations
const mockDiatonicChordInfo = [
  {
    chord: {
      rootNote: {
        pitchClass: PitchClass.C, // C
      },
    },
  },
  {
    chord: {
      rootNote: {
        pitchClass: PitchClass.D, // D
      },
    },
  },
  {
    chord: {
      rootNote: {
        pitchClass: PitchClass.E, // E
      },
    },
  },
  {
    chord: {
      rootNote: {
        pitchClass: PitchClass.F, // F
      },
    },
  },
  {
    chord: {
      rootNote: {
        pitchClass: PitchClass.G, // G
      },
    },
  },
  {
    chord: {
      rootNote: {
        pitchClass: PitchClass.A, // A
      },
    },
  },
  {
    chord: {
      rootNote: {
        pitchClass: PitchClass.B, // B
      },
    },
  },
];

const mockCurrentKey = {
  getDiatonicChordsInfo: vi.fn().mockReturnValue(mockDiatonicChordInfo),
  centerPitch: PitchClass.C, // C as tonic
  scale: {} as unknown as Scale,
  keySignature: {} as unknown as KeySignature,
  contextName: 'C Major',
  shortName: 'C',
  diatonicChords: [] as Chord[],
  buildTriad: vi.fn(),
  analyzeChord: vi.fn(),
  isDiatonicChord: vi.fn(),
  getRelativeMajorTonic: vi.fn(),
  toJSON: vi.fn(),
} as unknown as IMusicalContext;

describe('[useDiatonicHighlight] ダイアトニックハイライトフック', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('[useDiatonicHighlight] フックの基本機能', () => {
    it('正常ケース: ダイアトニックコード可視状態で7つの位置がハイライトされる', async () => {
      // モックの設定
      mockedUseLayerStore.mockReturnValue({
        isDiatonicVisible: true,
      });

      // フックをレンダリング
      const { result } = renderHook(() => useDiatonicHighlight(mockCurrentKey));

      // 結果を待つ
      await waitFor(() => {
        expect(result.current.highlightPositions).toBeDefined();
      });

      // 期待される結果
      const expectedPositions = new Set([0, 2, 4, 5, 7, 9, 11]); // C, D, E, F, G, A, B

      expect(result.current.highlightPositions).toEqual(expectedPositions);
      expect(result.current.tonicPosition).toBe(0); // Cがトニック
      expect(result.current.isVisible).toBe(true);
    });

    it('正常ケース: ダイアトニックコード非可視状態でハイライト位置が空になる', async () => {
      // モックの設定
      mockedUseLayerStore.mockReturnValue({
        isDiatonicVisible: false,
      });

      // フックをレンダリング
      const { result } = renderHook(() => useDiatonicHighlight(mockCurrentKey));

      // 結果を待つ
      await waitFor(() => {
        expect(result.current.highlightPositions).toBeDefined();
      });

      // 期待される結果
      expect(result.current.highlightPositions.size).toBe(0);
      expect(result.current.tonicPosition).toBeNull();
      expect(result.current.isVisible).toBe(false);
    });
  });

  describe('[getDiatonicChordsInfo] メソッド呼び出し', () => {
    it('正常ケース: currentKeyのgetDiatonicChordsInfoが呼び出される', async () => {
      // モックの設定
      mockedUseLayerStore.mockReturnValue({
        isDiatonicVisible: true,
      });

      const getDiatonicChordsInfoSpy = vi.spyOn(mockCurrentKey, 'getDiatonicChordsInfo');

      // フックをレンダリング
      renderHook(() => useDiatonicHighlight(mockCurrentKey));

      // getDiatonicChordsInfoが呼び出されたことを確認
      await waitFor(() => {
        expect(getDiatonicChordsInfoSpy).toHaveBeenCalled();
      });
    });
  });

  describe('[tonicPosition] トニック位置の計算', () => {
    it('正常ケース: トニック位置がcurrentKeyのcenterPitch.indexと一致する', async () => {
      // モックの設定
      mockedUseLayerStore.mockReturnValue({
        isDiatonicVisible: true,
      });

      const mockKeyWithGAsTonic = {
        ...mockCurrentKey,
        centerPitch: PitchClass.G, // G as tonic
      } as IMusicalContext;

      // フックをレンダリング
      const { result } = renderHook(() => useDiatonicHighlight(mockKeyWithGAsTonic));

      // 結果を待つ
      await waitFor(() => {
        expect(result.current.tonicPosition).toBeDefined();
      });

      expect(result.current.tonicPosition).toBe(7);
    });

    it('正常ケース: ダイアトニックコード非可視状態でトニック位置がnullになる', async () => {
      // モックの設定
      mockedUseLayerStore.mockReturnValue({
        isDiatonicVisible: false,
      });

      // フックをレンダリング
      const { result } = renderHook(() => useDiatonicHighlight(mockCurrentKey));

      // 結果を待つ
      await waitFor(() => {
        expect(result.current.tonicPosition).toBeDefined();
      });

      expect(result.current.tonicPosition).toBeNull();
    });
  });

  describe('[依存関係の変更] リアクティブな更新', () => {
    it('境界値ケース: isDiatonicVisibleが切り替わった時に結果が更新される', async () => {
      // 初期値を非表示に設定
      let isDiatonicVisible = false;
      mockedUseLayerStore.mockImplementation(() => ({
        isDiatonicVisible,
      }));

      const { result, rerender } = renderHook(() => useDiatonicHighlight(mockCurrentKey));

      // 初期状態: 非表示
      await waitFor(() => {
        expect(result.current.isVisible).toBe(false);
      });
      expect(result.current.highlightPositions.size).toBe(0);

      // 表示に切り替え
      isDiatonicVisible = true;
      rerender();

      // 更新後: 表示
      await waitFor(() => {
        expect(result.current.isVisible).toBe(true);
      });
      expect(result.current.highlightPositions.size).toBe(7);
    });
  });
});
