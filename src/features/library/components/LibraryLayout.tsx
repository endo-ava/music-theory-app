'use client';

import React from 'react';
import { Panel, PanelGroup } from 'react-resizable-panels';
import { ResizeHandle } from '@/components/layouts/ThreeColumnLayout/components/ResizeHandle';
import { MobileBottomSheet, SNAP_POINTS } from '@/components/layouts/MobileBottomSheet';
import { LibrarySidebar } from './LibrarySidebar/LibrarySidebar';
import { AtlasCanvas } from './AtlasCanvas/AtlasCanvas';
import { LibraryDetailPanel } from './LibraryDetailPanel/LibraryDetailPanel';

export const LibraryLayout: React.FC = () => {
  const [activeSnapPoint, setActiveSnapPoint] = React.useState<number | string | null>(
    SNAP_POINTS.LOWEST
  );
  const [isDetailPanelOpen, setIsDetailPanelOpen] = React.useState(false);

  return (
    <div className="h-[calc(100dvh-4rem)] w-full p-6">
      {/* PC Layout (md and up) */}
      <div className="hidden h-full md:block">
        <PanelGroup direction="horizontal" autoSaveId="library-layout" className="h-full">
          {/* Left: Sidebar */}
          <Panel defaultSize={20} minSize={15} className="min-w-[200px]">
            <LibrarySidebar className="h-full" />
          </Panel>

          <ResizeHandle id="sidebar-canvas-divider" />

          {/* Center: Canvas */}
          <Panel minSize={30} className="relative min-w-[300px]">
            <div className="border-border h-full w-full overflow-hidden rounded-lg border">
              <AtlasCanvas className="h-full" />
            </div>
          </Panel>

          {/* Right: Detail Panel (Conditional) */}
          <ResizeHandle id="canvas-detail-divider" />
          <Panel defaultSize={20} minSize={10} className="min-w-[200px]">
            <LibraryDetailPanel className="h-full" />
          </Panel>
        </PanelGroup>
      </div>

      {/* Mobile Layout (below md) */}
      <div className="block h-full md:hidden">
        <div className="relative flex h-full flex-col">
          {/* Mobile Search Bar Area (Placeholder) */}
          <div className="bg-card border-b p-2">
            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded border px-3 py-2 text-sm"
            />
          </div>

          {/* Main Canvas Area */}
          <div className="relative flex-1">
            <AtlasCanvas className="h-full" />
          </div>

          {/* Bottom Sheet for Details */}
          {/* Open Details button */}
          <button
            className="bg-primary text-primary-foreground absolute right-4 bottom-4 z-10 rounded-full px-4 py-2 shadow-lg"
            onClick={() => setActiveSnapPoint(SNAP_POINTS.HALF)}
          >
            Open Details
          </button>
          <MobileBottomSheet
            className="md:hidden"
            activeSnapPoint={activeSnapPoint}
            setActiveSnapPoint={setActiveSnapPoint}
          >
            <LibraryDetailPanel className="h-full border-0" />
          </MobileBottomSheet>
        </div>
      </div>
    </div>
  );
};
