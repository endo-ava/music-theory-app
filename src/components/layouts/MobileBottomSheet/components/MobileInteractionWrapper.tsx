'use client';

import React, { useCallback, useState } from 'react';
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
  const [activeTab, setActiveTab] = useState<string>(TABS[1].id);

  // Memoized onClick handler for background click
  const handleBackgroundClick = useCallback(() => {
    if (activeSnapPoint !== SNAP_POINTS.LOWEST) {
      setActiveSnapPoint(SNAP_POINTS.LOWEST);
    }
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
