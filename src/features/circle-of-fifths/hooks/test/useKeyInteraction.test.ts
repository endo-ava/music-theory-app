import { describe, test, expect, vi, beforeEach, afterEach, type Mock } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useKeyInteraction, type UseKeyInteractionProps } from '../useKeyInteraction';
import { useCurrentKeyStore } from '@/stores/currentKeyStore';
import { useLongPress } from '../useLongPress';
import type { KeyDTO } from '@/domain/common/IMusicalContext';
import { ScalePattern } from '@/domain';

// 依存関係のモック
vi.mock('@/stores/currentKeyStore');
vi.mock('../useLongPress');

// モック関数の定義
const mockSetCurrentKey = vi.fn();
const mockSetSelectedKey = vi.fn();
const mockSetHoveredKey = vi.fn();
const mockPlayChordAtPosition = vi.fn();
const mockPlayScaleAtPosition = vi.fn();
const mockOnRippleTrigger = vi.fn();

// useLongPressのモックハンドラ
const mockLongPressHandlers = {
  onMouseDown: vi.fn(),
  onMouseUp: vi.fn(),
  onMouseMove: vi.fn(),
  onMouseLeave: vi.fn(),
  onTouchStart: vi.fn(),
  onTouchEnd: vi.fn(),
  onTouchMove: vi.fn(),
};

