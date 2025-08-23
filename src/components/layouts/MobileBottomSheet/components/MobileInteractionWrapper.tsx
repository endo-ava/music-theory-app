'use client';

import React, { useCallback, useState, useEffect } from 'react';
import { MobileBottomSheet } from './MobileBottomSheet';
import { SNAP_POINTS, TABS } from '../constants';

interface MobileInteractionWrapperProps {
  children: React.ReactNode;
}

export function MobileInteractionWrapper({ children }: MobileInteractionWrapperProps) {
  // スナップポイント用のstate
  const [activeSnapPoint, setActiveSnapPoint] = useState<number | string | null>(
    SNAP_POINTS.LOWEST
  );
  // タブ用のstate
  const [activeTab, setActiveTab] = useState<string>(TABS[0].id);

  // Memoized onClick handler for background click
  const handleBackgroundClick = useCallback(() => {
    if (activeSnapPoint !== SNAP_POINTS.LOWEST) {
      setActiveSnapPoint(SNAP_POINTS.LOWEST);
    }
  }, [activeSnapPoint, setActiveSnapPoint]);

  // ボトムシートが開いている時に背景スクロールを無効化
  useEffect(() => {
    if (activeSnapPoint !== SNAP_POINTS.LOWEST) {
      // ボトムシートが開いている場合、背景スクロールを無効化
      document.body.style.overflow = 'hidden';
    } else {
      // ボトムシートが閉じている場合、背景スクロールを有効化
      document.body.style.overflow = '';
    }

    // クリーンアップ
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeSnapPoint]);

  return (
    <>
      {/* 背景クリック用のラッパー */}
      <div className="flex-1" onClick={handleBackgroundClick}>
        {/* Homeコンポーネントから渡された子要素（Canvasなど）を表示 */}
        {children}
      </div>

      {/* モバイル専用ボトムシート*/}
      <MobileBottomSheet
        className="md:hidden"
        activeSnapPoint={activeSnapPoint}
        setActiveSnapPoint={setActiveSnapPoint}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </>
  );
}
