'use client';

import React, { useState } from 'react';
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

  return (
    <div className={cn('flex h-dvh flex-col', className)}>
      {/* Top: Canvas (Fixed) */}
      <div className="relative shrink-0">{canvas}</div>

      <Divider />

      {/* Scrollable Area containing Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Middle: Content Area */}
        <div
          className={cn(activeTab === 'controller' ? 'block' : 'hidden')}
          role="tabpanel"
          id="tabpanel-controller"
          aria-labelledby="tab-controller"
          tabIndex={0}
        >
          {controller}
        </div>
        <div
          className={cn(activeTab === 'information' ? 'block' : 'hidden')}
          role="tabpanel"
          id="tabpanel-information"
          aria-labelledby="tab-information"
          tabIndex={0}
        >
          {information}
        </div>
      </div>

      {/* Bottom: Tab Bar */}
      <MobileTabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};
