import { useCallback, useRef, useState } from 'react';

/**
 * ドラッグ閾値（px）
 * この距離以上動いたらドラッグと判定
 */
const DRAG_THRESHOLD = 4;

/**
 * useDragRotation フックのオプション
 */
export interface UseDragRotationOptions {
  /** SVG要素への参照（座標計算に必要） */
  svgRef: React.RefObject<SVGSVGElement | null>;
  /** 現在の回転インデックス */
  currentRotationIndex: number;
  /** 回転インデックス更新コールバック */
  onRotationChange: (index: number) => void;
}

/**
 * useDragRotation フックの戻り値
 */
export interface UseDragRotationReturn {
  /** ドラッグ中かどうか */
  isDragging: boolean;
  /** Pointer Event ハンドラー */
  handlers: {
    onPointerDown: (e: React.PointerEvent) => void;
    onPointerMove: (e: React.PointerEvent) => void;
    onPointerUp: (e: React.PointerEvent) => void;
    onPointerCancel: (e: React.PointerEvent) => void;
  };
}

/**
 * 五度圏のドラッグ回転を処理するカスタムフック
 *
 * Pointer Events API を使用してマウスとタッチを統一的に処理し、
 * ポインター位置から回転角度を計算して12段階（0-11）にスナップする。
 *
 * @param options - フックのオプション
 * @returns ドラッグ状態とイベントハンドラー
 */
export const useDragRotation = ({
  svgRef,
  currentRotationIndex,
  onRotationChange,
}: UseDragRotationOptions): UseDragRotationReturn => {
  const [isDragging, setIsDragging] = useState(false);
  const startPosRef = useRef<{ x: number; y: number } | null>(null);
  const startAngleRef = useRef<number>(0);
  const startRotationIndexRef = useRef<number>(0);
  const hasCrossedThresholdRef = useRef(false);

  /**
   * ポインター位置から中心を基準とした角度を計算（度数法）
   */
  const calculateAngle = useCallback(
    (clientX: number, clientY: number): number | null => {
      if (!svgRef.current) return null;

      // SVG の中心座標を取得
      const svgRect = svgRef.current.getBoundingClientRect();
      const svgCenterX = svgRect.left + svgRect.width / 2;
      const svgCenterY = svgRect.top + svgRect.height / 2;

      // 中心からの角度を計算
      const deltaX = clientX - svgCenterX;
      const deltaY = clientY - svgCenterY;
      const angleRad = Math.atan2(deltaY, deltaX);
      const angleDeg = (angleRad * 180) / Math.PI;

      return angleDeg;
    },
    [svgRef]
  );

  /**
   * ポインターダウン: ドラッグ開始の準備
   */
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      // 左クリック（またはタッチ）のみ処理
      if (e.button !== 0) return;

      startPosRef.current = { x: e.clientX, y: e.clientY };
      hasCrossedThresholdRef.current = false;

      // 開始時の角度と回転インデックスを記録
      const angle = calculateAngle(e.clientX, e.clientY);
      if (angle !== null) {
        startAngleRef.current = angle;
        startRotationIndexRef.current = currentRotationIndex;
      }

      // Pointer capture は閾値を超えた時に設定する（長押しイベントを妨げないため）
      // e.currentTarget.setPointerCapture(e.pointerId);
    },
    [calculateAngle, currentRotationIndex]
  );

  /**
   * ポインター移動: ドラッグ中の回転処理
   */
  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!startPosRef.current) return;

      const { x: startX, y: startY } = startPosRef.current;
      const distance = Math.hypot(e.clientX - startX, e.clientY - startY);

      // 閾値を超えたらドラッグ開始
      if (!hasCrossedThresholdRef.current && distance > DRAG_THRESHOLD) {
        hasCrossedThresholdRef.current = true;
        setIsDragging(true);
        // ドラッグ開始時に pointer capture を設定（要素外でもイベントを受け取る）
        e.currentTarget.setPointerCapture(e.pointerId);
      }

      // ドラッグ中なら回転インデックスを更新
      if (hasCrossedThresholdRef.current) {
        const currentAngle = calculateAngle(e.clientX, e.clientY);
        if (currentAngle !== null) {
          // 角度の変化を計算（-180°から180°の範囲に正規化）
          let angleDelta = currentAngle - startAngleRef.current;
          if (angleDelta > 180) angleDelta -= 360;
          if (angleDelta < -180) angleDelta += 360;

          // 角度変化をインデックス変化に変換
          // 右ドラッグ（時計回り、angleDelta > 0）→ 反時計回り回転（rotationIndex増加）
          // 30度 = 1インデックス
          // 符号を反転して、右ドラッグで左回転になるようにする
          const indexDelta = -Math.round(angleDelta / 30);

          // 新しいrotationIndexを計算
          const newIndex = startRotationIndexRef.current + indexDelta;

          if (newIndex !== currentRotationIndex) {
            onRotationChange(newIndex);
          }
        }
      }
    },
    [calculateAngle, currentRotationIndex, onRotationChange]
  );

  /**
   * ポインターアップ: ドラッグ終了
   */
  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    startPosRef.current = null;
    hasCrossedThresholdRef.current = false;
    setIsDragging(false);

    // Pointer capture を解除（captureしている場合のみ）
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  }, []);

  /**
   * ポインターキャンセル: ドラッグ中断
   */
  const handlePointerCancel = useCallback((e: React.PointerEvent) => {
    startPosRef.current = null;
    hasCrossedThresholdRef.current = false;
    setIsDragging(false);

    // Pointer capture を解除（captureしている場合のみ）
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  }, []);

  return {
    isDragging,
    handlers: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerCancel: handlePointerCancel,
    },
  };
};
