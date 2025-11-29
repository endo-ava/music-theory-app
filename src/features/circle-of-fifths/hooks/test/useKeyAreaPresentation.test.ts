import { describe, test, expect, vi, beforeEach, type Mock } from 'vitest';
import { renderHook } from '@testing-library/react';
import {
  useKeyAreaPresentation,
  type UseKeyAreaPresentationProps,
} from '../useKeyAreaPresentation';
import { useDiatonicChordHighlight } from '../useDiatonicChordHighlight';
import { getMusicColorVariable } from '@/shared/utils/musicColorSystem';
import { Key, KeyDTO, PitchClass } from '@/domain';
import type { Point } from '@/shared/types/graphics';

// 依存関係のモック
vi.mock('../useDiatonicChordHighlight');
vi.mock('@/shared/utils/musicColorSystem');

// モック関数の定義
const mockGetHighlightInfo = vi.fn();
const mockGetMusicColorVariable = vi.fn();

describe('useKeyAreaPresentation hook', () => {
  // テスト用のデフォルトProps
  const defaultTestPosition: Point = { x: 100, y: 50 };
  const defaultKeyDTO: KeyDTO = {
    shortName: 'C',
    contextName: 'C Major',
    fifthsIndex: 0,
    isMajor: true,
    type: 'key' as const,
  };
  const defaultCurrentKey = Key.major(PitchClass.C);

  const defaultProps: UseKeyAreaPresentationProps = {
    keyDTO: defaultKeyDTO,
    textPosition: defaultTestPosition,
    currentKey: defaultCurrentKey,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // useDiatonicChordHighlightのモック設定
    (useDiatonicChordHighlight as unknown as Mock).mockReturnValue({
      getHighlightInfo: mockGetHighlightInfo,
    });

    // getMusicColorVariableのモック設定
    (getMusicColorVariable as unknown as Mock).mockImplementation(mockGetMusicColorVariable);

    // デフォルトのモック戻り値を設定
    mockGetHighlightInfo.mockReturnValue({
      shouldHighlight: false,
      romanNumeral: null,
    });

    mockGetMusicColorVariable.mockReturnValue('var(--color-c-major)'); // デフォルト戻り値
  });

  describe('基本機能', () => {
    test('正常ケース: フックが正しい構造を返す', () => {
      const { result } = renderHook(() => useKeyAreaPresentation(defaultProps));

      expect(result.current).toHaveProperty('shouldHighlight');
      expect(result.current).toHaveProperty('keyAreaColor');
      expect(result.current).toHaveProperty('layout');

      expect(typeof result.current.shouldHighlight).toBe('boolean');
      expect(typeof result.current.keyAreaColor).toBe('string');
      expect(typeof result.current.layout).toBe('object');
    });

    test('正常ケース: layoutオブジェクトが正しい構造を持つ', () => {
      const { result } = renderHook(() => useKeyAreaPresentation(defaultProps));

      expect(result.current.layout).toHaveProperty('primaryTextY');
      expect(typeof result.current.layout.primaryTextY).toBe('number');
    });
  });

  describe('ダイアトニックハイライト機能', () => {
    test('正常ケース: ハイライト非表示時の動作', () => {
      mockGetHighlightInfo.mockReturnValue({
        shouldHighlight: false,
        romanNumeral: null,
      });

      const { result } = renderHook(() => useKeyAreaPresentation(defaultProps));

      expect(result.current.shouldHighlight).toBe(false);
      expect(mockGetHighlightInfo).toHaveBeenCalledWith(defaultKeyDTO);
    });

    test('正常ケース: ハイライト表示時の動作', () => {
      mockGetHighlightInfo.mockReturnValue({
        shouldHighlight: true,
        romanNumeral: 'Ⅰ',
      });

      const { result } = renderHook(() => useKeyAreaPresentation(defaultProps));

      expect(result.current.shouldHighlight).toBe(true);
      expect(mockGetHighlightInfo).toHaveBeenCalledWith(defaultKeyDTO);
    });
  });

  describe('色計算機能', () => {
    test('正常ケース: keyAreaColorの計算', () => {
      const expectedColor = 'var(--color-c-major)';
      mockGetMusicColorVariable.mockReturnValueOnce(expectedColor);

      const { result } = renderHook(() => useKeyAreaPresentation(defaultProps));

      expect(result.current.keyAreaColor).toBe(expectedColor);
      expect(mockGetMusicColorVariable).toHaveBeenCalledWith(defaultKeyDTO);
    });

    test('正常ケース: 異なるキーでの色計算', () => {
      const gMajorKeyDTO: KeyDTO = {
        shortName: 'G',
        contextName: 'G Major',
        fifthsIndex: 1,
        isMajor: true,
        type: 'key' as const,
      };
      const gMajorKey = Key.major(PitchClass.G);

      const props: UseKeyAreaPresentationProps = {
        keyDTO: gMajorKeyDTO,
        textPosition: defaultTestPosition,
        currentKey: gMajorKey,
      };

      mockGetMusicColorVariable.mockReturnValueOnce('var(--color-g-major)');

      renderHook(() => useKeyAreaPresentation(props));

      expect(mockGetMusicColorVariable).toHaveBeenCalledWith(gMajorKeyDTO);
    });

    test('正常ケース: マイナーキーでの色計算', () => {
      const aMinorKeyDTO: KeyDTO = {
        shortName: 'Am',
        contextName: 'A Minor',
        fifthsIndex: 0,
        isMajor: false,
        type: 'key' as const,
      };
      const aMinorKey = Key.minor(PitchClass.A);

      const props: UseKeyAreaPresentationProps = {
        keyDTO: aMinorKeyDTO,
        textPosition: defaultTestPosition,
        currentKey: aMinorKey,
      };

      mockGetMusicColorVariable.mockReturnValueOnce('var(--color-a-minor)');

      renderHook(() => useKeyAreaPresentation(props));

      expect(mockGetMusicColorVariable).toHaveBeenCalledWith(aMinorKeyDTO);
    });
  });

  describe('レイアウト計算機能', () => {
    test('正常ケース: レイアウトオフセットの適用', () => {
      const testPosition: Point = { x: 120, y: 80 };

      // ハイライト表示の場合のテスト
      mockGetHighlightInfo.mockReturnValue({
        shouldHighlight: true,
        romanNumeral: 'Ⅰ',
      });

      const props: UseKeyAreaPresentationProps = {
        ...defaultProps,
        textPosition: testPosition,
      };

      const { result } = renderHook(() => useKeyAreaPresentation(props));

      // LAYOUT_OFFSETSが正しく適用されていることを確認
      expect(typeof result.current.layout.primaryTextY).toBe('number');

      // ハイライト表示時はprimaryTextYにオフセットが適用される
      expect(result.current.layout.primaryTextY).not.toBe(testPosition.y);
    });

    test('正常ケース: 異なるテキスト位置での計算', () => {
      const positions = [
        { x: 0, y: 0 },
        { x: 100, y: 50 },
        { x: -50, y: -25 },
        { x: 200, y: 150 },
      ];

      positions.forEach(position => {
        const props: UseKeyAreaPresentationProps = {
          ...defaultProps,
          textPosition: position,
        };

        const { result } = renderHook(() => useKeyAreaPresentation(props));

        expect(typeof result.current.layout.primaryTextY).toBe('number');
        expect(isFinite(result.current.layout.primaryTextY)).toBe(true);
      });
    });
  });

  describe('依存関係の管理', () => {
    test('正常ケース: useDiatonicChordHighlightが正しい引数で呼ばれる', () => {
      renderHook(() => useKeyAreaPresentation(defaultProps));

      expect(useDiatonicChordHighlight).toHaveBeenCalledWith(defaultCurrentKey);
    });

    test('正常ケース: Props変更時の再計算', () => {
      const { result, rerender } = renderHook(
        (props: UseKeyAreaPresentationProps) => useKeyAreaPresentation(props),
        { initialProps: defaultProps }
      );

      const initialResult = result.current;

      // 異なるキーでのProps
      const newKeyDTO: KeyDTO = {
        shortName: 'D',
        contextName: 'D Major',
        fifthsIndex: 2,
        isMajor: true,
        type: 'key' as const,
      };
      const newCurrentKey = Key.major(PitchClass.D);
      const newProps: UseKeyAreaPresentationProps = {
        keyDTO: newKeyDTO,
        textPosition: defaultTestPosition,
        currentKey: newCurrentKey,
      };

      // 新しいモック戻り値を設定
      mockGetMusicColorVariable.mockReturnValueOnce('var(--color-d-major)');

      rerender(newProps);

      // 新しい値が返されることを確認
      expect(result.current).not.toBe(initialResult);
      expect(useDiatonicChordHighlight).toHaveBeenCalledWith(newCurrentKey);
    });
  });

  describe('メモ化とパフォーマンス', () => {
    test('正常ケース: 同じProps値での複数回レンダリング', () => {
      const { result, rerender } = renderHook(() => useKeyAreaPresentation(defaultProps));

      const firstResult = result.current;
      rerender();
      const secondResult = result.current;

      // useMemoにより同じオブジェクト参照が返されることを確認
      expect(firstResult).toBe(secondResult);
    });

    test('正常ケース: 依存配列の動作確認', () => {
      const { result, rerender } = renderHook(
        (props: UseKeyAreaPresentationProps) => useKeyAreaPresentation(props),
        { initialProps: defaultProps }
      );

      const firstResult = result.current;

      // 同じ内容だが異なるオブジェクトのPropsでテスト
      const sameContentProps: UseKeyAreaPresentationProps = {
        keyDTO: { ...defaultKeyDTO },
        textPosition: { ...defaultTestPosition },
        currentKey: defaultCurrentKey,
      };

      rerender(sameContentProps);
      const secondResult = result.current;

      // 内容が同じなので同じ結果が返されることを確認
      expect(firstResult.shouldHighlight).toBe(secondResult.shouldHighlight);
    });
  });

  describe('エラーハンドリング', () => {
    test('異常ケース: getMusicColorVariableがエラーをスローした場合', () => {
      // エラーを投げるようにモック設定を変更
      mockGetMusicColorVariable.mockReset();
      mockGetMusicColorVariable.mockImplementation(() => {
        throw new Error('Color calculation failed');
      });

      // エラーがスローされることを確認
      expect(() => {
        renderHook(() => useKeyAreaPresentation(defaultProps));
      }).toThrow('Color calculation failed');
    });

    test('異常ケース: useDiatonicChordHighlightがnullを返した場合', () => {
      (useDiatonicChordHighlight as unknown as Mock).mockReturnValue({
        getHighlightInfo: null,
      });

      expect(() => {
        renderHook(() => useKeyAreaPresentation(defaultProps));
      }).toThrow();
    });
  });
});
