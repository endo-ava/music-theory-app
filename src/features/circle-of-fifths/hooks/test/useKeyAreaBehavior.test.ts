import { describe, test, expect, vi, beforeEach, type Mock } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useKeyAreaBehavior, type UseKeyAreaBehaviorProps } from '../useKeyAreaBehavior';
import type { KeyDTO } from '@/domain/common/IMusicalContext';
import type { CircleSegmentDTO } from '@/domain/services/CircleOfFifths';
import { useCircleOfFifthsStore } from '@/stores/circleOfFifthsStore';
import { useAudio } from '../useAudio';
import { useKeyState } from '../useKeyState';
import { useKeyInteraction } from '../useKeyInteraction';
import { useRippleEffect } from '../useRippleEffect';

// 依存関係のモック
vi.mock('@/stores/circleOfFifthsStore');
vi.mock('../useAudio');
vi.mock('../useKeyState');
vi.mock('../useKeyInteraction');
vi.mock('../useRippleEffect');

// モック関数の定義
const mockSetSelectedKey = vi.fn();
const mockSetHoveredKey = vi.fn();
const mockPlayChordAtPosition = vi.fn();
const mockPlayScaleAtPosition = vi.fn();

const mockStates = {
  isSelected: false,
  isHovered: false,
  fillClassName: 'fill-key-area-major',
  textClassName: 'text-key-major font-key-major',
};

const mockHandlers = {
  onMouseEnter: vi.fn(),
  onMouseLeave: vi.fn(),
  onMouseDown: vi.fn(),
  onMouseUp: vi.fn(),
  onMouseMove: vi.fn(),
  onTouchStart: vi.fn(),
  onTouchEnd: vi.fn(),
  onTouchMove: vi.fn(),
};

const mockRipple = {
  isRippleActive: false,
  triggerRipple: vi.fn(),
  resetRipple: vi.fn(),
};

