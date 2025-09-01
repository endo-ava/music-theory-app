'use client';

import React from 'react';
import { Panel, PanelGroup } from 'react-resizable-panels';
import { twMerge } from 'tailwind-merge';

import { ClassNameProps } from '@/shared/types';
import { ResizeHandle } from './ResizeHandle';
import { LayoutResetButton } from './LayoutResetButton';

interface ResizableLayoutProviderProps extends ClassNameProps {
  /** 左パネルコンテンツ (Controller) */
  leftPanel: React.ReactNode;
  /** 中央パネルコンテンツ (Canvas) */
  centerPanel: React.ReactNode;
  /** 右パネルコンテンツ (Info) */
  rightPanel: React.ReactNode;
}

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
}) => {
  return (
    <div className={twMerge('relative h-full', className)}>
      <PanelGroup direction="horizontal" autoSaveId="three-column-layout">
        {/* Left: Controller Panel */}
        <Panel defaultSize={25} minSize={15} className="min-w-[200px]">
          <div className="h-full">{leftPanel}</div>
        </Panel>

        {/* Resizer between Controller and Canvas */}
        <ResizeHandle id="controller-canvas-divider" />

        {/* Center: Canvas */}
        <Panel defaultSize={50} minSize={30} className="min-w-[300px]">
          <div className="h-full min-w-0">{centerPanel}</div>
        </Panel>

        {/* Resizer between Canvas and Info */}
        <ResizeHandle id="canvas-info-divider" />

        {/* Right: Info Panel */}
        <Panel defaultSize={25} minSize={15} className="min-w-[200px]">
          <div className="h-full">{rightPanel}</div>
        </Panel>
      </PanelGroup>

      {/* Layout Reset Button */}
      <LayoutResetButton position="top-right" />
    </div>
  );
};
