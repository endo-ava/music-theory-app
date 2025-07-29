'use client';

import { useCallback, useEffect, useRef } from 'react';
import { SNAP_POINTS } from '../constants';

// タッチ操作の閾値定数
const TOUCH_THRESHOLDS = {
  /** ドラッグ開始判定の最小移動距離（px） */
  DRAG_THRESHOLD: 3,
  /** スナップ切り替えに必要な最小距離（px） */
  MINIMUM_SWIPE_DISTANCE: 25,
} as const;

interface UseCustomTouchHandlerOptions {
  activeSnapPoint: number | string | null;
  setActiveSnapPoint: (point: number | string | null) => void;
  isEnabled: boolean;
}

interface UseCustomTouchHandlerReturn {
  touchHandlers: {
    onTouchStart: (event: React.TouchEvent) => void;
    onTouchMove: (event: React.TouchEvent) => void;
    onTouchEnd: (event: React.TouchEvent) => void;
  };
}

/**
 * シンプルなカスタムタッチハンドラーフック
 * vaulの内部判定をバイパスして、確実なタッチ検出を実現
 */
export function useCustomTouchHandler({
  activeSnapPoint,
  setActiveSnapPoint,
  isEnabled,
}: UseCustomTouchHandlerOptions): UseCustomTouchHandlerReturn {
  const startY = useRef<number>(0);
  const isDragging = useRef(false);

  const handleTouchStart = useCallback(
    (event: React.TouchEvent) => {
      if (!isEnabled) return;

      startY.current = event.touches[0].clientY;
      isDragging.current = false;
      // タッチ開始時はpreventDefaultしない（アクセシビリティ保持）
    },
    [isEnabled]
  );

  const handleTouchMove = useCallback(
    (event: React.TouchEvent) => {
      if (!isEnabled) return;

      const currentY = event.touches[0].clientY;
      const deltaY = Math.abs(currentY - startY.current);

      // DRAG_THRESHOLD以上の移動でドラッグ開始
      if (!isDragging.current && deltaY > TOUCH_THRESHOLDS.DRAG_THRESHOLD) {
        isDragging.current = true;
      }

      if (isDragging.current) {
        event.preventDefault();
      }
    },
    [isEnabled]
  );

  const handleTouchEnd = useCallback(
    (event: React.TouchEvent) => {
      if (!isEnabled || !isDragging.current) {
        startY.current = 0;
        isDragging.current = false;
        return;
      }

      const deltaY = event.changedTouches[0].clientY - startY.current;

      // MINIMUM_SWIPE_DISTANCE以上の移動で反応
      if (Math.abs(deltaY) < TOUCH_THRESHOLDS.MINIMUM_SWIPE_DISTANCE) {
        startY.current = 0;
        isDragging.current = false;
        return;
      }

      // 次のスナップポイントを計算
      let nextSnapPoint = activeSnapPoint;

      if (deltaY < 0) {
        // 上方向スワイプ
        if (activeSnapPoint === SNAP_POINTS.LOWEST) {
          nextSnapPoint = SNAP_POINTS.HALF;
        } else if (activeSnapPoint === SNAP_POINTS.HALF) {
          nextSnapPoint = SNAP_POINTS.EXPANDED;
        }
      } else {
        // 下方向スワイプ
        if (activeSnapPoint === SNAP_POINTS.EXPANDED) {
          nextSnapPoint = SNAP_POINTS.HALF;
        } else if (activeSnapPoint === SNAP_POINTS.HALF) {
          nextSnapPoint = SNAP_POINTS.LOWEST;
        }
      }

      if (nextSnapPoint !== activeSnapPoint) {
        setActiveSnapPoint(nextSnapPoint);
      }

      // ドラッグが実行された場合のみpreventDefault
      event.preventDefault();
      startY.current = 0;
      isDragging.current = false;
    },
    [isEnabled, activeSnapPoint, setActiveSnapPoint]
  );

  // プルトゥリフレッシュ防止の最小限設定
  useEffect(() => {
    const className = 'custom-touch-handler-active';

    if (isEnabled) {
      document.body.classList.add(className);
    }

    return () => {
      document.body.classList.remove(className);
    };
  }, [isEnabled]);

  return {
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
  };
}
