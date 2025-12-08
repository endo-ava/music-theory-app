'use client';

import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AtlasCanvas, AtlasDetailPanel, AtlasSearchOverlay } from '@/features/atlas';
import { AtlasDataset } from '@/features/atlas/types';

interface AtlasInteractiveLayoutProps {
  dataset: AtlasDataset;
}

/**
 * Atlas Interactive Layout (Client Component)
 *
 * Atlas画面のクライアントサイド・インタラクションを管理するレイアウトコンポーネント。
 * Server Componentから受け取ったデータセットを表示し、
 * ユーザー操作（クリック、詳細表示、検索など）の状態を管理します。
 *
 * @param {AtlasInteractiveLayoutProps} props
 * @param {AtlasDataset} props.dataset - サーバー側で生成されたAtlasデータセット
 */
export const AtlasInteractiveLayout: React.FC<AtlasInteractiveLayoutProps> = ({ dataset }) => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleNodeClick = () => {
    setIsDetailOpen(true);
  };

  const handleBackgroundClick = () => {
    setIsDetailOpen(false);
  };

  return (
    <div className="bg-background absolute inset-0 h-full w-full overflow-hidden">
      {/* Full Screen Canvas */}
      <div className="absolute inset-0 z-0">
        <AtlasCanvas
          className="h-full w-full"
          dataset={dataset}
          onClick={handleNodeClick}
          onBackgroundClick={handleBackgroundClick}
        />
      </div>

      {/* Floating Search & Filter */}
      <AtlasSearchOverlay className="z-10" />

      {/* Floating Detail Panel */}
      <AnimatePresence>
        {isDetailOpen && (
          <AtlasDetailPanel
            isOpen={isDetailOpen}
            onClose={() => setIsDetailOpen(false)}
            className="z-20"
          />
        )}
      </AnimatePresence>
    </div>
  );
};
