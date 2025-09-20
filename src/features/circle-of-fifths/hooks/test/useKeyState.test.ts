import { describe, test, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useKeyState, type UseKeyStateProps } from '../useKeyState';
import type { KeyDTO } from '@/domain/key';

describe('useKeyState hook', () => {
  // テスト用のデフォルトKeyDTO
  const defaultKeyDTO: KeyDTO = {
    shortName: 'C',
    keyName: 'C Major',
    fifthsIndex: 0,
    isMajor: true,
  };

  const defaultProps: UseKeyStateProps = {
    keyDTO: defaultKeyDTO,
    selectedKey: null,
    hoveredKey: null,
  };

  describe('基本機能', () => {
    test('正常ケース: フックが正しい構造を返す', () => {
      const { result } = renderHook(() => useKeyState(defaultProps));

      expect(result.current).toHaveProperty('isSelected');
      expect(result.current).toHaveProperty('isHovered');
      expect(result.current).toHaveProperty('fillClassName');
      expect(result.current).toHaveProperty('textClassName');

      expect(typeof result.current.isSelected).toBe('boolean');
      expect(typeof result.current.isHovered).toBe('boolean');
      expect(typeof result.current.fillClassName).toBe('string');
      expect(typeof result.current.textClassName).toBe('string');
    });

    test('正常ケース: 初期状態（選択・ホバーなし）', () => {
      const { result } = renderHook(() => useKeyState(defaultProps));

      expect(result.current.isSelected).toBe(false);
      expect(result.current.isHovered).toBe(false);
    });
  });

  describe('選択状態の判定', () => {
    test('正常ケース: 選択されている場合', () => {
      const propsWithSelection: UseKeyStateProps = {
        keyDTO: defaultKeyDTO,
        selectedKey: defaultKeyDTO,
        hoveredKey: null,
      };

      const { result } = renderHook(() => useKeyState(propsWithSelection));

      expect(result.current.isSelected).toBe(true);
      expect(result.current.isHovered).toBe(false);
    });

    test('正常ケース: 異なるキーが選択されている場合', () => {
      const differentKey: KeyDTO = {
        shortName: 'G',
        keyName: 'G Major',
        fifthsIndex: 1,
        isMajor: true,
      };

      const propsWithDifferentSelection: UseKeyStateProps = {
        keyDTO: defaultKeyDTO,
        selectedKey: differentKey,
        hoveredKey: null,
      };

      const { result } = renderHook(() => useKeyState(propsWithDifferentSelection));

      expect(result.current.isSelected).toBe(false);
      expect(result.current.isHovered).toBe(false);
    });

    test('正常ケース: メジャー・マイナーキーの判定', () => {
      const majorKey: KeyDTO = {
        shortName: 'C',
        keyName: 'C Major',
        fifthsIndex: 0,
        isMajor: true,
      };

      const minorKey: KeyDTO = {
        shortName: 'Am',
        keyName: 'A Minor',
        fifthsIndex: 0,
        isMajor: false,
      };

      // メジャーキーが選択されている状態でメジャーキーをテスト
      const majorProps: UseKeyStateProps = {
        keyDTO: majorKey,
        selectedKey: majorKey,
        hoveredKey: null,
      };
      const { result: majorResult } = renderHook(() => useKeyState(majorProps));
      expect(majorResult.current.isSelected).toBe(true);

      // 同じfifthsIndexでもマイナーキーは選択されていない
      const minorProps: UseKeyStateProps = {
        keyDTO: minorKey,
        selectedKey: majorKey,
        hoveredKey: null,
      };
      const { result: minorResult } = renderHook(() => useKeyState(minorProps));
      expect(minorResult.current.isSelected).toBe(false);
    });

    test('境界値ケース: fifthsIndexとisMajorの厳密な比較', () => {
      const testCases = [
        {
          selectedKey: { shortName: 'C', keyName: 'C Major', fifthsIndex: 0, isMajor: true },
          testKey: { shortName: 'C', keyName: 'C Major', fifthsIndex: 0, isMajor: true },
          expected: true,
        },
        {
          selectedKey: { shortName: 'C', keyName: 'C Major', fifthsIndex: 0, isMajor: true },
          testKey: { shortName: 'Am', keyName: 'A Minor', fifthsIndex: 0, isMajor: false },
          expected: false,
        },
        {
          selectedKey: { shortName: 'G', keyName: 'G Major', fifthsIndex: 1, isMajor: true },
          testKey: { shortName: 'C', keyName: 'C Major', fifthsIndex: 0, isMajor: true },
          expected: false,
        },
      ];

      testCases.forEach(({ selectedKey, testKey, expected }) => {
        const testProps: UseKeyStateProps = {
          keyDTO: testKey,
          selectedKey,
          hoveredKey: null,
        };

        const { result } = renderHook(() => useKeyState(testProps));
        expect(result.current.isSelected).toBe(expected);
      });
    });
  });

  describe('ホバー状態の判定', () => {
    test('正常ケース: ホバーされている場合', () => {
      const propsWithHover: UseKeyStateProps = {
        keyDTO: defaultKeyDTO,
        selectedKey: null,
        hoveredKey: defaultKeyDTO,
      };

      const { result } = renderHook(() => useKeyState(propsWithHover));

      expect(result.current.isSelected).toBe(false);
      expect(result.current.isHovered).toBe(true);
    });

    test('正常ケース: 異なるキーがホバーされている場合', () => {
      const differentKey: KeyDTO = {
        shortName: 'G',
        keyName: 'G Major',
        fifthsIndex: 1,
        isMajor: true,
      };

      const propsWithDifferentHover: UseKeyStateProps = {
        keyDTO: defaultKeyDTO,
        selectedKey: null,
        hoveredKey: differentKey,
      };

      const { result } = renderHook(() => useKeyState(propsWithDifferentHover));

      expect(result.current.isSelected).toBe(false);
      expect(result.current.isHovered).toBe(false);
    });

    test('正常ケース: 選択かつホバーの場合', () => {
      const propsWithBoth: UseKeyStateProps = {
        keyDTO: defaultKeyDTO,
        selectedKey: defaultKeyDTO,
        hoveredKey: defaultKeyDTO,
      };

      const { result } = renderHook(() => useKeyState(propsWithBoth));

      expect(result.current.isSelected).toBe(true);
      expect(result.current.isHovered).toBe(true);
    });
  });

  describe('クラス名の生成', () => {
    describe('fillClassName', () => {
      test('正常ケース: メジャーキーの通常状態', () => {
        const { result } = renderHook(() => useKeyState(defaultProps));

        expect(result.current.fillClassName).toBe('fill-key-area-major');
      });

      test('正常ケース: マイナーキーの通常状態', () => {
        const minorKeyDTO: KeyDTO = {
          shortName: 'Am',
          keyName: 'A Minor',
          fifthsIndex: 0,
          isMajor: false,
        };

        const { result } = renderHook(() =>
          useKeyState({ keyDTO: minorKeyDTO, selectedKey: null, hoveredKey: null })
        );

        expect(result.current.fillClassName).toBe('fill-key-area-minor');
      });

      test('正常ケース: 選択状態の優先', () => {
        const propsWithSelection: UseKeyStateProps = {
          keyDTO: defaultKeyDTO,
          selectedKey: defaultKeyDTO,
          hoveredKey: null,
        };

        const { result } = renderHook(() => useKeyState(propsWithSelection));

        expect(result.current.fillClassName).toBe('fill-key-area-selected');
      });

      test('正常ケース: ホバー状態', () => {
        const propsWithHover: UseKeyStateProps = {
          keyDTO: defaultKeyDTO,
          selectedKey: null,
          hoveredKey: defaultKeyDTO,
        };

        const { result } = renderHook(() => useKeyState(propsWithHover));

        expect(result.current.fillClassName).toBe('fill-key-area-hover');
      });

      test('正常ケース: 選択状態がホバー状態より優先される', () => {
        const propsWithBoth: UseKeyStateProps = {
          keyDTO: defaultKeyDTO,
          selectedKey: defaultKeyDTO,
          hoveredKey: defaultKeyDTO,
        };

        const { result } = renderHook(() => useKeyState(propsWithBoth));

        expect(result.current.fillClassName).toBe('fill-key-area-selected');
      });
    });

    describe('textClassName', () => {
      test('正常ケース: メジャーキーのテキストクラス', () => {
        const { result } = renderHook(() => useKeyState(defaultProps));

        expect(result.current.textClassName).toBe('text-key-major font-key-major');
      });

      test('正常ケース: マイナーキーのテキストクラス', () => {
        const minorKeyDTO: KeyDTO = {
          shortName: 'Am',
          keyName: 'A Minor',
          fifthsIndex: 0,
          isMajor: false,
        };

        const { result } = renderHook(() =>
          useKeyState({ keyDTO: minorKeyDTO, selectedKey: null, hoveredKey: null })
        );

        expect(result.current.textClassName).toBe('text-key-minor font-key-minor');
      });

      test('正常ケース: 状態によらずキータイプでテキストクラスが決まる', () => {
        // 選択状態でもテキストクラスはキータイプに依存
        const propsWithSelection: UseKeyStateProps = {
          keyDTO: defaultKeyDTO,
          selectedKey: defaultKeyDTO,
          hoveredKey: null,
        };

        const { result } = renderHook(() => useKeyState(propsWithSelection));

        expect(result.current.textClassName).toBe('text-key-major font-key-major');
      });
    });
  });

  describe('状態変更の反応性', () => {
    test('正常ケース: ストア状態変更時の再計算', () => {
      const { result, rerender } = renderHook((props: UseKeyStateProps) => useKeyState(props), {
        initialProps: defaultProps,
      });

      // 初期状態
      expect(result.current.isSelected).toBe(false);
      expect(result.current.fillClassName).toBe('fill-key-area-major');

      // ストア状態を選択状態に変更
      const newProps: UseKeyStateProps = {
        keyDTO: defaultKeyDTO,
        selectedKey: defaultKeyDTO,
        hoveredKey: null,
      };

      rerender(newProps);

      // 状態が更新されることを確認
      expect(result.current.isSelected).toBe(true);
      expect(result.current.fillClassName).toBe('fill-key-area-selected');
    });

    test('正常ケース: ホバー状態の変化', () => {
      const { result, rerender } = renderHook((props: UseKeyStateProps) => useKeyState(props), {
        initialProps: defaultProps,
      });

      // ホバー状態に変更
      const hoverProps: UseKeyStateProps = {
        keyDTO: defaultKeyDTO,
        selectedKey: null,
        hoveredKey: defaultKeyDTO,
      };

      rerender(hoverProps);

      expect(result.current.isHovered).toBe(true);
      expect(result.current.fillClassName).toBe('fill-key-area-hover');

      // ホバー解除
      const noHoverProps: UseKeyStateProps = {
        keyDTO: defaultKeyDTO,
        selectedKey: null,
        hoveredKey: null,
      };

      rerender(noHoverProps);

      expect(result.current.isHovered).toBe(false);
      expect(result.current.fillClassName).toBe('fill-key-area-major');
    });
  });

  describe('メモ化とパフォーマンス', () => {
    test('正常ケース: 同じProps・ストア状態での結果安定性', () => {
      const { result, rerender } = renderHook(() => useKeyState(defaultProps));

      const firstResult = result.current;
      rerender();
      const secondResult = result.current;

      // useMemoにより同じオブジェクト参照が返される
      expect(firstResult).toBe(secondResult);
    });

    test('正常ケース: Props変更時の再計算', () => {
      const { result, rerender } = renderHook((props: UseKeyStateProps) => useKeyState(props), {
        initialProps: defaultProps,
      });

      const firstResult = result.current;

      // 異なるキーでテスト
      const newProps: UseKeyStateProps = {
        keyDTO: {
          shortName: 'G',
          keyName: 'G Major',
          fifthsIndex: 1,
          isMajor: true,
        },
        selectedKey: null,
        hoveredKey: null,
      };

      rerender(newProps);
      const secondResult = result.current;

      // 異なるPropsなので新しいオブジェクトが返される
      expect(firstResult).not.toBe(secondResult);
      expect(secondResult.fillClassName).toBe('fill-key-area-major');
    });
  });

  describe('エッジケース', () => {
    test('正常ケース: nullストア値の処理', () => {
      const nullProps: UseKeyStateProps = {
        keyDTO: defaultKeyDTO,
        selectedKey: null,
        hoveredKey: null,
      };

      const { result } = renderHook(() => useKeyState(nullProps));

      expect(result.current.isSelected).toBe(false);
      expect(result.current.isHovered).toBe(false);
      expect(result.current.fillClassName).toBe('fill-key-area-major');
    });

    test('境界値ケース: 極端なfifthsIndex値', () => {
      const edgeCaseKeys = [
        { shortName: 'C', keyName: 'C Major', fifthsIndex: 0, isMajor: true },
        { shortName: 'F#', keyName: 'F# Major', fifthsIndex: 6, isMajor: true },
        { shortName: 'Gb', keyName: 'Gb Major', fifthsIndex: -6, isMajor: true },
        { shortName: 'Test', keyName: 'Test Major', fifthsIndex: 999, isMajor: true },
      ];

      edgeCaseKeys.forEach(keyDTO => {
        const edgeProps: UseKeyStateProps = {
          keyDTO,
          selectedKey: null,
          hoveredKey: null,
        };
        const { result } = renderHook(() => useKeyState(edgeProps));

        expect(typeof result.current.isSelected).toBe('boolean');
        expect(typeof result.current.isHovered).toBe('boolean');
        expect(typeof result.current.fillClassName).toBe('string');
        expect(typeof result.current.textClassName).toBe('string');
      });
    });
  });
});
