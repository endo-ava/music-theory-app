import React from 'react';
import { generateAtlasDataset } from '@/features/atlas/data/AtlasDataGenerator';
import { AtlasInteractiveLayout } from './AtlasInteractiveLayout';
import type { AtlasDataset } from '@/features/atlas/types';

/**
 * Atlas画面のレイアウトコンポーネント (Server Component)
 *
 * アプリケーションの「Atlas（用語辞典・概念マップ）」画面のルートコンポーネントです。
 * 以下の責務を持ちます：
 * 1. データの生成・取得 (Server Side) - `generateAtlasDataset` を使用
 * 2. Client Component (`AtlasInteractiveLayout`) へのデータおよび制御の委譲
 */
export const AtlasLayout: React.FC = () => {
  // Generate Data on Server
  const rawDataset = generateAtlasDataset();

  // Serialize to plain object (removes class instances/methods)
  const dataset = JSON.parse(JSON.stringify(rawDataset)) as AtlasDataset;

  return <AtlasInteractiveLayout dataset={dataset} />;
};
