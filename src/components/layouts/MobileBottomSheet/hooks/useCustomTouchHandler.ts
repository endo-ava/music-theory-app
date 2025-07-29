'use client';

import { useCallback, useEffect, useRef } from 'react';
import { TOUCH_CONFIG } from '../constants';
import { calculateNextSnapPoint } from '../utils/snapPointCalculator';

/**
 * タッチイベントの位置と時刻を記録する構造体
 */
interface TouchPosition {
  /** タッチのX座標（px） */
  x: number;
  /** タッチのY座標（px） */
  y: number;
  /** タッチイベント発生時刻（ms） */
  timestamp: number;
}

/**
 * useCustomTouchHandlerフックの設定オプション
 */
interface UseCustomTouchHandlerOptions {
  /** 現在アクティブなスナップポイント */
  activeSnapPoint: number | string | null;
  /** スナップポイント変更関数 */
  setActiveSnapPoint: (point: number | string | null) => void;
  /** タッチハンドラーの有効/無効状態 */
  isEnabled: boolean;
}

/**
 * useCustomTouchHandlerフックの戻り値
 */
interface UseCustomTouchHandlerReturn {
  /** Reactコンポーネントにアタッチするタッチイベントハンドラー群 */
  touchHandlers: {
    /** タッチ開始イベントハンドラー */
    onTouchStart: (event: React.TouchEvent) => void;
    /** タッチ移動イベントハンドラー */
    onTouchMove: (event: React.TouchEvent) => void;
    /** タッチ終了イベントハンドラー */
    onTouchEnd: (event: React.TouchEvent) => void;
  };
}

/**
 * 実機での反応性を改善するカスタムタッチハンドラーフック
 *
 * @description
 * vaulライブラリの内部タッチ判定をバイパスして、より確実で敏感なタッチ検出を実現します。
 * 特にモバイル実機での操作性を向上させるために最適化されています。
 *
 * @features
 * - プルトゥリフレッシュの確実な防止
 * - 縦方向スワイプの正確な検出
 * - スナップポイント間の段階的移動
 * - 高速スワイプでの段階スキップ機能
 * - パフォーマンス最適化（will-change適用）
 *
 * @param options - フックの設定オプション
 * @returns タッチイベントハンドラー群を含むオブジェクト
 *
 * @example
 * ```tsx
 * const { touchHandlers } = useCustomTouchHandler({
 *   activeSnapPoint: SNAP_POINTS.HALF,
 *   setActiveSnapPoint: setSnapPoint,
 *   isEnabled: true,
 * });
 *
 * return <div {...touchHandlers}>コンテンツ</div>;
 * ```
 */
