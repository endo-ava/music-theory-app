import { SNAP_POINTS, TOUCH_CONFIG } from '../constants';

/**
 * スナップポイント判定処理の結果データ
 *
 * @interface SnapPointResult
 */
export interface SnapPointResult {
  /** 計算された次のスナップポイント */
  targetSnapPoint: number | string | null;
  /** 段階をスキップしたかどうかのフラグ */
  shouldSkipSteps: boolean;
}

/**
 * スワイプの方向・距離・速度に基づいて次のスナップポイントを計算する
 *
 * @description
 * モバイルボトムシートのタッチ操作において、現在のスナップポイントから
 * スワイプのジェスチャーに基づいて次に移動すべきスナップポイントを決定します。
 *
 * @algorithm
 * 1. 最小スワイプ距離のチェック
 * 2. スワイプ方向による基本的な段階移動の計算
 * 3. 高速スワイプ時の段階スキップ判定
 *
 * @param currentSnapPoint - 現在のスナップポイント（LOWEST | HALF | EXPANDED）
 * @param deltaY - 縦方向の移動量（px）。負の値は上方向、正の値は下方向
 * @param velocity - スワイプ速度（px/ms）
 * @returns スナップポイント判定結果
 *
 * @example
 * ```typescript
 * // 下から中間への移動
 * const result = calculateNextSnapPoint(SNAP_POINTS.LOWEST, -30, 0.3);
 * // result.targetSnapPoint === SNAP_POINTS.HALF
 *
 * // 高速スワイプで段階スキップ
 * const result = calculateNextSnapPoint(SNAP_POINTS.LOWEST, -50, 0.5);
 * // result.targetSnapPoint === SNAP_POINTS.EXPANDED
 * // result.shouldSkipSteps === true
 * ```
 */
export function calculateNextSnapPoint(
  currentSnapPoint: number | string | null,
  deltaY: number,
  velocity: number
): SnapPointResult {
  // 初期値として現在のスナップポイントを設定
  let targetSnapPoint: number | string | null = currentSnapPoint;
  let shouldSkipSteps = false;

  // ===== 最小スワイプ距離チェック =====
  // 意図しない微細な動きではスナップポイントを変更しない
  if (Math.abs(deltaY) < TOUCH_CONFIG.MIN_SWIPE_DISTANCE) {
    return { targetSnapPoint, shouldSkipSteps };
  }

  // ===== 基本的な段階移動の計算 =====
  if (deltaY < 0) {
    // 上方向のスワイプ：より展開された状態に移動
    if (currentSnapPoint === SNAP_POINTS.LOWEST) {
      targetSnapPoint = SNAP_POINTS.HALF;
    } else if (currentSnapPoint === SNAP_POINTS.HALF) {
      targetSnapPoint = SNAP_POINTS.EXPANDED;
    }
    // EXPANDED状態では上方向スワイプは無効（それ以上展開できない）
  } else {
    // 下方向のスワイプ：より折りたたまれた状態に移動
    if (currentSnapPoint === SNAP_POINTS.EXPANDED) {
      targetSnapPoint = SNAP_POINTS.HALF;
    } else if (currentSnapPoint === SNAP_POINTS.HALF) {
      targetSnapPoint = SNAP_POINTS.LOWEST;
    }
    // LOWEST状態では下方向スワイプは無効（それ以上折りたためない）
  }

  // ===== 高速スワイプ時の段階スキップ判定 =====
  // 速度と距離の両方が閾値を超えた場合、中間段階をスキップ
  if (
    velocity > TOUCH_CONFIG.SNAP_VELOCITY_THRESHOLD &&
    Math.abs(deltaY) >= TOUCH_CONFIG.MIN_SWIPE_DISTANCE
  ) {
    shouldSkipSteps = true;

    if (deltaY < 0 && currentSnapPoint === SNAP_POINTS.LOWEST) {
      // 最下位から最上位へ一気にジャンプ
      targetSnapPoint = SNAP_POINTS.EXPANDED;
    } else if (deltaY > 0 && currentSnapPoint === SNAP_POINTS.EXPANDED) {
      // 最上位から最下位へ一気にジャンプ
      targetSnapPoint = SNAP_POINTS.LOWEST;
    }
    // HALF状態からの高速スワイプは基本移動と同じ（既に隣接状態のため）
  }

  return { targetSnapPoint, shouldSkipSteps };
}
