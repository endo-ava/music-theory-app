'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { twMerge } from 'tailwind-merge';
import { ViewController } from '@/features/view-controller';

interface BottomSheetContentProps {
  /**
   * コンテンツが表示されているかどうか
   */
  contentVisible: boolean;
  /**
   * シートが展開されているかどうか
   */
  isExpanded: boolean;
  /**
   * ヘッダーの高さ（レイアウト計算用）
   */
  headerHeight: number;
}

/**
 * BottomSheetContentコンポーネント
 *
 * ボトムシートのタブナビゲーションとコンテンツ表示を管理する。
 * タブの状態管理とコンテンツの条件分岐表示を担当。
 *
 * @param props - コンポーネントのプロパティ
 * @returns BottomSheetContentのJSX要素
 */
export const BottomSheetContent: React.FC<BottomSheetContentProps> = ({
  contentVisible,
  isExpanded,
  headerHeight,
}) => {
  const [activeTab, setActiveTab] = useState<'view' | 'layer'>('layer');

  if (!contentVisible) {
    return null;
  }

  return (
    <>
      {/* Content Header (visible when half or expanded) */}
      <motion.div
        className="border-border flex w-full flex-col border-b"
        style={{ pointerEvents: contentVisible ? 'auto' : 'none' }}
      >
        {/* Tab Navigation Area */}
        <div className="flex w-full px-6 pb-4">
          <button
            className={twMerge(
              'flex-1 py-3 text-center text-sm font-medium transition-colors',
              activeTab === 'view'
                ? 'text-text-primary border-primary border-b-2'
                : 'text-text-secondary hover:text-text-primary'
            )}
            onClick={() => setActiveTab('view')}
          >
            View
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
            Layer
          </button>
        </div>
      </motion.div>

      {/* Content Area */}
      <motion.div
        className="overflow-y-auto p-6"
        style={{
          maxHeight: isExpanded
            ? `calc(85vh - ${headerHeight}px)`
            : `calc(42.5vh - ${headerHeight}px)`,
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
    </>
  );
};
