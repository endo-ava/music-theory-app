'use client';

import { useState, useEffect } from 'react';
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

  // 背景スクロール制御：ボトムシート展開時は背景スクロールを無効化
  useEffect(() => {
    const body = document.body;

    if (activeSnapPoint === SNAP_POINTS.LOWEST) {
      // 最小化時：背景スクロール有効化
      body.style.overflow = 'auto';
    } else {
      // 展開時：背景スクロール無効化（五度圏クリックは modal=false により可能）
      body.style.overflow = 'hidden';
    }

    // クリーンアップ：コンポーネントアンマウント時に元に戻す
    return () => {
      body.style.overflow = 'auto';
    };
  }, [activeSnapPoint]);

  return {
    activeSnapPoint,
    setActiveSnapPoint,
  };
};
