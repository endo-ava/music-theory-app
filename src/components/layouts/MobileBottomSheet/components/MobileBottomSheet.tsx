'use client';

import React from 'react';
import { motion } from 'motion/react';
import { twMerge } from 'tailwind-merge';
import { ViewController } from '@/features/view-controller';
import { useBottomSheet } from '../hooks/useBottomSheet';
import type { ClassNameProps } from '@/shared/types';

/**
 * MobileBottomSheetコンポーネントのProps
 */
export interface MobileBottomSheetProps extends ClassNameProps {
  /** トリガーボタンのラベル */
  triggerLabel?: string;
}

/**
 * ハンドルアイコン（UIの取っ手部分）
 */
const HandleIcon: React.FC = () => (
  <svg
    width="32"
    height="6"
    viewBox="0 0 32 6"
    fill="none"
    className="text-text-secondary"
    aria-hidden="true"
  >
    <rect x="8" y="2" width="16" height="2" rx="1" fill="currentColor" />
  </svg>
);

/**
 * 閉じるボタンアイコン
 */
const CloseIcon: React.FC = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

/**
 * MobileBottomSheetコンポーネント
 *
 * モバイル環境で画面下部から表示されるUIコンテナ。
 * トリガー、シート、コンテンツのすべてを単一コンポーネントで管理する。
 *
 * @param props - コンポーネントのプロパティ
 * @returns MobileBottomSheetのJSX要素
 */
export const MobileBottomSheet: React.FC<MobileBottomSheetProps> = ({
  triggerLabel = 'コントロールパネル',
  className,
}) => {
  const {
    sheetRef,
    y,
    isHalf,
    isExpanded,
    dragConstraints,
    toggleBottomSheet,
    collapseBottomSheet,
    handleDragEnd,
  } = useBottomSheet();

  const contentVisible = isHalf || isExpanded;

  return (
    <div className={twMerge('fixed right-0 bottom-0 left-0 z-50', className)}>
      <motion.div
        ref={sheetRef}
        className="bg-background-muted/80 border-border w-full rounded-t-2xl border-t border-r border-l shadow-lg backdrop-blur-sm"
        style={{ height: '85vh' }}
        animate={{ y }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        drag="y"
        dragConstraints={dragConstraints}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        role="dialog"
        aria-modal="false"
        aria-labelledby="bottom-sheet-title"
      >
        {/* トリガーエリア */}
        <motion.div
          className="flex cursor-pointer flex-col items-center px-6 py-4"
          onClick={toggleBottomSheet}
          whileTap={{ scale: 0.98 }}
        >
          <HandleIcon />
          <span className="text-text-primary mt-2 text-sm font-medium">{triggerLabel}</span>
        </motion.div>

        {/* コンテンツヘッダー */}
        <motion.div
          className="border-border flex items-center justify-between border-b px-6 py-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: contentVisible ? 1 : 0 }}
          transition={{ delay: 0.1 }}
          style={{ pointerEvents: contentVisible ? 'auto' : 'none' }}
        >
          <h2 id="bottom-sheet-title" className="text-text-primary text-lg font-semibold">
            {triggerLabel}
          </h2>
          <button
            onClick={collapseBottomSheet}
            className="text-text-secondary hover:text-text-primary rounded-md p-1 transition-colors"
            aria-label="閉じる"
          >
            <CloseIcon />
          </button>
        </motion.div>

        {/* コンテンツエリア */}
        <motion.div
          className="overflow-y-auto p-6"
          style={{
            maxHeight: isExpanded ? 'calc(85vh - 160px)' : 'calc(42.5vh - 80px)',
            pointerEvents: contentVisible ? 'auto' : 'none',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: contentVisible ? 1 : 0 }}
          transition={{ delay: 0.15 }}
        >
          <ViewController />
        </motion.div>
      </motion.div>
    </div>
  );
};
