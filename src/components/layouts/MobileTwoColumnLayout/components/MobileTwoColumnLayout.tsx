import React from 'react';

import { Canvas } from '@/components/layouts/Canvas';
import { InformationPanel } from '@/components/layouts/ThreeColumnLayout/components/InformationPanel';
import { ClassNameProps } from '@/shared/types';
import { MobileTwoColumnProvider } from './MobileTwoColumnProvider';

/**
 * モバイル用2分割レイアウトコンポーネント
 *
 * MobileTwoColumnProviderを使用してBottomSheet機能を提供：
 * - 上部: Canvas（メイン表示エリア）
 * - 下部: InformationPanel（詳細情報）
 * - BottomSheet: Controller用モバイルUI
 *
 * ThreeColumnLayoutとの一貫性を保つため、Provider命名規則を採用。
 */
export const MobileTwoColumnLayout: React.FC<ClassNameProps> = ({ className }) => {
  return (
    <MobileTwoColumnProvider
      className={className}
      topPanel={<Canvas />}
      bottomPanel={<InformationPanel />}
    />
  );
};
