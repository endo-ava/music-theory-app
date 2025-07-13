'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { twMerge } from 'tailwind-merge';
import { ViewController } from '@/features/view-controller';
import { useBottomSheet } from '../hooks/useBottomSheet';
import { CloseIcon, HandleIcon } from '@/shared/components/icons';
import type { ClassNameProps } from '@/shared/types';

/**
 * MobileBottomSheetコンポーネント
 *
 * モバイル環境で画面下部から表示されるUIコンテナ。
 * トリガー、シート、コンテンツのすべてを単一コンポーネントで管理する。
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

  const [activeTab, setActiveTab] = useState<'view' | 'layer'>('view');

  const contentVisible = isHalf || isExpanded;

  // Define heights for layout calculations
  const triggerAreaHeight = 60; // px (height of handle + label + padding)
  const tabsAreaHeight = 60; // px (approximate height of tabs + close button row)
  const totalHeaderHeight = triggerAreaHeight + tabsAreaHeight; // Total height when expanded

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
          className="flex cursor-pointer flex-col items-center px-6 py-2" // py-2 for narrower height
          onClick={toggleBottomSheet}
          whileTap={{ scale: 0.98 }}
        >
          <HandleIcon />
        </motion.div>

        {/* Tabs and Close Button Area (visible when half or expanded) */}
        {contentVisible && (
          <motion.div
            className="border-border flex w-full flex-col border-b"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            style={{ pointerEvents: contentVisible ? 'auto' : 'none' }}
          >
            {/* Tab Navigation and Close Button Row */}
            <div className="flex w-full items-center justify-between px-6 py-4">
              {' '}
              {/* Adjusted padding */}
              <div className="flex flex-1">
                <button
                  className={twMerge(
                    'flex-1 py-3 text-center text-sm font-medium transition-colors',
                    activeTab === 'view'
                      ? 'text-text-primary border-primary border-b-2'
                      : 'text-text-secondary hover:text-text-primary'
                  )}
                  onClick={() => setActiveTab('view')}
                >
                  ビュー設定
                </button>
                <button
                  className={twMerge(
                    'flex-1 py-3 text-center text-sm font-medium transition-colors',
                    activeTab === 'layer'
                      ? 'text-text-primary border-primary border-b-2'
                      : 'text-text-secondary hover:text-text-primary'
                  )}
                  onClick={() => setActiveTab('layer')}
                >
                  レイヤー設定
                </button>
              </div>
              {/* Close Button */}
              <button
                onClick={collapseBottomSheet}
                className="text-text-secondary hover:text-text-primary ml-4 rounded-md p-1 transition-colors"
                aria-label="閉じる"
              >
                <CloseIcon />
              </button>
            </div>
          </motion.div>
        )}

        {/* Content Area */}
        <motion.div
          className="overflow-y-auto p-6"
          style={{
            maxHeight: isExpanded
              ? `calc(85vh - ${totalHeaderHeight}px)`
              : `calc(42.5vh - ${totalHeaderHeight}px)`,
            pointerEvents: contentVisible ? 'auto' : 'none',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: contentVisible ? 1 : 0 }}
          transition={{ delay: 0.2 }}
        >
          {activeTab === 'view' && <ViewController />}
          {activeTab === 'layer' && (
            <div className="text-text-primary">レイヤー設定のコンテンツがここに入ります。</div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};
