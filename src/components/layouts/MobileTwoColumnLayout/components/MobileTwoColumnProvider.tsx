'use client';

import React from 'react';
import { MobileBottomSheet } from '@/components/layouts/MobileBottomSheet/components/MobileBottomSheet';
import { useMobileBottomSheet } from '@/components/layouts/MobileBottomSheet/hooks/useMobileBottomSheet';
import { ClassNameProps } from '@/shared/types';
import { twMerge } from 'tailwind-merge';

interface MobileTwoColumnProviderProps extends ClassNameProps {
  /** 上部パネルコンテンツ - メイン表示エリア (Canvas) */
  topPanel: React.ReactNode;
  /** 下部パネルコンテンツ - 詳細情報表示 (InformationPanel) */
  bottomPanel: React.ReactNode;
}

/**
 * モバイル2分割レイアウト用プロバイダーコンポーネント
 *
 * @description
 * モバイル端末でのボトムシート機能を統合管理するプロバイダーコンポーネント。
 * 背景クリックによるボトムシート制御と、子要素の表示を行う。
 * ThreeColumnLayoutとの一貫性を保つため、Provider命名規則を採用。
 *
 * @param topPanel - Top：Canvas
 * @param bottomPanel - Bottom： InformationPanel）
 * @param className - 追加のCSSクラス（ラッパー要素に適用）
 *
 */
export const MobileTwoColumnProvider: React.FC<MobileTwoColumnProviderProps> = ({
  className,
  topPanel,
  bottomPanel,
}) => {
  const { activeSnapPoint, setActiveSnapPoint } = useMobileBottomSheet();

  return (
    <>
      <div
        className={twMerge('flex h-dvh flex-col gap-4 pb-2', className)}
        aria-label="モバイル2分割レイアウト"
      >
        {/* Top: Canvas - メインコンテンツ表示（SSR） */}
        <div className="min-h-[300px]">{topPanel}</div>

        {/* Bottom: Information Panel - スクロール可能（SSR） */}
        <div className="min-h-[200px] flex-1 overflow-y-visible px-4">{bottomPanel}</div>
      </div>

      {/* モバイル専用ボトムシート*/}
      <MobileBottomSheet
        className="md:hidden"
        activeSnapPoint={activeSnapPoint}
        setActiveSnapPoint={setActiveSnapPoint}
      />
    </>
  );
};
