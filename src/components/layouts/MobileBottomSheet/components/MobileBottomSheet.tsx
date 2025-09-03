'use client';

import React from 'react';
import { Drawer as VaulDrawer } from 'vaul';
import { SNAP_POINTS } from '../constants';
import { cn } from '@/lib/utils';
import type { ClassNameProps } from '@/shared/types';
import { CloseIcon, HandleIcon } from '../../../../shared/components/icons';
import { useCustomTouchHandler } from '../hooks/useCustomTouchHandler';
import { ControllerPanel } from '../../ThreeColumnLayout';

// propsの型定義 - Controller専用に簡素化
interface MobileBottomSheetProps extends ClassNameProps {
  activeSnapPoint: number | string | null;
  setActiveSnapPoint: (point: number | string | null) => void;
  // タブ機能は削除（後方互換性のため残すが使用しない）
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
}

export const MobileBottomSheet: React.FC<MobileBottomSheetProps> = ({
  className,
  activeSnapPoint,
  setActiveSnapPoint,
  // activeTab, onTabChange は不要（Controller専用）
}) => {
  // カスタムタッチハンドラーでvaulの判定をバイパス
  const { touchHandlers } = useCustomTouchHandler({
    activeSnapPoint,
    setActiveSnapPoint,
    isEnabled: true,
  });

  return (
    <VaulDrawer.Root
      shouldScaleBackground
      dismissible={false}
      modal={false}
      activeSnapPoint={activeSnapPoint}
      setActiveSnapPoint={setActiveSnapPoint}
      snapPoints={[SNAP_POINTS.LOWEST, SNAP_POINTS.HALF, SNAP_POINTS.EXPANDED]}
      closeThreshold={0.25} // ドローワーの高さの25%がドラッグされると閉じる
      scrollLockTimeout={0} // スクロールロックが適用されるまでの遅延時間
      defaultOpen
    >
      <VaulDrawer.Portal>
        <VaulDrawer.Overlay
          className="fixed inset-0 z-50 bg-black/40"
          onClick={() => setActiveSnapPoint(SNAP_POINTS.LOWEST)}
        />
        <VaulDrawer.Content
          className={cn(
            'fixed inset-x-0 bottom-0 z-50 mt-24 flex h-full flex-col rounded-t-[10px] border',
            'bg-background-muted/80 border-border backdrop-blur-sm',
            className
          )}
        >
          {/* カスタムタッチハンドラー用ラッパー（vaulとの競合回避） */}
          <div className="flex h-full flex-col" {...touchHandlers}>
            {/* ヘッダー */}
            <div className="border-border border-b px-4 pt-3 pb-4">
              {/* ドラッグ用のハンドルアイコン */}
              <HandleIcon className="mx-auto mb-3" />
              <VaulDrawer.Title className="sr-only">コントローラー</VaulDrawer.Title>
              <VaulDrawer.Description className="sr-only">
                音楽理論ビューの切り替えとコントロールパネル
              </VaulDrawer.Description>
              <div className="flex items-center justify-between">
                {/* Controller Title */}
                <h3 className="text-foreground text-sm">Controller</h3>
                {/* キャンセルボタン */}
                <button
                  onClick={() => {
                    setActiveSnapPoint(SNAP_POINTS.LOWEST);
                  }}
                  className="text-secondary-foreground hover:text-foreground flex h-8 w-8 items-center justify-center rounded-md transition-colors"
                  aria-label="閉じる"
                  type="button"
                >
                  {/* Xアイコン */}
                  <CloseIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* コンテンツエリア */}
            <div className="flex-1 overflow-y-auto p-6">
              <ControllerPanel />
            </div>
          </div>
        </VaulDrawer.Content>
      </VaulDrawer.Portal>
    </VaulDrawer.Root>
  );
};