export function useCustomTouchHandler({
  activeSnapPoint,
  setActiveSnapPoint,
  isEnabled,
}: UseCustomTouchHandlerOptions): UseCustomTouchHandlerReturn {
  // タッチ状態管理用のref
  /** タッチ開始時の位置と時刻を記録 */
  const startPosition = useRef<TouchPosition | null>(null);
  /** 最後にタッチした位置と時刻を記録（速度計算用） */
  const lastPosition = useRef<TouchPosition | null>(null);
  /** 現在ドラッグ中かどうかの状態フラグ */
  const isDragging = useRef(false);

  /**
   * タッチ開始イベントの処理
   *
   * @description
   * タッチ開始時の位置と時刻を記録し、ドラッグ状態を初期化します。
   * プルトゥリフレッシュを防止するためにpreventDefaultも実行します。
   *
   * @param event - Reactのタッチイベント
   */
  const handleTouchStart = useCallback(
    (event: React.TouchEvent) => {
      // 機能が無効の場合は早期リターン
      if (!isEnabled) return;

      // 最初のタッチポイントを取得
      const touch = event.touches[0];
      const position: TouchPosition = {
        x: touch.clientX,
        y: touch.clientY,
        timestamp: Date.now(),
      };

      // タッチ開始位置として記録
      startPosition.current = position;
      lastPosition.current = position;
      isDragging.current = false;

      // プルトゥリフレッシュを確実に防止
      event.preventDefault();
    },
    [isEnabled]
  );

  /**
   * タッチ移動イベントの処理
   *
   * @description
   * タッチの移動を検出し、縦方向の動きかどうかを判定します。
   * 最小移動距離と縦方向閾値をクリアした場合にドラッグ状態に移行します。
   * ドラッグ中は継続的にpreventDefaultを実行してスクロールを防止します。
   *
   * @param event - Reactのタッチイベント
   */
  const handleTouchMove = useCallback(
    (event: React.TouchEvent) => {
      // 機能が無効、または開始位置が記録されていない場合は早期リターン
      if (!isEnabled || !startPosition.current || !lastPosition.current) return;

      // 現在のタッチ位置と時刻を取得
      const touch = event.touches[0];
      const currentPosition: TouchPosition = {
        x: touch.clientX,
        y: touch.clientY,
        timestamp: Date.now(),
      };

      // タッチ開始点からの移動量を計算
      const deltaX = currentPosition.x - startPosition.current.x;
      const deltaY = currentPosition.y - startPosition.current.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // 最小移動距離をクリアした場合のみドラッグ開始判定を行う
      if (!isDragging.current && distance > TOUCH_CONFIG.MIN_MOVE_DISTANCE) {
        // 縦方向の動きの比率を計算（0-1の範囲）
        const verticalRatio = Math.abs(deltaY) / (Math.abs(deltaX) + Math.abs(deltaY));

        // 縦方向閾値をクリアした場合にドラッグ状態に移行
        if (verticalRatio >= TOUCH_CONFIG.VERTICAL_THRESHOLD) {
          isDragging.current = true;
          // プルトゥリフレッシュを確実に防止
          event.preventDefault();
        }
      }

      // ドラッグ中の場合、継続的にpreventDefaultでスクロールを防止
      if (isDragging.current) {
        event.preventDefault();
        lastPosition.current = currentPosition;
      }
    },
    [isEnabled]
  );

  /**
   * タッチ終了イベントの処理
   *
   * @description
   * タッチ終了時にスワイプの距離と速度を計算し、次のスナップポイントを決定します。
   * 計算結果に基づいてスナップポイントの状態を更新し、全ての状態を初期化します。
   *
   * @param event - Reactのタッチイベント
   */
  const handleTouchEnd = useCallback(
    (event: React.TouchEvent) => {
      // 機能が無効、または必要な状態が記録されていない場合は初期化のみ実行
      if (!isEnabled || !startPosition.current || !lastPosition.current || !isDragging.current) {
        // 状態を初期化
        startPosition.current = null;
        lastPosition.current = null;
        isDragging.current = false;
        return;
      }

      // スワイプの縦方向移動量を計算（負の値は上方向、正の値は下方向）
      const deltaY = lastPosition.current.y - startPosition.current.y;
      // スワイプにかかった時間を計算（ms）
      const deltaTime = lastPosition.current.timestamp - startPosition.current.timestamp;
      // スワイプ速度を計算（px/ms）：ゼロ除算を防ぐためMath.maxを使用
      const velocity = Math.abs(deltaY) / Math.max(deltaTime, 1);

      // スナップポイント計算ロジックを使用して次の位置を決定
      const { targetSnapPoint } = calculateNextSnapPoint(activeSnapPoint, deltaY, velocity);

      // スナップポイントに変更がある場合のみ状態更新をトリガー
      if (targetSnapPoint !== activeSnapPoint) {
        setActiveSnapPoint(targetSnapPoint);
      }

      // プルトゥリフレッシュを確実に防止
      event.preventDefault();

      // 全ての状態を初期化
      startPosition.current = null;
      lastPosition.current = null;
      isDragging.current = false;
    },
    [isEnabled, activeSnapPoint, setActiveSnapPoint]
  );

  /**
   * プルトゥリフレッシュ対策とパフォーマンス最適化のuseEffect
   *
   * @description
   * フックが有効な場合にブラウザのデフォルト動作を制御し、
   * モバイルでの操作性とパフォーマンスを向上させます。
   * コンポーネントのアンマウント時にはスタイルを元に戻します。
   */
  useEffect(() => {
    if (isEnabled) {
      // ===== プルトゥリフレッシュ防止設定 =====
      // overscroll-behavior: containでスクロール連鎖を防止
      document.body.style.overscrollBehavior = 'contain';
      // touch-action: 横方向パンとピンチズームのみ許可
      document.body.style.touchAction = 'pan-x pinch-zoom';

      // iOS Safari特有のバウンススクロール問題対策
      document.documentElement.style.overscrollBehavior = 'contain';

      // ===== パフォーマンス最適化 =====
      // vaulドローワー要素にwill-changeを適用してGPU加速を有効化
      const drawerElement = document.querySelector('[data-vaul-drawer]');
      if (drawerElement) {
        (drawerElement as HTMLElement).style.willChange = 'transform';
      }
    }

    // クリーンアップ関数：設定したスタイルを元に戻す
    return () => {
      if (isEnabled) {
        // プルトゥリフレッシュ防止設定を削除
        document.body.style.overscrollBehavior = '';
        document.body.style.touchAction = '';
        document.documentElement.style.overscrollBehavior = '';

        // パフォーマンス最適化設定を削除
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
