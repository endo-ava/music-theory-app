'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import type { PanInfo } from 'framer-motion';
import { BottomSheetState } from '../types';
import { SHEET_CONFIG } from '../constants';

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
 * - `dragConstraints`: `framer-motion` の `dragConstraints` プロパティに渡すドラッグ可能な範囲。
 * - `toggleBottomSheet`: シートの状態をサイクルさせる関数。
 * - `collapseBottomSheet`: シートを折りたたむ関数。
 * - `handleDragEnd`: ドラッグ終了時に呼び出されるイベントハンドラ。`framer-motion` の `PanInfo` を受け取ります。
 */
export const useBottomSheet = () => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [sheetState, setSheetState] = useState<BottomSheetState>('collapsed');

  // windowの高さをstateで管理し、クライアントサイドでのみ計算 / SSR時に`window`がないことによるエラーを防ぐ
  const [windowHeight, setWindowHeight] = useState(0);
  useEffect(() => {
    // コンポーネントがマウントされてから高さを取得・設定
    setWindowHeight(window.innerHeight);

    // ウィンドウサイズが変わったときにも追従するようにする
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /** スナップポイントの計算(メモ化) */
  const snapPoints = useMemo(() => {
    const sheetHeight = windowHeight * SHEET_CONFIG.vh;
    return {
      expanded: SHEET_CONFIG.expandedTopMarginPx,
      half: sheetHeight * SHEET_CONFIG.halfOpenRatio,
      collapsed: sheetHeight - SHEET_CONFIG.collapsedVisiblePx,
    };
  }, [windowHeight]);

  // 状態ごとの真偽値フラグ
  const isExpanded = sheetState === 'expanded';
  const isHalf = sheetState === 'half';
  const isCollapsed = sheetState === 'collapsed';

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
   * ドラッグ終了時のイベントを処理するコールバック関数
   * スワイプの速度と最終位置に基づいて、シートを最適なスナップポイントに移動させる
   */
  const handleDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
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
    dragConstraints: {
      top: snapPoints.expanded,
      bottom: snapPoints.collapsed,
    },
    toggleBottomSheet,
    collapseBottomSheet,
    handleDragEnd,
  };
};
