'use client';

import React from 'react';
import { motion } from 'motion/react';
import { twMerge } from 'tailwind-merge';
import { useBottomSheet } from '../hooks/useBottomSheet';
import { BottomSheetHeader } from './BottomSheetHeader';
import { BottomSheetContent } from './BottomSheetContent';
import type { ClassNameProps } from '@/shared/types';

/**
 * MobileBottomSheetコンポーネント
 *
 * モバイル環境で画面下部から表示されるUIコンテナ。
 * ボトムシート全体の動作とアニメーションを管理し、コンテンツ表示はBottomSheetContentコンポーネントに委譲する。
 * ボトムシート全体でのドラッグ操作をサポートし、内部コンテンツのスクロールとの競合を適切に処理する。
 *
 * @param props - コンポーネントのプロパティ
 * @returns MobileBottomSheetのJSX要素
 */
export const MobileBottomSheet: React.FC<ClassNameProps> = ({ className }) => {
  const {
    sheetRef,
    y,
    sheetHeight,
    isHalf,
    isExpanded,
    dragConstraints,
    toggleBottomSheet,
    collapseBottomSheet,
    handleDragStart,
    handleDragEnd,
  } = useBottomSheet();

  const contentVisible = isHalf || isExpanded;

  // Define heights for layout calculations
  const triggerAreaHeight = 60; // px (height of handle + close button + padding)
  const tabsAreaHeight = 60; // px (approximate height of tabs)
  const totalHeaderHeight = triggerAreaHeight + tabsAreaHeight;

  return (
    <div className={twMerge('pointer-events-none fixed right-0 bottom-0 left-0 z-50', className)}>
      <motion.div
        ref={sheetRef}
        className="bg-background-muted/80 border-border pointer-events-auto w-full rounded-t-2xl border-t border-r border-l shadow-lg backdrop-blur-sm"
        style={{
          height: sheetHeight > 0 ? `${sheetHeight}px` : '85vh',
          y,
        }}
        animate={{ y }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        drag="y"
        dragConstraints={dragConstraints}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        role="dialog"
        aria-modal="false"
        aria-labelledby="bottom-sheet-title"
      >
        {/* Header Area (Handle + Close Button) */}
        <BottomSheetHeader onToggle={toggleBottomSheet} onClose={collapseBottomSheet} />

        {/* Bottom Sheet Content */}
        <BottomSheetContent
          contentVisible={contentVisible}
          isExpanded={isExpanded}
          headerHeight={totalHeaderHeight}
        />
      </motion.div>
    </div>
  );
};
