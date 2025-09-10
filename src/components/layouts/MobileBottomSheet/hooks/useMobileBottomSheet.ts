'use client';

import { useState } from 'react';
import { SNAP_POINTS } from '../constants';

/**
 * モバイルBottomSheet状態管理フック
 *
 * スナップポイント状態管理と背景スクロール制御を提供
 * modal=falseによる背景インタラクション両立のため、カスタムスクロール制御を実装
 */
export const useMobileBottomSheet = () => {
  // BottomSheet用のスナップポイント状態
  const [activeSnapPoint, setActiveSnapPoint] = useState<number | string | null>(
    SNAP_POINTS.LOWEST
  );

  // 背景スクロール制御は完全にRemoveScrollに委譲
  // 手動制御による競合を避けるため、ここでのDOM操作は行わない

  return {
    activeSnapPoint,
    setActiveSnapPoint,
  };
};
