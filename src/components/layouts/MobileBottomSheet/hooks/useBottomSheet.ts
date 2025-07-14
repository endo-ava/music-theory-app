'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import type { PanInfo } from 'framer-motion';
import { BottomSheetState } from '../types';
import { SHEET_CONFIG } from '../constants';
import { useWindowSize, useBodyScrollLock } from '@/shared/hooks';
import { findScrollableParent, shouldAllowDrag } from '@/shared/utils';

/**
 * `useBottomSheet` カスタムフック
 *
 * BottomSheetの状態管理、アニメーション座標計算、およびユーザーインタラクション（ドラッグ、キーボード操作）のロジックをカプセル化します。
 * このフックは、非モーダルなボトムシートの振る舞いを制御し、UIコンポーネントからロジックを分離します。
 *
 * @returns BottomSheetの状態と制御関数を含むオブジェクト。
 * - `sheetRef`: `motion.div` にアタッチするためのrefオブジェクト。
 * - `bottomSheetState`: 現在のシートの状態（'collapsed', 'half', 'expanded'）。
 * - `isExpanded`: シートが'expanded'状態であるかを示す真偽値。
 * - `isHalf`: シートが'half'状態であるかを示す真偽値。
 * - `isCollapsed`: シートが'collapsed'状態であるかを示す真偽値。
 * - `y`: `framer-motion` の `animate` プロパティに渡すY座標（ピクセル）。
 * - `sheetHeight`: シートの高さ
 * - `dragConstraints`: `framer-motion` の `dragConstraints` プロパティに渡すドラッグ可能な範囲。
 * - `toggleBottomSheet`: シートの状態をサイクルさせる関数。
 * - `collapseBottomSheet`: シートを折りたたむ関数。
 * - `handleDragStart`: ドラッグ開始時のイベントハンドラ。内部スクロールとの競合を回避。
 * - `handleDragEnd`: ドラッグ終了時に呼び出されるイベントハンドラ。`framer-motion` の `PanInfo` を受け取ります。
 */
export const useBottomSheet = () => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [sheetState, setSheetState] = useState<BottomSheetState>('collapsed');
  const [isDragAllowed, setIsDragAllowed] = useState(true);

  // ウィンドウサイズを取得（汎用フック使用）
  const { height: windowHeight } = useWindowSize();

  /** スナップポイントとシートの高さの計算(メモ化) */
  const { snapPoints, sheetHeight } = useMemo(() => {
    const sheetHeight = windowHeight * SHEET_CONFIG.vh;
    return {
      sheetHeight,
      snapPoints: {
        expanded: SHEET_CONFIG.expandedTopMarginPx,
        half: sheetHeight * SHEET_CONFIG.halfOpenRatio,
        collapsed: sheetHeight - SHEET_CONFIG.collapsedVisiblePx,
      },
    };
  }, [windowHeight]);

  // 状態ごとの真偽値フラグ
  const isExpanded = sheetState === 'expanded';
  const isHalf = sheetState === 'half';
  const isCollapsed = sheetState === 'collapsed';

  // 背景スクロールロック（汎用フック使用）
  useBodyScrollLock(!isCollapsed);

  // 状態変更関数（useCallbackでメモ化）
  const collapseBottomSheet = useCallback(() => setSheetState('collapsed'), []);
  const halfBottomSheet = useCallback(() => setSheetState('half'), []);
  const expandBottomSheet = useCallback(() => setSheetState('expanded'), []);

  /**
   * シートの状態を'collapsed' → 'half' → 'expanded' → 'half' の順にサイクルさせるコールバック関数
   */
  const toggleBottomSheet = useCallback(() => {
    setSheetState(currentState => {
      if (currentState === 'collapsed') return 'half';
      if (currentState === 'half') return 'expanded';
      return 'half';
    });
  }, []);

  /**
   * ドラッグ開始時のイベントを処理するコールバック関数
   * 内部コンテンツのスクロールとシートの移動を適切に判定し、競合を回避する
   */
  const handleDragStart = useCallback(
    (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const target = event.target as HTMLElement;
      const scrollableParent = findScrollableParent(target);

      if (scrollableParent) {
        const dragDirection = info.velocity.y > 0 ? 'down' : 'up';
        const allowDrag = shouldAllowDrag(scrollableParent, dragDirection);

        setIsDragAllowed(allowDrag);
      } else {
        // スクロール可能な要素がない場合はドラッグを許可
        setIsDragAllowed(true);
      }
    },
    []
  );

  /**
   * ドラッグ終了時のイベントを処理するコールバック関数
   * スワイプの速度と最終位置に基づいて、シートを最適なスナップポイントに移動させる
   */
  const handleDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      // ドラッグが許可されていない場合は何もしない
      if (!isDragAllowed) {
        setIsDragAllowed(true); // 次回のドラッグのためにリセット
        return;
      }

      const { offset, velocity } = info;
      const dragY = offset.y;
      const velocityY = velocity.y;

      // 高速スワイプの判定
      if (Math.abs(velocityY) > SHEET_CONFIG.velocityThreshold) {
        if (velocityY < 0) {
          // 上スワイプ
          if (isCollapsed) halfBottomSheet();
          else expandBottomSheet();
        } else {
          // 下スワイプ
          if (isExpanded) halfBottomSheet();
          else collapseBottomSheet();
        }
        return;
      }

      // 低速スワイプの場合、最も近いスナップポイントに移動
      // 現在のスクリーン上の実際の位置を計算（ドラッグ開始時の位置 + ドラッグオフセット）
      const currentY = snapPoints[sheetState] + dragY;

      // 上方向にある程度移動していればhalf状態にする
      if (sheetState === 'collapsed' && dragY < -50) {
        setSheetState('half');
        return;
      }

      // `snapPoints`オブジェクトから動的に最も近い点を探す
      const nearestState = Object.entries(snapPoints).reduce((prevState, [state, y]) => {
        const prevDistance = Math.abs(snapPoints[prevState] - currentY);
        const currentDistance = Math.abs(y - currentY);
        return currentDistance < prevDistance ? (state as BottomSheetState) : prevState;
      }, sheetState);

      setSheetState(nearestState);
    },
    [
      isDragAllowed,
      sheetState,
      snapPoints,
      collapseBottomSheet,
      halfBottomSheet,
      expandBottomSheet,
      isCollapsed,
      isExpanded,
    ]
  );

  // シートが展開されたときに、シート内の最初のフォーカス可能な要素にフォーカスを移動
  useEffect(() => {
    if (isExpanded && sheetRef.current) {
      const focusable = sheetRef.current.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement | null;
      focusable?.focus();
    }
  }, [isExpanded]);

  // Escapeキーが押されたときにシートを折りたたむイベントリスナーを設定します。
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        collapseBottomSheet();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [collapseBottomSheet]);

  return {
    sheetRef,
    bottomSheetState: sheetState,
    isExpanded,
    isHalf,
    isCollapsed,
    y: snapPoints[sheetState],
    sheetHeight,
    dragConstraints: {
      top: snapPoints.expanded,
      bottom: snapPoints.collapsed,
    },
    toggleBottomSheet,
    collapseBottomSheet,
    handleDragStart,
    handleDragEnd,
  };
};
