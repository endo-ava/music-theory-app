'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * BottomSheet状態の定義（3段階snap points）
 */
export type BottomSheetState = 'collapsed' | 'half' | 'expanded';

/**
 * BottomSheetのY座標を計算するユーティリティ
 * @param state - BottomSheetの状態
 * @returns Y座標
 */
const getSnapPointY = (state: BottomSheetState): number => {
  if (typeof window === 'undefined') {
    const defaultSheetHeight = 800 * 0.85; // 85vh as default
    switch (state) {
      case 'collapsed':
        return defaultSheetHeight - 80; // 80px visible
      case 'half':
        return defaultSheetHeight * 0.6; // ~50% visible
      case 'expanded':
        return 20; // Top margin 20px
      default:
        return defaultSheetHeight - 80;
    }
  }

  const sheetHeight = window.innerHeight * 0.85; // 85vh
  switch (state) {
    case 'collapsed':
      return sheetHeight - 80; // 80px visible
    case 'half':
      return sheetHeight * 0.6; // ~50% visible
    case 'expanded':
      return 20; // Top margin 20px
    default:
      return sheetHeight - 80;
  }
};

/**
 * BottomSheet管理のためのカスタムフック
 *
 * 状態管理、アニメーション座標計算、イベントハンドリングなど、
 * BottomSheetの全ロジックをこのフックに集約。
 *
 * @returns BottomSheetの状態と制御関数
 */
export const useBottomSheet = () => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [bottomSheetState, setBottomSheetState] = useState<BottomSheetState>('collapsed');

  const isExpanded = bottomSheetState === 'expanded';
  const isHalf = bottomSheetState === 'half';
  const isCollapsed = bottomSheetState === 'collapsed';

  const collapseBottomSheet = useCallback(() => setBottomSheetState('collapsed'), []);
  const halfBottomSheet = useCallback(() => setBottomSheetState('half'), []);
  const expandBottomSheet = useCallback(() => setBottomSheetState('expanded'), []);

  const toggleBottomSheet = useCallback(() => {
    if (isCollapsed) halfBottomSheet();
    else if (isHalf) expandBottomSheet();
    else collapseBottomSheet();
  }, [isCollapsed, isHalf, collapseBottomSheet, halfBottomSheet, expandBottomSheet]);

  const handleDragEnd = useCallback(
    (dragY: number, velocityY: number) => {
      const velocityThreshold = 500;

      // 1. 高速スワイプの判定
      if (Math.abs(velocityY) > velocityThreshold) {
        if (velocityY < 0) {
          // 上向きスワイプ
          if (isCollapsed) halfBottomSheet();
          else expandBottomSheet();
        } else {
          // 下向きスワイプ
          if (isExpanded) halfBottomSheet();
          else collapseBottomSheet();
        }
        return;
      }

      // 2. スワイプ速度が遅い場合、最終位置に最も近いスナップポイントに移動
      const currentY = getSnapPointY(bottomSheetState) + dragY;
      const points = [
        { state: 'expanded' as const, y: getSnapPointY('expanded') },
        { state: 'half' as const, y: getSnapPointY('half') },
        { state: 'collapsed' as const, y: getSnapPointY('collapsed') },
      ];

      const nearestPoint = points.reduce((prev, curr) =>
        Math.abs(curr.y - currentY) < Math.abs(prev.y - currentY) ? curr : prev
      );

      setBottomSheetState(nearestPoint.state);
    },
    [
      bottomSheetState,
      collapseBottomSheet,
      halfBottomSheet,
      expandBottomSheet,
      isCollapsed,
      isExpanded,
      isHalf,
    ]
  );

  // フォーカストラップ
  useEffect(() => {
    if (isExpanded && sheetRef.current) {
      const focusable = sheetRef.current.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement | null;
      focusable?.focus();
    }
  }, [isExpanded]);

  // Escapeキーで閉じる
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
    bottomSheetState,
    isExpanded,
    isHalf,
    isCollapsed,
    y: getSnapPointY(bottomSheetState),
    dragConstraints: {
      top: getSnapPointY('expanded'),
      bottom: getSnapPointY('collapsed'),
    },
    toggleBottomSheet,
    collapseBottomSheet,
    handleDragEnd: (_: unknown, info: { offset: { y: number }; velocity: { y: number } }) =>
      handleDragEnd(info.offset.y, info.velocity.y),
  };
};
