'use client';

import { useCallback, useState, useEffect } from 'react';

import { SNAP_POINTS } from '../../MobileBottomSheet/constants';

/**
 * モバイルBottomSheet状態管理フック
 *
 * Client Componentでのみ使用される状態管理ロジックを分離することで、
 * Server ComponentでのSSRを保持するためのカスタムフック
 */
export const useMobileBottomSheet = () => {
  // BottomSheet用のスナップポイント状態
  const [activeSnapPoint, setActiveSnapPoint] = useState<number | string | null>(
    SNAP_POINTS.LOWEST
  );

  // 背景クリックでBottomSheetを最小化
  const handleBackgroundClick = useCallback(() => {
    if (activeSnapPoint !== SNAP_POINTS.LOWEST) {
      setActiveSnapPoint(SNAP_POINTS.LOWEST);
    }
  }, [activeSnapPoint]);

  // BottomSheetが展開時の背景スクロール制御
  useEffect(() => {
    if (activeSnapPoint !== SNAP_POINTS.LOWEST) {
      // BottomSheet展開時は背景スクロール無効化
      document.body.style.overflow = 'hidden';
    } else {
      // BottomSheet最小化時は背景スクロール有効化
      document.body.style.overflow = '';
    }

    // クリーンアップ
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeSnapPoint]);

  return {
    activeSnapPoint,
    setActiveSnapPoint,
    handleBackgroundClick,
  };
};
