'use client';

import React, { useState, useRef } from 'react';
import { ClassNameProps } from '@/shared/types';
import { MobileTabBar } from './MobileTabBar';
import { cn } from '@/lib/utils';
import { Divider } from '../../../../shared/components/Divider';

interface MobileTabStructureProps extends ClassNameProps {
  /** 上部に表示するCanvasコンテンツ */
  canvas: React.ReactNode;
  /** Controllerタブで表示するコンテンツ */
  controller: React.ReactNode;
  /** Informationタブで表示するコンテンツ */
  information: React.ReactNode;
}

/**
 * モバイル用タブ構造コンポーネント
 *
 * レイアウトの構造（Canvas上部固定、コンテンツエリア、下部タブバー）と
 * タブ切り替えの状態管理を担当するプレゼンテーションコンポーネント。
 *
 * @param props - コンポーネントのプロパティ
 * @returns モバイル用タブ構造のJSX要素
 */
export const MobileTabStructure: React.FC<MobileTabStructureProps> = ({
  className,
  canvas,
  controller,
  information,
}) => {
  const [activeTab, setActiveTab] = useState<'controller' | 'information'>('controller');
  const panelRef = useRef<HTMLDivElement>(null);

  /**
   * タブ変更ハンドラー
   * タブを切り替え、新しく表示されたパネルにフォーカスを移動
   */
  const handleTabChange = (tab: 'controller' | 'information') => {
    setActiveTab(tab);
    // レンダリング後にパネルにフォーカスを移動（アクセシビリティのため）
    setTimeout(() => {
      panelRef.current?.focus();
    }, 0);
  };

  return (
    <div className={cn('flex h-dvh flex-col', className)}>
      {/* Top: Canvas (Fixed) */}
      <div className="relative shrink-0">{canvas}</div>

      <Divider />

      {/* Scrollable Area containing Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Middle: Content Area */}
        <div
          ref={activeTab === 'controller' ? panelRef : undefined}
          className={cn(activeTab === 'controller' ? 'block' : 'hidden')}
          role="tabpanel"
          id="tabpanel-controller"
          aria-labelledby="tab-controller"
          tabIndex={-1}
        >
          {controller}
        </div>
        <div
          ref={activeTab === 'information' ? panelRef : undefined}
          className={cn(activeTab === 'information' ? 'block' : 'hidden')}
          role="tabpanel"
          id="tabpanel-information"
          aria-labelledby="tab-information"
          tabIndex={-1}
        >
          {information}
        </div>
      </div>

      {/* Bottom: Tab Bar */}
      <MobileTabBar activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
};
