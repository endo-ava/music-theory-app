import { useRef, useCallback } from 'react';

/**
 * ロングプレスのオプション設定
 */
interface UseLongPressOptions {
  /** ロングプレス判定までの時間（ミリ秒） */
  delay?: number;
  /** ロングプレス開始時のコールバック */
  onLongPressStart?: () => void;
  /** ロングプレス成功時のコールバック */
  onLongPress: () => void;
  /** 通常のクリック時のコールバック */
  onClick?: () => void;
}

/**
 * ロングプレス機能を提供するカスタムフック
 *
 * PC（マウス）とモバイル（タッチ）の両方に対応し、
 * 通常のクリック/タップとロングプレスを区別して処理します。
 *
 * @param options - ロングプレスの設定オプション
 * @returns イベントハンドラーのオブジェクト
 */
export const useLongPress = ({
  delay = 500,
  onLongPressStart,
  onLongPress,
  onClick,
}: UseLongPressOptions) => {
  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  const isLongPress = useRef(false);
  const startPosition = useRef<{ x: number; y: number } | null>(null);

  // プレス開始の共通処理
  const startPress = useCallback(
    (x: number, y: number) => {
      isLongPress.current = false;
      startPosition.current = { x, y };

      pressTimer.current = setTimeout(() => {
        isLongPress.current = true;
        onLongPressStart?.();
        onLongPress();
      }, delay);
    },
    [delay, onLongPressStart, onLongPress]
  );

  // プレス終了の共通処理
  const endPress = useCallback(() => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }

    // ロングプレスでなかった場合は通常のクリックとして処理
    if (!isLongPress.current && onClick) {
      onClick();
    }

    isLongPress.current = false;
    startPosition.current = null;
  }, [onClick]);

  // プレスのキャンセル（移動など）
  const cancelPress = useCallback(() => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
    isLongPress.current = false;
    startPosition.current = null;
  }, []);

  // 移動による判定（指定距離以上移動したらキャンセル）
  const checkMovement = useCallback(
    (x: number, y: number, threshold = 10) => {
      if (!startPosition.current) return false;

      const deltaX = Math.abs(x - startPosition.current.x);
      const deltaY = Math.abs(y - startPosition.current.y);
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (distance > threshold) {
        cancelPress();
        return true;
      }
      return false;
    },
    [cancelPress]
  );

  // マウスイベントハンドラー
  const handleMouseDown = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      startPress(event.clientX, event.clientY);
    },
    [startPress]
  );

  const handleMouseUp = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      endPress();
    },
    [endPress]
  );

  const handleMouseMove = useCallback(
    (event: React.MouseEvent) => {
      checkMovement(event.clientX, event.clientY);
    },
    [checkMovement]
  );

  const handleMouseLeave = useCallback(() => {
    cancelPress();
  }, [cancelPress]);

  // タッチイベントハンドラー
  const handleTouchStart = useCallback(
    (event: React.TouchEvent) => {
      if (event.touches.length === 1) {
        const touch = event.touches[0];
        startPress(touch.clientX, touch.clientY);
      }
    },
    [startPress]
  );

  const handleTouchEnd = useCallback(
    (event: React.TouchEvent) => {
      event.preventDefault();
      endPress();
    },
    [endPress]
  );

  const handleTouchMove = useCallback(
    (event: React.TouchEvent) => {
      if (event.touches.length === 1) {
        const touch = event.touches[0];
        if (checkMovement(touch.clientX, touch.clientY)) {
          event.preventDefault();
        }
      }
    },
    [checkMovement]
  );

  return {
    // マウスイベント
    onMouseDown: handleMouseDown,
    onMouseUp: handleMouseUp,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    // タッチイベント
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
    onTouchMove: handleTouchMove,
  };
};
