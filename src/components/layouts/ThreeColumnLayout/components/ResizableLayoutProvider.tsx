'use client';

import React from 'react';
import { Panel, PanelGroup } from 'react-resizable-panels';

import { ClassNameProps } from '@/shared/types';

import { ResizeHandle } from './ResizeHandle';

interface ResizableLayoutProviderProps extends ClassNameProps {
  /** 左パネルコンテンツ - 操作制御 (ControllerPanel) */
  leftPanel: React.ReactNode;
  /** 中央パネルコンテンツ - メイン表示エリア (Canvas) */
  centerPanel: React.ReactNode;
  /** 右パネルコンテンツ - 詳細情報表示 (InformationPanel) */
  rightPanel: React.ReactNode;
  /** localStorage保存用のID（画面ごとに異なる値を指定することで、レイアウト状態を独立させる） */
  storageId?: string;
  /** デフォルトレイアウト比率 [左%, 中央%, 右%] */
  defaultLayout?: readonly [number, number, number];
}

/** デフォルトレイアウト: [左25%, 中央50%, 右25%] */
const DEFAULT_LAYOUT = [25, 50, 25] as const;

/**
 * リサイザブルレイアウトプロバイダー (Client Component)
 *
 * react-resizable-panelsの機能をラップし、
 * 子コンテンツはServer Componentのまま維持するComposition Pattern
 */
export const ResizableLayoutProvider: React.FC<ResizableLayoutProviderProps> = ({
  className,
  leftPanel,
  centerPanel,
  rightPanel,
  storageId = 'three-column-layout',
  defaultLayout = DEFAULT_LAYOUT,
}) => {
  return (
    <div className={className} aria-label="デスクトップ用3分割レイアウト">
      <PanelGroup direction="horizontal" autoSaveId={storageId} className="h-full">
        {/* Left: Controller Panel */}
        <Panel defaultSize={defaultLayout[0]} minSize={15} className="min-w-[200px]">
          <div className="h-full">{leftPanel}</div>
        </Panel>

        {/* Resizer between Controller and Canvas */}
        <ResizeHandle id="controller-canvas-divider" />

        {/* Center: Canvas */}
        <Panel defaultSize={defaultLayout[1]} minSize={30} className="min-w-[300px]">
          <div className="h-full min-w-0">{centerPanel}</div>
        </Panel>

        {/* Resizer between Canvas and Info */}
        <ResizeHandle id="canvas-info-divider" />

        {/* Right: Info Panel */}
        <Panel defaultSize={defaultLayout[2]} minSize={15} className="min-w-[200px]">
          <div className="h-full">{rightPanel}</div>
        </Panel>
      </PanelGroup>
    </div>
  );
};