describe('useKeyAreaBehavior integration hook', () => {
  // テスト用のデフォルトデータ
  const mockSegment: CircleSegmentDTO = {
    position: 0,
    majorKey: {
      shortName: 'C',
      contextName: 'C Major',
      fifthsIndex: 0,
      isMajor: true,
      type: 'key' as const,
    },
    minorKey: {
      shortName: 'Am',
      contextName: 'A Minor',
      fifthsIndex: 0,
      isMajor: false,
      type: 'key' as const,
    },
    keySignature: '',
  };

  const defaultKeyDTO: KeyDTO = {
    shortName: 'C',
    contextName: 'C Major',
    fifthsIndex: 0,
    isMajor: true,
    type: 'key' as const,
  };

  const defaultProps: UseKeyAreaBehaviorProps = {
    keyDTO: defaultKeyDTO,
    segment: mockSegment,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // useCircleOfFifthsStoreのモック設定
    (useCircleOfFifthsStore as unknown as Mock).mockReturnValue({
      selectedKey: null,
      hoveredKey: null,
      setSelectedKey: mockSetSelectedKey,
      setHoveredKey: mockSetHoveredKey,
    });

    // useAudioのモック設定
    (useAudio as unknown as Mock).mockReturnValue({
      playChordAtPosition: mockPlayChordAtPosition,
      playScaleAtPosition: mockPlayScaleAtPosition,
    });

    // 個別フックのモック設定
    (useKeyState as unknown as Mock).mockReturnValue(mockStates);
    (useKeyInteraction as unknown as Mock).mockReturnValue(mockHandlers);
    (useRippleEffect as unknown as Mock).mockReturnValue(mockRipple);
  });

  describe('統合機能', () => {
    test('正常ケース: フックが正しい構造を返す', () => {
      const { result } = renderHook(() => useKeyAreaBehavior(defaultProps));

      expect(result.current).toHaveProperty('states');
      expect(result.current).toHaveProperty('handlers');
      expect(result.current).toHaveProperty('ripple');

      // 各プロパティが個別フックから返されることを確認
      expect(result.current.states).toBe(mockStates);
      expect(result.current.handlers).toBe(mockHandlers);
      expect(result.current.ripple).toBe(mockRipple);
    });

    test('正常ケース: 個別フックが正しい引数で呼ばれる', () => {
      renderHook(() => useKeyAreaBehavior(defaultProps));

      // useKeyStateが正しい引数で呼ばれることを確認
      expect(useKeyState).toHaveBeenCalledWith({
        keyDTO: defaultKeyDTO,
        selectedKey: null,
        hoveredKey: null,
      });

      // useKeyInteractionが正しい引数で呼ばれることを確認
      expect(useKeyInteraction).toHaveBeenCalledWith({
        keyDTO: defaultKeyDTO,
        position: mockSegment.position,
        setSelectedKey: mockSetSelectedKey,
        setHoveredKey: mockSetHoveredKey,
        playChordAtPosition: mockPlayChordAtPosition,
        playScaleAtPosition: mockPlayScaleAtPosition,
        onRippleTrigger: mockRipple.triggerRipple,
      });

      // useRippleEffectが呼ばれることを確認
      expect(useRippleEffect).toHaveBeenCalled();
    });

    test('正常ケース: ストア状態変更時の個別フック再実行', () => {
      const { rerender } = renderHook(() => useKeyAreaBehavior(defaultProps));

      // ストア状態を変更してモックを更新
      (useCircleOfFifthsStore as unknown as Mock).mockReturnValue({
        selectedKey: defaultKeyDTO,
        hoveredKey: null,
        setSelectedKey: mockSetSelectedKey,
        setHoveredKey: mockSetHoveredKey,
      });

      rerender();

      // useKeyStateが新しいストア状態で呼ばれることを確認
      expect(useKeyState).toHaveBeenLastCalledWith({
        keyDTO: defaultKeyDTO,
        selectedKey: defaultKeyDTO,
        hoveredKey: null,
      });
    });
  });

  describe('異なるセグメントでの動作', () => {
    test('正常ケース: 異なるポジションのセグメント', () => {
      const differentSegment: CircleSegmentDTO = {
        ...mockSegment,
        position: 5,
      };

      const props: UseKeyAreaBehaviorProps = {
        keyDTO: defaultKeyDTO,
        segment: differentSegment,
      };

      renderHook(() => useKeyAreaBehavior(props));

      // useKeyInteractionが新しいポジションで呼ばれることを確認
      expect(useKeyInteraction).toHaveBeenCalledWith({
        keyDTO: defaultKeyDTO,
        position: 5,
        setSelectedKey: mockSetSelectedKey,
        setHoveredKey: mockSetHoveredKey,
        playChordAtPosition: mockPlayChordAtPosition,
        playScaleAtPosition: mockPlayScaleAtPosition,
        onRippleTrigger: mockRipple.triggerRipple,
      });
    });

    test('正常ケース: 異なるキーでの動作', () => {
      const differentKeyDTO: KeyDTO = {
        shortName: 'G',
        contextName: 'G Major',
        fifthsIndex: 1,
        isMajor: true,
        type: 'key' as const,
      };

      const props: UseKeyAreaBehaviorProps = {
        keyDTO: differentKeyDTO,
        segment: mockSegment,
      };

      renderHook(() => useKeyAreaBehavior(props));

      // 個別フックが新しいキーで呼ばれることを確認
      expect(useKeyState).toHaveBeenCalledWith({
        keyDTO: differentKeyDTO,
        selectedKey: null,
        hoveredKey: null,
      });

      expect(useKeyInteraction).toHaveBeenCalledWith({
        keyDTO: differentKeyDTO,
        position: mockSegment.position,
        setSelectedKey: mockSetSelectedKey,
        setHoveredKey: mockSetHoveredKey,
        playChordAtPosition: mockPlayChordAtPosition,
        playScaleAtPosition: mockPlayScaleAtPosition,
        onRippleTrigger: mockRipple.triggerRipple,
      });
    });
  });

  describe('リップルエフェクト統合', () => {
    test('正常ケース: リップルトリガーが正しく統合される', () => {
      renderHook(() => useKeyAreaBehavior(defaultProps));

      // useKeyInteractionのonRippleTriggerにuseRippleEffectのtriggerRippleが渡されることを確認
      const keyInteractionCall = (useKeyInteraction as unknown as Mock).mock.calls[0][0];
      expect(keyInteractionCall.onRippleTrigger).toBe(mockRipple.triggerRipple);
    });

    test('正常ケース: リップル状態が正しく返される', () => {
      const activeRippleMock = {
        isRippleActive: true,
        triggerRipple: vi.fn(),
        resetRipple: vi.fn(),
      };

      (useRippleEffect as unknown as Mock).mockReturnValue(activeRippleMock);

      const { result } = renderHook(() => useKeyAreaBehavior(defaultProps));

      expect(result.current.ripple.isRippleActive).toBe(true);
      expect(result.current.ripple.triggerRipple).toBe(activeRippleMock.triggerRipple);
      expect(result.current.ripple.resetRipple).toBe(activeRippleMock.resetRipple);
    });
  });

  describe('Props変更の影響', () => {
    test('正常ケース: Props変更時の個別フック再実行', () => {
      const { rerender } = renderHook(
        (props: UseKeyAreaBehaviorProps) => useKeyAreaBehavior(props),
        { initialProps: defaultProps }
      );

      // Props変更
      const newKeyDTO: KeyDTO = {
        shortName: 'D',
        contextName: 'D Major',
        fifthsIndex: 2,
        isMajor: true,
        type: 'key' as const,
      };

      const newProps: UseKeyAreaBehaviorProps = {
        keyDTO: newKeyDTO,
        segment: { ...mockSegment, position: 2 },
      };

      rerender(newProps);

      // 個別フックが新しいPropsで呼ばれることを確認
      expect(useKeyState).toHaveBeenLastCalledWith({
        keyDTO: newKeyDTO,
        selectedKey: null,
        hoveredKey: null,
      });

      expect(useKeyInteraction).toHaveBeenLastCalledWith({
        keyDTO: newKeyDTO,
        position: 2,
        setSelectedKey: mockSetSelectedKey,
        setHoveredKey: mockSetHoveredKey,
        playChordAtPosition: mockPlayChordAtPosition,
        playScaleAtPosition: mockPlayScaleAtPosition,
        onRippleTrigger: mockRipple.triggerRipple,
      });
    });

    test('正常ケース: 同じPropsでの安定性', () => {
      const { result, rerender } = renderHook(() => useKeyAreaBehavior(defaultProps));

      const firstResult = result.current;
      rerender();
      const secondResult = result.current;

      // 同じモックオブジェクトが返されることを確認
      expect(firstResult.states).toBe(secondResult.states);
      expect(firstResult.handlers).toBe(secondResult.handlers);
      expect(firstResult.ripple).toBe(secondResult.ripple);
    });
  });

  describe('エラーハンドリング', () => {
    test('異常ケース: useAudioがundefinedを返す場合', () => {
      (useAudio as unknown as Mock).mockReturnValue({
        playChordAtPosition: undefined,
        playScaleAtPosition: undefined,
      });

      renderHook(() => useKeyAreaBehavior(defaultProps));

      // useKeyInteractionがundefinedの関数でも呼ばれることを確認
      expect(useKeyInteraction).toHaveBeenCalledWith({
        keyDTO: defaultKeyDTO,
        position: mockSegment.position,
        setSelectedKey: mockSetSelectedKey,
        setHoveredKey: mockSetHoveredKey,
        playChordAtPosition: undefined,
        playScaleAtPosition: undefined,
        onRippleTrigger: mockRipple.triggerRipple,
      });
    });

    test('異常ケース: ストア関数がnullの場合', () => {
      (useCircleOfFifthsStore as unknown as Mock).mockReturnValue({
        selectedKey: null,
        hoveredKey: null,
        setSelectedKey: null,
        setHoveredKey: null,
      });

      renderHook(() => useKeyAreaBehavior(defaultProps));

      // useKeyInteractionがnullの関数でも呼ばれることを確認
      expect(useKeyInteraction).toHaveBeenCalledWith({
        keyDTO: defaultKeyDTO,
        position: mockSegment.position,
        setSelectedKey: null,
        setHoveredKey: null,
        playChordAtPosition: mockPlayChordAtPosition,
        playScaleAtPosition: mockPlayScaleAtPosition,
        onRippleTrigger: mockRipple.triggerRipple,
      });
    });
  });
});
