'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';
import type { Tab } from '../types';

/**
 * BottomSheetTabNavigationコンポーネントのProps
 */
export interface BottomSheetTabNavigationProps {
  /**
   * 表示するタブの配列
   */
  tabs: Tab[];
  /**
   * 現在アクティブなタブのID
   */
  activeTab: string;
  /**
   * タブが変更されたときのコールバック関数
   */
  onTabChange: (tabId: string) => void;
}

/**
 * BottomSheetTabNavigationコンポーネント
 *
 * ボトムシートのタブナビゲーションを表示する。
 * 複数のタブを切り替えることができ、アクティブなタブを強調表示する。
 *
 * @param props - コンポーネントのプロパティ
 * @returns BottomSheetTabNavigationのJSX要素
 */
export const BottomSheetTabNavigation: React.FC<BottomSheetTabNavigationProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => {
  if (tabs.length === 0) {
    return null;
  }

  return (
    <div className="flex w-full px-6 pb-4">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={twMerge(
            'flex-1 py-3 text-center text-sm font-medium transition-colors',
            activeTab === tab.id
              ? 'text-foreground border-b'
              : 'text-secondary-foreground hover:text-foreground'
          )}
          onClick={() => onTabChange(tab.id)}
          aria-pressed={activeTab === tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};
