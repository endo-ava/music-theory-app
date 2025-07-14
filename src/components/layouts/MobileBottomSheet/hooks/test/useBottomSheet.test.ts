import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBottomSheet } from '../useBottomSheet';
import { useFixedViewportHeight, useBodyScrollLock } from '@/shared/hooks';
import { findScrollableParent, shouldAllowDrag } from '@/shared/utils';
import { SHEET_CONFIG } from '../../constants';

// 依存フックをモック
vi.mock('@/shared/hooks', () => ({
  useFixedViewportHeight: vi.fn(),
  useBodyScrollLock: vi.fn(),
}));

// 依存ユーティリティをモック
vi.mock('@/shared/utils', () => ({
  findScrollableParent: vi.fn(),
  shouldAllowDrag: vi.fn(),
}));

describe('useBottomSheet', () => {
  // モック関数の型定義
  const mockUseFixedViewportHeight = useFixedViewportHeight as ReturnType<typeof vi.fn>;
  const mockUseBodyScrollLock = useBodyScrollLock as ReturnType<typeof vi.fn>;
  const mockFindScrollableParent = findScrollableParent as ReturnType<typeof vi.fn>;
  const mockShouldAllowDrag = shouldAllowDrag as ReturnType<typeof vi.fn>;

  // モック変数
  let mockWindowHeight: number;
  let mockBodyScrollLock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // デフォルト値を設定
    mockWindowHeight = 1000;
    mockBodyScrollLock = vi.fn();

    // useFixedViewportHeight のモック
    mockUseFixedViewportHeight.mockReturnValue(mockWindowHeight);

    // useBodyScrollLock のモック
    mockUseBodyScrollLock.mockImplementation(mockBodyScrollLock);

    // findScrollableParent のモック（デフォルトは null）
    mockFindScrollableParent.mockReturnValue(null);

    // shouldAllowDrag のモック（デフォルトは true）
    mockShouldAllowDrag.mockReturnValue(true);

    // DOM要素をクリア
    document.body.innerHTML = '';

    // キーボードイベント用のモック
    document.addEventListener = vi.fn();
    document.removeEventListener = vi.fn();

    // console.errorをモック（不要なエラーログを抑制）
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('初期化', () => {
    it('正常ケース: フックが正常に初期化される', () => {
      const { result } = renderHook(() => useBottomSheet());

      expect(result.current).toHaveProperty('sheetRef');
      expect(result.current).toHaveProperty('bottomSheetState');
      expect(result.current).toHaveProperty('isExpanded');
      expect(result.current).toHaveProperty('isHalf');
      expect(result.current).toHaveProperty('isCollapsed');
      expect(result.current).toHaveProperty('y');
      expect(result.current).toHaveProperty('sheetHeight');
      expect(result.current).toHaveProperty('dragConstraints');
      expect(result.current).toHaveProperty('toggleBottomSheet');
      expect(result.current).toHaveProperty('collapseBottomSheet');
      expect(result.current).toHaveProperty('handleDragStart');
      expect(result.current).toHaveProperty('handleDragEnd');
    });

    it('正常ケース: 初期状態で collapsed である', () => {
      const { result } = renderHook(() => useBottomSheet());

      expect(result.current.bottomSheetState).toBe('collapsed');
      expect(result.current.isCollapsed).toBe(true);
      expect(result.current.isHalf).toBe(false);
      expect(result.current.isExpanded).toBe(false);
    });

    it('正常ケース: 依存フックが正しく呼ばれる', () => {
      renderHook(() => useBottomSheet());

      expect(mockUseFixedViewportHeight).toHaveBeenCalledTimes(1);
      expect(mockUseBodyScrollLock).toHaveBeenCalledWith(false); // isCollapsed = true なので
    });

    it('正常ケース: シートの高さが正しく計算される', () => {
      const { result } = renderHook(() => useBottomSheet());

      const expectedHeight = mockWindowHeight * SHEET_CONFIG.vh;
      expect(result.current.sheetHeight).toBe(expectedHeight);
    });

    it('正常ケース: スナップポイントが正しく計算される', () => {
      const { result } = renderHook(() => useBottomSheet());

      const expectedSheetHeight = mockWindowHeight * SHEET_CONFIG.vh;
      const expectedY = expectedSheetHeight - SHEET_CONFIG.collapsedVisiblePx;

      expect(result.current.y).toBe(expectedY);

      expect(result.current.dragConstraints).toEqual({
        top: SHEET_CONFIG.expandedTopMarginPx,
        bottom: expectedSheetHeight - SHEET_CONFIG.collapsedVisiblePx,
      });
    });

    it('正常ケース: isDragAllowed の初期値は true である', () => {
      const { result } = renderHook(() => useBottomSheet());

      // isDragAllowedが内部stateなので直接アクセスできないが、
      // handleDragEndの動作でデフォルト値がtrueであることを確認
      const mockEndPanInfo = {
        offset: { x: 0, y: -100 },
        velocity: { x: 0, y: -600 }, // 高速上スワイプ
        point: { x: 0, y: -100 },
        delta: { x: 0, y: -100 },
      };

      // 初期状態はcollapsed
      expect(result.current.isCollapsed).toBe(true);

      // isDragAllowedがtrueなので通常の処理が動作する
      act(() => {
        result.current.handleDragEnd(null, mockEndPanInfo);
      });

      // 状態が変更される（isDragAllowedがtrueだから）
      expect(result.current.isHalf).toBe(true);
    });
  });

  describe('windowHeight 依存の計算', () => {
    it('境界値ケース: windowHeight = 0 の場合', () => {
      mockUseFixedViewportHeight.mockReturnValue(0);

      const { result } = renderHook(() => useBottomSheet());

      expect(result.current.sheetHeight).toBe(0);
      expect(result.current.y).toBe(-SHEET_CONFIG.collapsedVisiblePx);
    });

    it('正常ケース: windowHeight に基づいて値が正しく計算される', () => {
      const testHeight = 1200;
      mockUseFixedViewportHeight.mockReturnValue(testHeight);

      const { result } = renderHook(() => useBottomSheet());

      // 計算された値の確認
      const expectedSheetHeight = testHeight * SHEET_CONFIG.vh;
      expect(result.current.sheetHeight).toBe(expectedSheetHeight);
    });
  });

  describe('状態管理', () => {
    it('正常ケース: toggleBottomSheet で状態が循環する', () => {
      const { result } = renderHook(() => useBottomSheet());

      // collapsed → half
      act(() => {
        result.current.toggleBottomSheet();
      });
      expect(result.current.bottomSheetState).toBe('half');
      expect(result.current.isHalf).toBe(true);

      // half → expanded
      act(() => {
        result.current.toggleBottomSheet();
      });
      expect(result.current.bottomSheetState).toBe('expanded');
      expect(result.current.isExpanded).toBe(true);

      // expanded → half
      act(() => {
        result.current.toggleBottomSheet();
      });
      expect(result.current.bottomSheetState).toBe('half');
      expect(result.current.isHalf).toBe(true);
    });

    it('正常ケース: collapseBottomSheet で collapsed になる', () => {
      const { result } = renderHook(() => useBottomSheet());

      // まず expanded にする
      act(() => {
        result.current.toggleBottomSheet(); // → half
        result.current.toggleBottomSheet(); // → expanded
      });
      expect(result.current.isExpanded).toBe(true);

      // collapse する
      act(() => {
        result.current.collapseBottomSheet();
      });
      expect(result.current.bottomSheetState).toBe('collapsed');
      expect(result.current.isCollapsed).toBe(true);
    });

    it('正常ケース: 状態変更時に useBodyScrollLock が適切に呼ばれる', () => {
      const { result } = renderHook(() => useBottomSheet());

      // 初期状態: collapsed (useBodyScrollLock(false))
      expect(mockUseBodyScrollLock).toHaveBeenLastCalledWith(false);

      // half に変更
      act(() => {
        result.current.toggleBottomSheet();
      });
      expect(mockUseBodyScrollLock).toHaveBeenLastCalledWith(true);

      // expanded に変更
      act(() => {
        result.current.toggleBottomSheet();
      });
      expect(mockUseBodyScrollLock).toHaveBeenLastCalledWith(true);

      // collapsed に戻す
      act(() => {
        result.current.collapseBottomSheet();
      });
      expect(mockUseBodyScrollLock).toHaveBeenLastCalledWith(false);
    });
  });

  describe('ドラッグ処理', () => {
    it('正常ケース: handleDragEnd が存在し呼び出し可能である', () => {
      const { result } = renderHook(() => useBottomSheet());

      expect(result.current.handleDragEnd).toBeTypeOf('function');

      // 基本的な呼び出しテスト（エラーを投げないことを確認）
      expect(() => {
        const mockPanInfo = {
          offset: { x: 0, y: 50 },
          velocity: { x: 0, y: 100 },
          point: { x: 0, y: 50 },
          delta: { x: 0, y: 50 },
        };
        result.current.handleDragEnd(null, mockPanInfo);
      }).not.toThrow();
    });

    it('正常ケース: 高速上スワイプで状態が上がる', () => {
      const { result } = renderHook(() => useBottomSheet());

      const mockPanInfo = {
        offset: { x: 0, y: -50 },
        velocity: { x: 0, y: -600 }, // velocityThreshold (500) を超える
        point: { x: 0, y: -50 },
        delta: { x: 0, y: -50 },
      };

      // collapsed から開始
      expect(result.current.isCollapsed).toBe(true);

      act(() => {
        result.current.handleDragEnd(null, mockPanInfo);
      });

      // half になることを確認
      expect(result.current.isHalf).toBe(true);
    });

    it('正常ケース: 高速下スワイプで状態が下がる', () => {
      const { result } = renderHook(() => useBottomSheet());

      // まず expanded にする
      act(() => {
        result.current.toggleBottomSheet(); // → half
        result.current.toggleBottomSheet(); // → expanded
      });
      expect(result.current.isExpanded).toBe(true);

      const mockPanInfo = {
        offset: { x: 0, y: 50 },
        velocity: { x: 0, y: 600 }, // velocityThreshold (500) を超える
        point: { x: 0, y: 50 },
        delta: { x: 0, y: 50 },
      };

      act(() => {
        result.current.handleDragEnd(null, mockPanInfo);
      });

      // half になることを確認
      expect(result.current.isHalf).toBe(true);
    });

    it('境界値ケース: velocityThreshold ちょうどの値', () => {
      const { result } = renderHook(() => useBottomSheet());

      const mockPanInfo = {
        offset: { x: 0, y: -50 },
        velocity: { x: 0, y: -(SHEET_CONFIG.velocityThreshold + 1) }, // 境界値を超える
        point: { x: 0, y: -50 },
        delta: { x: 0, y: -50 },
      };

      act(() => {
        result.current.handleDragEnd(null, mockPanInfo);
      });

      // 境界値を超えるので高速スワイプとして処理される
      expect(result.current.isHalf).toBe(true);
    });

    it('正常ケース: expanded状態で高速下スワイプ -> collapseBottomSheet呼び出し', () => {
      const { result } = renderHook(() => useBottomSheet());

      // expanded状態にする
      act(() => {
        result.current.toggleBottomSheet(); // → half
        result.current.toggleBottomSheet(); // → expanded
      });
      expect(result.current.isExpanded).toBe(true);

      const mockPanInfo = {
        offset: { x: 0, y: 50 },
        velocity: { x: 0, y: 600 }, // velocityThreshold (500) を超える
        point: { x: 0, y: 50 },
        delta: { x: 0, y: 50 },
      };

      act(() => {
        result.current.handleDragEnd(null, mockPanInfo);
      });

      // half状態になる（expanded -> half への変更）
      expect(result.current.isHalf).toBe(true);
    });

    it('正常ケース: half状態で高速下スワイプ -> collapseBottomSheet呼び出し', () => {
      const { result } = renderHook(() => useBottomSheet());

      // half状態にする
      act(() => {
        result.current.toggleBottomSheet(); // → half
      });
      expect(result.current.isHalf).toBe(true);

      const mockPanInfo = {
        offset: { x: 0, y: 50 },
        velocity: { x: 0, y: 600 }, // velocityThreshold (500) を超える
        point: { x: 0, y: 50 },
        delta: { x: 0, y: 50 },
      };

      act(() => {
        result.current.handleDragEnd(null, mockPanInfo);
      });

      // collapsed状態になる
      expect(result.current.isCollapsed).toBe(true);
    });

    it('正常ケース: collapsed状態で低速上ドラッグ(-50px以下)', () => {
      const { result } = renderHook(() => useBottomSheet());

      expect(result.current.isCollapsed).toBe(true);

      const mockPanInfo = {
        offset: { x: 0, y: -60 }, // -50px以下の上ドラッグ
        velocity: { x: 0, y: -100 }, // velocityThresholdを下回る
        point: { x: 0, y: -60 },
        delta: { x: 0, y: -60 },
      };

      act(() => {
        result.current.handleDragEnd(null, mockPanInfo);
      });

      // half状態になる
      expect(result.current.isHalf).toBe(true);
    });

    it('正常ケース: half状態で高速上スワイプ -> expandBottomSheet呼び出し(88行目)', () => {
      const { result } = renderHook(() => useBottomSheet());

      // まずhalf状態にする
      act(() => {
        result.current.toggleBottomSheet(); // collapsed → half
      });
      expect(result.current.isHalf).toBe(true);

      const mockPanInfo = {
        offset: { x: 0, y: -50 },
        velocity: { x: 0, y: -600 }, // velocityThreshold (500) を超える負の値
        point: { x: 0, y: -50 },
        delta: { x: 0, y: -50 },
      };

      act(() => {
        result.current.handleDragEnd(null, mockPanInfo);
      });

      // expanded状態になる（88行目のexpandBottomSheet()が実行される）
      expect(result.current.isExpanded).toBe(true);
    });

    it('正常ケース: 低速ドラッグで最近点へのスナップ - currentDistance < prevDistance が true(110行目)', () => {
      const { result } = renderHook(() => useBottomSheet());

      // half状態にする
      act(() => {
        result.current.toggleBottomSheet(); // collapsed → half
      });
      expect(result.current.isHalf).toBe(true);

      // expanded位置に近い位置まで大きく上ドラッグ（expandedが最近点になる）
      const mockPanInfo = {
        offset: { x: 0, y: -400 }, // 大きく上ドラッグ
        velocity: { x: 0, y: -200 }, // velocityThreshold(500)を下回る低速
        point: { x: 0, y: -400 },
        delta: { x: 0, y: -400 },
      };

      act(() => {
        result.current.handleDragEnd(null, mockPanInfo);
      });

      // expanded状態が最も近いのでexpanded状態になる（110行目でcurrentDistance < prevDistanceがtrue）
      expect(result.current.isExpanded).toBe(true);
    });

    it('正常ケース: 低速ドラッグで最近点へのスナップ - currentDistance < prevDistance が false(110行目)', () => {
      const { result } = renderHook(() => useBottomSheet());

      // half状態にする
      act(() => {
        result.current.toggleBottomSheet(); // collapsed → half
      });
      expect(result.current.isHalf).toBe(true);

      // 現在のhalf位置に近い位置で少しだけドラッグ（halfが最近点のまま）
      const mockPanInfo = {
        offset: { x: 0, y: 10 }, // 少し下ドラッグ
        velocity: { x: 0, y: 100 }, // velocityThreshold(500)を下回る低速
        point: { x: 0, y: 10 },
        delta: { x: 0, y: 10 },
      };

      act(() => {
        result.current.handleDragEnd(null, mockPanInfo);
      });

      // half状態が最も近いのでhalf状態のまま（110行目でcurrentDistance < prevDistanceがfalseでprevStateを返す）
      expect(result.current.isHalf).toBe(true);
    });

    it('正常ケース: isDragAllowed が false の場合、handleDragEnd は早期 return する', () => {
      const { result } = renderHook(() => useBottomSheet());

      // まずhandleDragStartでisDragAllowedをfalseにする
      const mockScrollableElement = document.createElement('div');
      mockFindScrollableParent.mockReturnValue(mockScrollableElement);
      mockShouldAllowDrag.mockReturnValue(false);

      const mockStartEvent = {
        target: document.createElement('div'),
      } as unknown as MouseEvent;
      const mockStartPanInfo = {
        offset: { x: 0, y: 0 },
        velocity: { x: 0, y: 100 },
        point: { x: 0, y: 0 },
        delta: { x: 0, y: 0 },
      };

      // handleDragStartでisDragAllowedをfalseにする
      act(() => {
        result.current.handleDragStart(mockStartEvent, mockStartPanInfo);
      });

      // 初期状態をcollapsedで確認
      expect(result.current.isCollapsed).toBe(true);

      // isDragAllowedがfalseの状態でhandleDragEndを呼ぶ
      const mockEndPanInfo = {
        offset: { x: 0, y: -100 },
        velocity: { x: 0, y: -600 }, // 高速上スワイプ（通常なら状態変更される）
        point: { x: 0, y: -100 },
        delta: { x: 0, y: -100 },
      };

      act(() => {
        result.current.handleDragEnd(null, mockEndPanInfo);
      });

      // isDragAllowedがfalseなので状態は変更されない
      expect(result.current.isCollapsed).toBe(true);
    });

    it('正常ケース: isDragAllowed が true の場合、handleDragEnd は通常の処理を継続', () => {
      const { result } = renderHook(() => useBottomSheet());

      // handleDragStartでisDragAllowedをtrueにする（デフォルト）
      const mockScrollableElement = document.createElement('div');
      mockFindScrollableParent.mockReturnValue(mockScrollableElement);
      mockShouldAllowDrag.mockReturnValue(true);

      const mockStartEvent = {
        target: document.createElement('div'),
      } as unknown as MouseEvent;
      const mockStartPanInfo = {
        offset: { x: 0, y: 0 },
        velocity: { x: 0, y: 100 },
        point: { x: 0, y: 0 },
        delta: { x: 0, y: 0 },
      };

      // handleDragStartでisDragAllowedをtrueにする
      act(() => {
        result.current.handleDragStart(mockStartEvent, mockStartPanInfo);
      });

      // 初期状態をcollapsedで確認
      expect(result.current.isCollapsed).toBe(true);

      // isDragAllowedがtrueの状態でhandleDragEndを呼ぶ
      const mockEndPanInfo = {
        offset: { x: 0, y: -100 },
        velocity: { x: 0, y: -600 }, // 高速上スワイプ
        point: { x: 0, y: -100 },
        delta: { x: 0, y: -100 },
      };

      act(() => {
        result.current.handleDragEnd(null, mockEndPanInfo);
      });

      // isDragAllowedがtrueなので通常の処理が実行され、状態が変更される
      expect(result.current.isHalf).toBe(true);
    });

    it('正常ケース: isDragAllowed が false の場合、handleDragEnd 終了時に true にリセットされる', () => {
      const { result } = renderHook(() => useBottomSheet());

      // handleDragStartでisDragAllowedをfalseにする
      const mockScrollableElement = document.createElement('div');
      mockFindScrollableParent.mockReturnValue(mockScrollableElement);
      mockShouldAllowDrag.mockReturnValue(false);

      const mockStartEvent = {
        target: document.createElement('div'),
      } as unknown as MouseEvent;
      const mockStartPanInfo = {
        offset: { x: 0, y: 0 },
        velocity: { x: 0, y: 100 },
        point: { x: 0, y: 0 },
        delta: { x: 0, y: 0 },
      };

      // handleDragStartでisDragAllowedをfalseにする
      act(() => {
        result.current.handleDragStart(mockStartEvent, mockStartPanInfo);
      });

      // isDragAllowedがfalseの状態でhandleDragEndを呼ぶ
      const mockEndPanInfo = {
        offset: { x: 0, y: -100 },
        velocity: { x: 0, y: -600 },
        point: { x: 0, y: -100 },
        delta: { x: 0, y: -100 },
      };

      act(() => {
        result.current.handleDragEnd(null, mockEndPanInfo);
      });

      // 次のドラッグで正常に動作することを確認（isDragAllowedがtrueにリセットされている）
      mockShouldAllowDrag.mockReturnValue(true);

      act(() => {
        result.current.handleDragStart(mockStartEvent, mockStartPanInfo);
      });

      act(() => {
        result.current.handleDragEnd(null, mockEndPanInfo);
      });

      // 今度は状態が変更される
      expect(result.current.isHalf).toBe(true);
    });
  });

  describe('isDragAllowed state 管理', () => {
    it('正常ケース: handleDragStart でスクロール不可の場合に isDragAllowed が false に変更', () => {
      const { result } = renderHook(() => useBottomSheet());

      // スクロール可能な要素があり、shouldAllowDrag が false を返す
      const mockScrollableElement = document.createElement('div');
      mockFindScrollableParent.mockReturnValue(mockScrollableElement);
      mockShouldAllowDrag.mockReturnValue(false);

      const mockStartEvent = {
        target: document.createElement('div'),
      } as unknown as MouseEvent;
      const mockStartPanInfo = {
        offset: { x: 0, y: 0 },
        velocity: { x: 0, y: -100 }, // 上方向
        point: { x: 0, y: 0 },
        delta: { x: 0, y: 0 },
      };

      act(() => {
        result.current.handleDragStart(mockStartEvent, mockStartPanInfo);
      });

      // isDragAllowedがfalseになったことを、handleDragEndの動作で確認
      const mockEndPanInfo = {
        offset: { x: 0, y: -100 },
        velocity: { x: 0, y: -600 }, // 高速上スワイプ（通常なら状態変更される）
        point: { x: 0, y: -100 },
        delta: { x: 0, y: -100 },
      };

      const initialState = result.current.bottomSheetState;

      act(() => {
        result.current.handleDragEnd(null, mockEndPanInfo);
      });

      // isDragAllowedがfalseなので状態は変更されない
      expect(result.current.bottomSheetState).toBe(initialState);
    });

    it('正常ケース: handleDragStart でスクロール可能の場合に isDragAllowed が true に変更', () => {
      const { result } = renderHook(() => useBottomSheet());

      // スクロール可能な要素があり、shouldAllowDrag が true を返す
      const mockScrollableElement = document.createElement('div');
      mockFindScrollableParent.mockReturnValue(mockScrollableElement);
      mockShouldAllowDrag.mockReturnValue(true);

      const mockStartEvent = {
        target: document.createElement('div'),
      } as unknown as MouseEvent;
      const mockStartPanInfo = {
        offset: { x: 0, y: 0 },
        velocity: { x: 0, y: 100 }, // 下方向
        point: { x: 0, y: 0 },
        delta: { x: 0, y: 0 },
      };

      act(() => {
        result.current.handleDragStart(mockStartEvent, mockStartPanInfo);
      });

      // isDragAllowedがtrueになったことを、handleDragEndの動作で確認
      const mockEndPanInfo = {
        offset: { x: 0, y: -100 },
        velocity: { x: 0, y: -600 }, // 高速上スワイプ
        point: { x: 0, y: -100 },
        delta: { x: 0, y: -100 },
      };

      // 初期状態はcollapsed
      expect(result.current.isCollapsed).toBe(true);

      act(() => {
        result.current.handleDragEnd(null, mockEndPanInfo);
      });

      // isDragAllowedがtrueなので状態が変更される
      expect(result.current.isHalf).toBe(true);
    });

    it('正常ケース: handleDragStart でスクロール要素がない場合に isDragAllowed が true に保持', () => {
      const { result } = renderHook(() => useBottomSheet());

      // スクロール可能な要素がない
      mockFindScrollableParent.mockReturnValue(null);

      const mockStartEvent = {
        target: document.createElement('div'),
      } as unknown as MouseEvent;
      const mockStartPanInfo = {
        offset: { x: 0, y: 0 },
        velocity: { x: 0, y: 100 },
        point: { x: 0, y: 0 },
        delta: { x: 0, y: 0 },
      };

      act(() => {
        result.current.handleDragStart(mockStartEvent, mockStartPanInfo);
      });

      // isDragAllowedがtrueに保持されることを、handleDragEndの動作で確認
      const mockEndPanInfo = {
        offset: { x: 0, y: -100 },
        velocity: { x: 0, y: -600 }, // 高速上スワイプ
        point: { x: 0, y: -100 },
        delta: { x: 0, y: -100 },
      };

      // 初期状態はcollapsed
      expect(result.current.isCollapsed).toBe(true);

      act(() => {
        result.current.handleDragEnd(null, mockEndPanInfo);
      });

      // isDragAllowedがtrueなので状態が変更される
      expect(result.current.isHalf).toBe(true);
    });
  });

  describe('キーボードイベント処理', () => {
    it('正常ケース: Escape キーで collapsed になる', () => {
      const { result } = renderHook(() => useBottomSheet());

      // まず expanded にする
      act(() => {
        result.current.toggleBottomSheet(); // → half
        result.current.toggleBottomSheet(); // → expanded
      });
      expect(result.current.isExpanded).toBe(true);

      // Escape キーイベントをシミュレート
      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });

      // addEventListener の呼び出しからハンドラーを取得
      const addEventListenerCalls = (document.addEventListener as ReturnType<typeof vi.fn>).mock
        .calls;
      const keydownHandler = addEventListenerCalls.find(
        (call: unknown[]) => call[0] === 'keydown'
      )?.[1] as ((event: KeyboardEvent) => void) | undefined;

      expect(keydownHandler).toBeDefined();

      act(() => {
        keydownHandler!(escapeEvent);
      });

      expect(result.current.isCollapsed).toBe(true);
    });

    it('正常ケース: アンマウント時にイベントリスナーが削除される', () => {
      const { unmount } = renderHook(() => useBottomSheet());

      // addEventListener が呼ばれることを確認
      expect(document.addEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));

      unmount();

      // removeEventListener が呼ばれることを確認
      expect(document.removeEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
    });
  });

  describe('フォーカス管理', () => {
    it('正常ケース: expanded 時にフォーカス可能な要素にフォーカスが移動する', () => {
      // フォーカス可能な要素をモック
      const mockFocusableElement = {
        focus: vi.fn(),
      };

      const mockSheetRef = {
        current: {
          querySelector: vi.fn().mockReturnValue(mockFocusableElement),
        },
      };

      const { result } = renderHook(() => useBottomSheet());

      // sheetRef を設定
      result.current.sheetRef.current = mockSheetRef.current as unknown as HTMLDivElement;

      // expanded 状態に変更
      act(() => {
        result.current.toggleBottomSheet(); // → half
        result.current.toggleBottomSheet(); // → expanded
      });

      // querySelector が適切なセレクタで呼ばれることを確認
      expect(mockSheetRef.current.querySelector).toHaveBeenCalledWith(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      // focus が呼ばれることを確認
      expect(mockFocusableElement.focus).toHaveBeenCalledTimes(1);
    });

    it('正常ケース: フォーカス可能な要素が存在しない場合にエラーを投げない', () => {
      const mockSheetRef = {
        current: {
          querySelector: vi.fn().mockReturnValue(null),
        },
      };

      const { result } = renderHook(() => useBottomSheet());

      // sheetRef を設定
      result.current.sheetRef.current = mockSheetRef.current as unknown as HTMLDivElement;

      // expanded 状態に変更してもエラーを投げないことを確認
      expect(() => {
        act(() => {
          result.current.toggleBottomSheet(); // → half
          result.current.toggleBottomSheet(); // → expanded
        });
      }).not.toThrow();
    });
  });

  describe('エラー処理', () => {
    it('異常ケース: useFixedViewportHeight がエラーを返す場合', () => {
      mockUseFixedViewportHeight.mockImplementation(() => {
        throw new Error('Fixed viewport height error');
      });

      expect(() => {
        renderHook(() => useBottomSheet());
      }).toThrow('Fixed viewport height error');
    });

    it('異常ケース: useBodyScrollLock がエラーを返す場合', () => {
      mockUseBodyScrollLock.mockImplementation(() => {
        throw new Error('Body scroll lock error');
      });

      expect(() => {
        renderHook(() => useBottomSheet());
      }).toThrow('Body scroll lock error');
    });
  });

  describe('handleDragStart', () => {
    it('正常ケース: handleDragStart が存在し呼び出し可能である', () => {
      const { result } = renderHook(() => useBottomSheet());

      expect(result.current.handleDragStart).toBeTypeOf('function');

      // 基本的な呼び出しテスト（エラーを投げないことを確認）
      expect(() => {
        const mockEvent = {
          target: document.createElement('div'),
        } as unknown as MouseEvent;
        const mockPanInfo = {
          offset: { x: 0, y: 0 },
          velocity: { x: 0, y: 100 },
          point: { x: 0, y: 0 },
          delta: { x: 0, y: 0 },
        };
        result.current.handleDragStart(mockEvent, mockPanInfo);
      }).not.toThrow();
    });

    it('正常ケース: スクロール可能な親要素がない場合はドラッグを許可', () => {
      const { result } = renderHook(() => useBottomSheet());

      // findScrollableParent が null を返すように設定
      mockFindScrollableParent.mockReturnValue(null);

      const mockEvent = {
        target: document.createElement('div'),
      } as unknown as MouseEvent;
      const mockPanInfo = {
        offset: { x: 0, y: 0 },
        velocity: { x: 0, y: 100 },
        point: { x: 0, y: 0 },
        delta: { x: 0, y: 0 },
      };

      act(() => {
        result.current.handleDragStart(mockEvent, mockPanInfo);
      });

      // findScrollableParent が呼ばれることを確認
      expect(mockFindScrollableParent).toHaveBeenCalledWith(mockEvent.target);
      // shouldAllowDrag は呼ばれないことを確認
      expect(mockShouldAllowDrag).not.toHaveBeenCalled();
    });

    it('正常ケース: スクロール可能な親要素があり、shouldAllowDrag が true の場合', () => {
      const { result } = renderHook(() => useBottomSheet());

      const mockScrollableElement = document.createElement('div');
      mockFindScrollableParent.mockReturnValue(mockScrollableElement);
      mockShouldAllowDrag.mockReturnValue(true);

      const mockEvent = {
        target: document.createElement('div'),
      } as unknown as MouseEvent;
      const mockPanInfo = {
        offset: { x: 0, y: 0 },
        velocity: { x: 0, y: 100 }, // 下方向
        point: { x: 0, y: 0 },
        delta: { x: 0, y: 0 },
      };

      act(() => {
        result.current.handleDragStart(mockEvent, mockPanInfo);
      });

      // findScrollableParent が呼ばれることを確認
      expect(mockFindScrollableParent).toHaveBeenCalledWith(mockEvent.target);
      // shouldAllowDrag が正しい引数で呼ばれることを確認
      expect(mockShouldAllowDrag).toHaveBeenCalledWith(mockScrollableElement, 'down');
    });

    it('正常ケース: スクロール可能な親要素があり、shouldAllowDrag が false の場合', () => {
      const { result } = renderHook(() => useBottomSheet());

      const mockScrollableElement = document.createElement('div');
      mockFindScrollableParent.mockReturnValue(mockScrollableElement);
      mockShouldAllowDrag.mockReturnValue(false);

      const mockEvent = {
        target: document.createElement('div'),
      } as unknown as MouseEvent;
      const mockPanInfo = {
        offset: { x: 0, y: 0 },
        velocity: { x: 0, y: -100 }, // 上方向
        point: { x: 0, y: 0 },
        delta: { x: 0, y: 0 },
      };

      act(() => {
        result.current.handleDragStart(mockEvent, mockPanInfo);
      });

      // findScrollableParent が呼ばれることを確認
      expect(mockFindScrollableParent).toHaveBeenCalledWith(mockEvent.target);
      // shouldAllowDrag が正しい引数で呼ばれることを確認
      expect(mockShouldAllowDrag).toHaveBeenCalledWith(mockScrollableElement, 'up');
    });

    it('境界値ケース: velocity.y が 0 の場合（上方向として処理）', () => {
      const { result } = renderHook(() => useBottomSheet());

      const mockScrollableElement = document.createElement('div');
      mockFindScrollableParent.mockReturnValue(mockScrollableElement);
      mockShouldAllowDrag.mockReturnValue(true);

      const mockEvent = {
        target: document.createElement('div'),
      } as unknown as MouseEvent;
      const mockPanInfo = {
        offset: { x: 0, y: 0 },
        velocity: { x: 0, y: 0 }, // 境界値
        point: { x: 0, y: 0 },
        delta: { x: 0, y: 0 },
      };

      act(() => {
        result.current.handleDragStart(mockEvent, mockPanInfo);
      });

      // velocity.y が 0 以下なので 'up' として処理される
      expect(mockShouldAllowDrag).toHaveBeenCalledWith(mockScrollableElement, 'up');
    });

    it('境界値ケース: velocity.y が正の値の場合（下方向として処理）', () => {
      const { result } = renderHook(() => useBottomSheet());

      const mockScrollableElement = document.createElement('div');
      mockFindScrollableParent.mockReturnValue(mockScrollableElement);
      mockShouldAllowDrag.mockReturnValue(true);

      const mockEvent = {
        target: document.createElement('div'),
      } as unknown as MouseEvent;
      const mockPanInfo = {
        offset: { x: 0, y: 0 },
        velocity: { x: 0, y: 0.1 }, // 小さな正の値
        point: { x: 0, y: 0 },
        delta: { x: 0, y: 0 },
      };

      act(() => {
        result.current.handleDragStart(mockEvent, mockPanInfo);
      });

      // velocity.y が正の値なので 'down' として処理される
      expect(mockShouldAllowDrag).toHaveBeenCalledWith(mockScrollableElement, 'down');
    });

    it('境界値ケース: velocity.y が負の値の場合（上方向として処理）', () => {
      const { result } = renderHook(() => useBottomSheet());

      const mockScrollableElement = document.createElement('div');
      mockFindScrollableParent.mockReturnValue(mockScrollableElement);
      mockShouldAllowDrag.mockReturnValue(true);

      const mockEvent = {
        target: document.createElement('div'),
      } as unknown as MouseEvent;
      const mockPanInfo = {
        offset: { x: 0, y: 0 },
        velocity: { x: 0, y: -0.1 }, // 小さな負の値
        point: { x: 0, y: 0 },
        delta: { x: 0, y: 0 },
      };

      act(() => {
        result.current.handleDragStart(mockEvent, mockPanInfo);
      });

      // velocity.y が負の値なので 'up' として処理される
      expect(mockShouldAllowDrag).toHaveBeenCalledWith(mockScrollableElement, 'up');
    });
  });
});
