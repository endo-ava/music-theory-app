'use client';

import React from 'react';
import { motion } from 'motion/react';
import { twMerge } from 'tailwind-merge';
import { useBottomSheet } from '../hooks/useBottomSheet';
import { CloseIcon, HandleIcon } from '@/shared/components/icons';
import { BottomSheetContent } from './BottomSheetContent';
import type { ClassNameProps } from '@/shared/types';

/**
 * MobileBottomSheetコンポーネント
 *
 * モバイル環境で画面下部から表示されるUIコンテナ。
 * ボトムシート全体の動作とアニメーションを管理し、コンテンツ表示はBottomSheetContentコンポーネントに委譲する。
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
        onDragEnd={handleDragEnd}
        role="dialog"
        aria-modal="false"
        aria-labelledby="bottom-sheet-title"
      >
        {/* Trigger Area (always visible, narrower) */}
        <motion.div
          className="flex cursor-pointer flex-col items-center px-6 py-2"
          onClick={toggleBottomSheet}
          whileTap={{ scale: 0.98 }}
        >
          <HandleIcon />
        </motion.div>

        {/* Close Button Area */}
        <div className="flex w-full justify-end px-6">
          <button
            onClick={collapseBottomSheet}
            className="text-text-secondary hover:text-text-primary rounded-md p-1 transition-colors"
            aria-label="閉じる"
          >
            <CloseIcon />
          </button>
        </div>

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
