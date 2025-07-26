'use client';

import React from 'react';
import { Drawer as VaulDrawer } from 'vaul';
import { ViewController } from '@/features/view-controller';
import { BottomSheetTabNavigation } from './BottomSheetTabNavigation';
import { SNAP_POINTS, TABS } from '../constants';
import { cn } from '@/lib/utils';
import type { ClassNameProps } from '@/shared/types';
import { CloseIcon, HandleIcon } from '../../../../shared/components/icons';

// propsの型定義
interface MobileBottomSheetProps extends ClassNameProps {
  activeSnapPoint: number | string | null;
  setActiveSnapPoint: (point: number | string | null) => void;
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const MobileBottomSheet: React.FC<MobileBottomSheetProps> = ({
  className,
  activeSnapPoint,
  setActiveSnapPoint,
  activeTab,
  onTabChange,
}) => {
  return (
    <VaulDrawer.Root
      shouldScaleBackground={false} // 実機でのレンダリング負荷軽減
      dismissible={false}
      modal={false}
      activeSnapPoint={activeSnapPoint}
      setActiveSnapPoint={setActiveSnapPoint}
      snapPoints={[SNAP_POINTS.LOWEST, SNAP_POINTS.HALF, SNAP_POINTS.EXPANDED]}
      closeThreshold={0.1} // より敏感な閾値設定（実機での反応改善）
      scrollLockTimeout={0} // 即座にスクロールロック適用
      snapToSequentialPoint={false} // 速度ベースのスワイプを有効化
      handleOnly={false} // 全体でドラッグ可能を維持
      noBodyStyles={false} // vaulの標準スタイル制御を使用
      repositionInputs={true} // iOS キーボード問題の回避
      defaultOpen
    >
      <VaulDrawer.Portal>
        <VaulDrawer.Overlay
          className="fixed inset-0 z-50 bg-black/40"
          onClick={() => setActiveSnapPoint(SNAP_POINTS.LOWEST)}
        />
        <VaulDrawer.Content
          data-vaul-drag-handle
          className={cn(
            'fixed inset-x-0 bottom-0 z-50 mt-24 flex h-full flex-col rounded-t-[10px] border',
            'bg-background-muted/80 border-border backdrop-blur-sm',
            className
          )}
        >
          <div className="flex h-full flex-col">
            {/* ヘッダー */}
            <div className="border-border border-b px-4 pt-3 pb-4">
              {/* ドラッグ用のハンドルアイコン */}
              <HandleIcon className="mx-auto mb-3" />
              <VaulDrawer.Title className="sr-only">ボトムシート</VaulDrawer.Title>
              <div className="flex items-center justify-between">
                {/* 左側のスペーサー */}
                <div className="w-8" />
                {/* キャンセルボタン */}
                <button
                  onClick={() => {
                    setActiveSnapPoint(SNAP_POINTS.LOWEST);
                  }}
                  className="text-text-secondary hover:text-text-primary flex h-8 w-8 items-center justify-center rounded-md transition-colors"
                  aria-label="閉じる"
                  type="button"
                >
                  {/* Xアイコン */}
                  <CloseIcon className="h-4 w-4" />
                </button>
              </div>

              {/* Tab Navigation */}
              <BottomSheetTabNavigation
                tabs={TABS}
                activeTab={activeTab}
                onTabChange={onTabChange}
              />
            </div>

            {/* コンテンツエリア */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'view' && <ViewController />}
              {activeTab === 'layer' && (
                <div className="text-text-primary">レイヤー設定のコンテンツがここに入ります。</div>
              )}
            </div>
          </div>
        </VaulDrawer.Content>
      </VaulDrawer.Portal>
    </VaulDrawer.Root>
  );
};
