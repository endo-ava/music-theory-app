'use client';

import React from 'react';
import { Drawer as VaulDrawer } from 'vaul';
import { SNAP_POINTS } from '../constants';
import { cn } from '@/lib/utils';
import type { ClassNameProps } from '@/types';
import { CloseIcon, HandleIcon } from '@/components/common/icons';
import { ControllerPanel } from '../../ThreeColumnLayout';
import { RemoveScroll } from 'react-remove-scroll';

// propsの型定義 - Controller専用に簡素化
interface MobileBottomSheetProps extends ClassNameProps {
  activeSnapPoint: number | string | null;
  setActiveSnapPoint: (point: number | string | null) => void;
  children?: React.ReactNode;
}

/**
 * モバイル用ボトムシートコンポーネント
 *
 * @deprecated MobileTabLayoutへの移行に伴い非推奨。
 *
 * @description
 * Vaulライブラリを使用したドラッグ可能なボトムシート。
 * Controller機能専用に最適化され、3段階のスナップポイント（最小・中央・展開）を提供。
 *
 * @features
 * - 3段階スナップポイント（6%, 50%, 85%）
 * - ドラッグハンドル付きヘッダー
 * - 背景オーバーレイタップで最小化
 * - 動的ビューポート対応（h-dvh）
 * - Controller専用UI（ControllerPanel統合）
 *
 * @param className - 追加のCSSクラス
 * @param activeSnapPoint - 現在のスナップポイント位置
 * @param setActiveSnapPoint - スナップポイント変更関数
 */
export const MobileBottomSheet: React.FC<MobileBottomSheetProps> = ({
  className,
  activeSnapPoint,
  setActiveSnapPoint,
  children,
}) => {
  return (
    <VaulDrawer.Root
      shouldScaleBackground={false}
      dismissible={false}
      modal={false}
      activeSnapPoint={activeSnapPoint}
      setActiveSnapPoint={setActiveSnapPoint}
      snapPoints={[SNAP_POINTS.LOWEST, SNAP_POINTS.HALF, SNAP_POINTS.EXPANDED]}
      closeThreshold={0.35} // RemoveScrollとの組み合わせで適切な閾値に調整
      scrollLockTimeout={50} // RemoveScrollとの協調のため最小限の遅延
      preventScrollRestoration={true} // RemoveScrollとの組み合わせで安定化
      defaultOpen
    >
      <VaulDrawer.Portal>
        <VaulDrawer.Overlay
          className="fixed inset-0 z-50 h-dvh w-full bg-black/40"
          onClick={() => setActiveSnapPoint(SNAP_POINTS.LOWEST)}
          aria-hidden="true"
        />
        <VaulDrawer.Content
          className={cn(
            'fixed inset-x-0 bottom-0 z-50 mt-24 flex h-dvh flex-col rounded-t-[10px] border',
            'bg-background-muted/80 border-border backdrop-blur-sm',
            className
          )}
        >
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

          {/* コンテンツエリア - 条件付きRemoveScrollで背景スクロールを適切に制御 */}
          <RemoveScroll
            enabled={activeSnapPoint !== SNAP_POINTS.LOWEST}
            allowPinchZoom
            as="div"
            className="flex-1 overflow-y-auto p-6"
          >
            {children || <ControllerPanel />}
          </RemoveScroll>
        </VaulDrawer.Content>
      </VaulDrawer.Portal>
    </VaulDrawer.Root>
  );
};
