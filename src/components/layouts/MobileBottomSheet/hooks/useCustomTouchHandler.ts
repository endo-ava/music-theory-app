import { useCallback, useEffect, useRef } from 'react';
import { SNAP_POINTS } from '../constants';

interface TouchPosition {
  x: number;
  y: number;
  timestamp: number;
}

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
 * 実機での反応性を改善するカスタムタッチハンドラーフック
 *
 * vaulの内部判定をバイパスして、より確実で敏感なタッチ検出を実現
 */
export function useCustomTouchHandler({
  activeSnapPoint,
  setActiveSnapPoint,
  isEnabled,
}: UseCustomTouchHandlerOptions): UseCustomTouchHandlerReturn {
  const startPosition = useRef<TouchPosition | null>(null);
  const lastPosition = useRef<TouchPosition | null>(null);
  const isDragging = useRef(false);

  // 実機最適化されたタッチ判定パラメータ
  const TOUCH_CONFIG = {
    MIN_MOVE_DISTANCE: 3, // より敏感に（実機での微細な動きを確実に検出）
    VERTICAL_THRESHOLD: 0.6, // 縦方向判定を緩和（60%以上で縦方向と判定）
    SNAP_VELOCITY_THRESHOLD: 0.2, // より小さな速度でもスナップ切り替え
    DEBOUNCE_TIME: 8, // より高頻度で処理（120fps相当）
    MIN_SWIPE_DISTANCE: 15, // スナップ切り替えに必要な最小距離
  };

  // タッチ開始処理
  const handleTouchStart = useCallback(
    (event: React.TouchEvent) => {
      if (!isEnabled) return;

      const touch = event.touches[0];
      const position: TouchPosition = {
        x: touch.clientX,
        y: touch.clientY,
        timestamp: Date.now(),
      };

      startPosition.current = position;
      lastPosition.current = position;
      isDragging.current = false;

      // プルトゥリフレッシュを確実に防止
      event.preventDefault();
    },
    [isEnabled]
  );

  // タッチ移動処理
  const handleTouchMove = useCallback(
    (event: React.TouchEvent) => {
      if (!isEnabled || !startPosition.current || !lastPosition.current) return;

      const touch = event.touches[0];
      const currentPosition: TouchPosition = {
        x: touch.clientX,
        y: touch.clientY,
        timestamp: Date.now(),
      };

      const deltaX = currentPosition.x - startPosition.current.x;
      const deltaY = currentPosition.y - startPosition.current.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // 最小移動距離をクリアした場合のみドラッグ開始
      if (!isDragging.current && distance > TOUCH_CONFIG.MIN_MOVE_DISTANCE) {
        // 縦方向の動きかチェック
        const verticalRatio = Math.abs(deltaY) / (Math.abs(deltaX) + Math.abs(deltaY));

        if (verticalRatio >= TOUCH_CONFIG.VERTICAL_THRESHOLD) {
          isDragging.current = true;
          // プルトゥリフレッシュを確実に防止
          event.preventDefault();
        }
      }

      // ドラッグ中の場合、継続的に preventDefault
      if (isDragging.current) {
        event.preventDefault();
        lastPosition.current = currentPosition;
      }
    },
    [isEnabled]
  );

  // タッチ終了処理
  const handleTouchEnd = useCallback(
    (event: React.TouchEvent) => {
      if (!isEnabled || !startPosition.current || !lastPosition.current || !isDragging.current) {
        // 初期化
        startPosition.current = null;
        lastPosition.current = null;
        isDragging.current = false;
        return;
      }

      const deltaY = lastPosition.current.y - startPosition.current.y;
      const deltaTime = lastPosition.current.timestamp - startPosition.current.timestamp;
      const velocity = Math.abs(deltaY) / Math.max(deltaTime, 1);

      // 現在のスナップポイントから次のスナップポイントを決定
      let targetSnapPoint: number | string | null = activeSnapPoint;

      if (Math.abs(deltaY) >= TOUCH_CONFIG.MIN_SWIPE_DISTANCE) {
        if (deltaY < 0) {
          // 上方向のスワイプ
          if (activeSnapPoint === SNAP_POINTS.LOWEST) {
            targetSnapPoint = SNAP_POINTS.HALF;
          } else if (activeSnapPoint === SNAP_POINTS.HALF) {
            targetSnapPoint = SNAP_POINTS.EXPANDED;
          }
        } else {
          // 下方向のスワイプ
          if (activeSnapPoint === SNAP_POINTS.EXPANDED) {
            targetSnapPoint = SNAP_POINTS.HALF;
          } else if (activeSnapPoint === SNAP_POINTS.HALF) {
            targetSnapPoint = SNAP_POINTS.LOWEST;
          }
        }
      }

      // 速度が十分高い場合は段階をスキップ
      if (
        velocity > TOUCH_CONFIG.SNAP_VELOCITY_THRESHOLD &&
        Math.abs(deltaY) >= TOUCH_CONFIG.MIN_SWIPE_DISTANCE
      ) {
        if (deltaY < 0 && activeSnapPoint === SNAP_POINTS.LOWEST) {
          targetSnapPoint = SNAP_POINTS.EXPANDED; // 最下位から最上位に一気に
        } else if (deltaY > 0 && activeSnapPoint === SNAP_POINTS.EXPANDED) {
          targetSnapPoint = SNAP_POINTS.LOWEST; // 最上位から最下位に一気に
        }
      }

      // 状態変更をトリガー
      if (targetSnapPoint !== activeSnapPoint) {
        setActiveSnapPoint(targetSnapPoint);
      }

      // プルトゥリフレッシュを確実に防止
      event.preventDefault();

      // 初期化
      startPosition.current = null;
      lastPosition.current = null;
      isDragging.current = false;
    },
    [isEnabled, activeSnapPoint, setActiveSnapPoint]
  );

  // プルトゥリフレッシュ対策とパフォーマンス最適化
  useEffect(() => {
    if (isEnabled) {
      // タッチアクションを制御してプルトゥリフレッシュを防止
      document.body.style.overscrollBehavior = 'contain';
      document.body.style.touchAction = 'pan-x pinch-zoom';

      // iOS Safari特有の問題対策
      document.documentElement.style.overscrollBehavior = 'contain';

      // パフォーマンス最適化：will-changeの適用
      const drawerElement = document.querySelector('[data-vaul-drawer]');
      if (drawerElement) {
        (drawerElement as HTMLElement).style.willChange = 'transform';
      }
    }

    return () => {
      if (isEnabled) {
        document.body.style.overscrollBehavior = '';
        document.body.style.touchAction = '';
        document.documentElement.style.overscrollBehavior = '';

        const drawerElement = document.querySelector('[data-vaul-drawer]');
        if (drawerElement) {
          (drawerElement as HTMLElement).style.willChange = '';
        }
      }
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
