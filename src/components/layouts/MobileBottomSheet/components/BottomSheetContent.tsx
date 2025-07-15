'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ViewController } from '@/features/view-controller';
import { BottomSheetTabNavigation } from './BottomSheetTabNavigation';
import { TABS } from '../constants';

/**
 * BottomSheetContentコンポーネントのProps
 */
export interface BottomSheetContentProps {
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
  /**
   * シートの高さ（レイアウト計算用）
   */
  sheetHeight: number;
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
  sheetHeight,
}) => {
  const [activeTab, setActiveTab] = useState<string>(TABS[0].id);

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
        <BottomSheetTabNavigation tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
      </motion.div>

      {/* Content Area */}
      <motion.div
        className="overflow-y-auto p-6"
        style={{
          maxHeight: isExpanded
            ? `${sheetHeight * 0.85 - headerHeight}px`
            : `${sheetHeight * 0.425 - headerHeight}px`,
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