describe('useKeyInteraction hook', () => {
  // テスト用のデフォルトKeyDTO
  const defaultKeyDTO: KeyDTO = {
    shortName: 'C',
    contextName: 'C Major',
    fifthsIndex: 0,
    isMajor: true,
    type: 'key' as const,
  };

  const defaultPosition = 0;

  const defaultProps: UseKeyInteractionProps = {
    keyDTO: defaultKeyDTO,
    position: defaultPosition,
    setSelectedKey: mockSetSelectedKey,
    setHoveredKey: mockSetHoveredKey,
    playChordAtPosition: mockPlayChordAtPosition,
    playScaleAtPosition: mockPlayScaleAtPosition,
    onRippleTrigger: mockOnRippleTrigger,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // useCurrentKeyStoreのモック設定
    (useCurrentKeyStore as unknown as Mock).mockReturnValue({
      setCurrentKey: mockSetCurrentKey,
    });

    // useLongPressのモック設定
    (useLongPress as unknown as Mock).mockReturnValue(mockLongPressHandlers);

    // デフォルトのモック戻り値を設定
    mockPlayChordAtPosition.mockResolvedValue(undefined);
    mockPlayScaleAtPosition.mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('基本機能', () => {
    test('正常ケース: フックが正しい構造を返す', () => {
      const { result } = renderHook(() => useKeyInteraction(defaultProps));

      expect(result.current).toHaveProperty('onMouseEnter');
      expect(result.current).toHaveProperty('onMouseLeave');
      expect(result.current).toHaveProperty('onMouseDown');
      expect(result.current).toHaveProperty('onMouseUp');
      expect(result.current).toHaveProperty('onMouseMove');
      expect(result.current).toHaveProperty('onTouchStart');
      expect(result.current).toHaveProperty('onTouchEnd');
      expect(result.current).toHaveProperty('onTouchMove');

      expect(typeof result.current.onMouseEnter).toBe('function');
      expect(typeof result.current.onMouseLeave).toBe('function');
      expect(typeof result.current.onMouseDown).toBe('function');
      expect(typeof result.current.onMouseUp).toBe('function');
      expect(typeof result.current.onMouseMove).toBe('function');
      expect(typeof result.current.onTouchStart).toBe('function');
      expect(typeof result.current.onTouchEnd).toBe('function');
      expect(typeof result.current.onTouchMove).toBe('function');
    });

    test('正常ケース: 複数回レンダリングで安定した関数参照を返す', () => {
      const { result, rerender } = renderHook(() => useKeyInteraction(defaultProps));

      const firstRender = result.current;
      rerender();
      const secondRender = result.current;

      // useCallbackにより同じ関数参照が返される
      expect(firstRender.onMouseEnter).toBe(secondRender.onMouseEnter);
      expect(firstRender.onMouseLeave).toBe(secondRender.onMouseLeave);
    });
  });

  describe('useLongPress統合', () => {
    test('正常ケース: useLongPressが正しい引数で呼ばれる', () => {
      renderHook(() => useKeyInteraction(defaultProps));

      expect(useLongPress).toHaveBeenCalledWith({
        onClick: expect.any(Function),
        onLongPress: expect.any(Function),
        onLongPressStart: expect.any(Function),
        delay: 500,
      });
    });

    test('正常ケース: ハンドラがuseLongPressから返される', () => {
      const { result } = renderHook(() => useKeyInteraction(defaultProps));

      // useLongPressのハンドラがそのまま返されることを確認
      expect(result.current.onMouseDown).toBe(mockLongPressHandlers.onMouseDown);
      expect(result.current.onMouseUp).toBe(mockLongPressHandlers.onMouseUp);
      expect(result.current.onMouseMove).toBe(mockLongPressHandlers.onMouseMove);
      expect(result.current.onTouchStart).toBe(mockLongPressHandlers.onTouchStart);
      expect(result.current.onTouchEnd).toBe(mockLongPressHandlers.onTouchEnd);
      expect(result.current.onTouchMove).toBe(mockLongPressHandlers.onTouchMove);
    });
  });

  describe('コールバック関数の動作', () => {
    test('正常ケース: handleClickコールバックの動作', () => {
      renderHook(() => useKeyInteraction(defaultProps));

      // useLongPressに渡されたonClickコールバックを取得
      const useLongPressCall = (useLongPress as unknown as Mock).mock.calls[0][0];
      const handleClick = useLongPressCall.onClick;

      // handleClickを直接実行してテスト
      act(() => {
        handleClick();
      });

      expect(mockSetSelectedKey).toHaveBeenCalledWith(defaultKeyDTO);
      expect(mockPlayChordAtPosition).toHaveBeenCalledWith(defaultPosition, true);
    });

    test('正常ケース: handleLongPressコールバックの動作', () => {
      renderHook(() => useKeyInteraction(defaultProps));

      // useLongPressに渡されたonLongPressコールバックを取得
      const useLongPressCall = (useLongPress as unknown as Mock).mock.calls[0][0];
      const handleLongPress = useLongPressCall.onLongPress;

      // handleLongPressを直接実行してテスト
      act(() => {
        handleLongPress();
      });

      expect(mockSetSelectedKey).toHaveBeenCalledWith(defaultKeyDTO);
      expect(mockSetCurrentKey).toHaveBeenCalled();
      expect(mockPlayScaleAtPosition).toHaveBeenCalledWith(defaultPosition, ScalePattern.Major);
    });

    test('正常ケース: マイナーキーでのhandleLongPress動作', () => {
      const minorKeyDTO: KeyDTO = {
        shortName: 'Am',
        contextName: 'A Minor',
        fifthsIndex: 0,
        isMajor: false,
        type: 'key' as const,
      };

      const minorProps: UseKeyInteractionProps = {
        ...defaultProps,
        keyDTO: minorKeyDTO,
      };

      renderHook(() => useKeyInteraction(minorProps));

      const useLongPressCall = (useLongPress as unknown as Mock).mock.calls[0][0];
      const handleLongPress = useLongPressCall.onLongPress;

      act(() => {
        handleLongPress();
      });

      expect(mockPlayScaleAtPosition).toHaveBeenCalledWith(defaultPosition, ScalePattern.Aeolian);
    });

    test('正常ケース: handleLongPressStartコールバックの動作', () => {
      const propsWithRipple: UseKeyInteractionProps = {
        ...defaultProps,
        onRippleTrigger: mockOnRippleTrigger,
      };

      renderHook(() => useKeyInteraction(propsWithRipple));

      const useLongPressCall = (useLongPress as unknown as Mock).mock.calls[0][0];
      const handleLongPressStart = useLongPressCall.onLongPressStart;

      act(() => {
        handleLongPressStart();
      });

      expect(mockOnRippleTrigger).toHaveBeenCalledTimes(1);
    });
  });

  describe('onMouseEnter機能', () => {
    test('正常ケース: マウス進入時の処理', () => {
      const { result } = renderHook(() => useKeyInteraction(defaultProps));

      act(() => {
        result.current.onMouseEnter();
      });

      expect(mockSetHoveredKey).toHaveBeenCalledWith(defaultKeyDTO);
    });

    test('正常ケース: 異なるキーでのマウス進入', () => {
      const testKeys = [
        {
          shortName: 'C',
          contextName: 'C Major',
          fifthsIndex: 0,
          isMajor: true,
          type: 'key' as const,
        },
        {
          shortName: 'G',
          contextName: 'G Major',
          fifthsIndex: 1,
          isMajor: true,
          type: 'key' as const,
        },
        {
          shortName: 'Am',
          contextName: 'A Minor',
          fifthsIndex: 0,
          isMajor: false,
          type: 'key' as const,
        },
        {
          shortName: 'Em',
          contextName: 'E Minor',
          fifthsIndex: 1,
          isMajor: false,
          type: 'key' as const,
        },
      ];

      testKeys.forEach(keyDTO => {
        const props: UseKeyInteractionProps = {
          ...defaultProps,
          keyDTO,
        };

        const { result } = renderHook(() => useKeyInteraction(props));

        act(() => {
          result.current.onMouseEnter();
        });

        expect(mockSetHoveredKey).toHaveBeenCalledWith(keyDTO);
      });
    });
  });

  describe('onMouseLeave機能', () => {
    test('正常ケース: マウス退出時の処理', () => {
      const { result } = renderHook(() => useKeyInteraction(defaultProps));

      act(() => {
        result.current.onMouseLeave();
      });

      expect(mockSetHoveredKey).toHaveBeenCalledWith(null);
    });

    test('正常ケース: 複数回のマウス退出', () => {
      const { result } = renderHook(() => useKeyInteraction(defaultProps));

      act(() => {
        result.current.onMouseLeave();
        result.current.onMouseLeave();
        result.current.onMouseLeave();
      });

      expect(mockSetHoveredKey).toHaveBeenCalledTimes(3);
      expect(mockSetHoveredKey).toHaveBeenCalledWith(null);
    });

    test('正常ケース: マウス進入→退出のサイクル', () => {
      const { result } = renderHook(() => useKeyInteraction(defaultProps));

      act(() => {
        result.current.onMouseEnter();
        result.current.onMouseLeave();
        result.current.onMouseEnter();
        result.current.onMouseLeave();
      });

      // onMouseEnterは2回、onMouseLeaveも2回呼ばれる
      expect(mockSetHoveredKey).toHaveBeenCalledTimes(4);
      expect(mockSetHoveredKey).toHaveBeenNthCalledWith(1, defaultKeyDTO);
      expect(mockSetHoveredKey).toHaveBeenNthCalledWith(2, null);
      expect(mockSetHoveredKey).toHaveBeenNthCalledWith(3, defaultKeyDTO);
      expect(mockSetHoveredKey).toHaveBeenNthCalledWith(4, null);
    });
  });

  describe('依存関係とメモ化', () => {
    test('正常ケース: Props変更時の関数再生成', () => {
      const { result, rerender } = renderHook(
        (props: UseKeyInteractionProps) => useKeyInteraction(props),
        { initialProps: defaultProps }
      );

      const firstHandlers = result.current;

      // 異なるPropsで再レンダリング
      const newProps: UseKeyInteractionProps = {
        ...defaultProps,
        keyDTO: {
          shortName: 'G',
          contextName: 'G Major',
          fifthsIndex: 1,
          isMajor: true,
          type: 'key' as const,
        },
        position: 1,
      };

      rerender(newProps);

      const secondHandlers = result.current;

      // Propsが変更されているため、新しい関数が生成される
      expect(firstHandlers.onMouseEnter).not.toBe(secondHandlers.onMouseEnter);
    });

    test('正常ケース: 同じPropsでの関数安定性', () => {
      const { result, rerender } = renderHook(() => useKeyInteraction(defaultProps));

      const firstHandlers = result.current;
      rerender();
      const secondHandlers = result.current;

      // 同じPropsなので同じ関数参照が返される
      expect(firstHandlers.onMouseEnter).toBe(secondHandlers.onMouseEnter);
      expect(firstHandlers.onMouseLeave).toBe(secondHandlers.onMouseLeave);
    });
  });

  describe('統合テスト', () => {
    test('正常ケース: フル操作シーケンス', () => {
      const { result } = renderHook(() => useKeyInteraction(defaultProps));

      // マウス進入
      act(() => {
        result.current.onMouseEnter();
      });

      // マウス退出
      act(() => {
        result.current.onMouseLeave();
      });

      // 期待される順序で呼び出されることを確認
      expect(mockSetHoveredKey).toHaveBeenNthCalledWith(1, defaultKeyDTO);
      expect(mockSetHoveredKey).toHaveBeenNthCalledWith(2, null);
    });

    test('正常ケース: useLongPressの統合テスト', () => {
      const { result } = renderHook(() => useKeyInteraction(defaultProps));

      // useLongPressのハンドラが正しく統合されていることを確認
      expect(result.current.onMouseDown).toBe(mockLongPressHandlers.onMouseDown);
      expect(result.current.onMouseUp).toBe(mockLongPressHandlers.onMouseUp);
      expect(result.current.onTouchStart).toBe(mockLongPressHandlers.onTouchStart);
      expect(result.current.onTouchEnd).toBe(mockLongPressHandlers.onTouchEnd);

      // onMouseLeaveがuseLongPressのものを上書きしていることを確認
      expect(result.current.onMouseLeave).not.toBe(mockLongPressHandlers.onMouseLeave);
    });
  });
});
