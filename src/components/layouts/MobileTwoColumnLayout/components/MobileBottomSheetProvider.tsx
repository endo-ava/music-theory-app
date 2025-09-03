'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';

import { ClassNameProps } from '@/shared/types';

import { MobileBottomSheet } from '../../MobileBottomSheet/components/MobileBottomSheet';
import { useMobileBottomSheet } from '../hooks/useMobileBottomSheet';

interface MobileBottomSheetProviderProps extends ClassNameProps {
  /** 上部パネルコンテンツ - メイン表示エリア (Canvas) */
  topPanel: React.ReactNode;
  /** 下部パネルコンテンツ - 詳細情報表示 (InformationPanel) */
  bottomPanel: React.ReactNode;
}

/**
 * モバイルBottomSheet専用プロバイダー (Client Component)
 *
 * Composition Patternを採用し、BottomSheetの状態管理のみを担当することで、
 * Server ComponentからClient Componentの範囲を最小限に抑制
 */
export const MobileBottomSheetProvider: React.FC<MobileBottomSheetProviderProps> = ({
  className,
  topPanel,
  bottomPanel,
}) => {
  const { activeSnapPoint, setActiveSnapPoint, handleBackgroundClick } = useMobileBottomSheet();

  return (
    <>
      {/* Main Layout: 背景クリック対応 */}
      <div
        className={twMerge('flex h-full flex-col gap-4 pb-2', className)}
        onClick={handleBackgroundClick}
        aria-label="モバイル2分割レイアウト"
      >
        {/* Top: Canvas - メインコンテンツ表示（SSR） */}
        <div className="min-h-[300px]">{topPanel}</div>

        {/* Bottom: Information Panel - スクロール可能（SSR） */}
        <div className="min-h-[200px] flex-1 overflow-y-auto rounded-lg px-4">{bottomPanel}</div>
      </div>

      {/* Controller BottomSheet - モバイルのみ表示 */}
      <MobileBottomSheet
        className="md:hidden"
        activeSnapPoint={activeSnapPoint}
        setActiveSnapPoint={setActiveSnapPoint}
        activeTab="view"
        onTabChange={() => {}} // No-op
      />
    </>
  );
};
