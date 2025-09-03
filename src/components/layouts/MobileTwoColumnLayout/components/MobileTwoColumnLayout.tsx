import React from 'react';

import { Canvas } from '@/components/layouts/Canvas';
import { InformationPanel } from '@/components/layouts/ThreeColumnLayout/components/InformationPanel';
import { ClassNameProps } from '@/shared/types';

import { MobileBottomSheetProvider } from './MobileBottomSheetProvider';

/**
 * モバイル用2分割レイアウトコンポーネント
 *
 * Composition Patternを採用し、MobileBottomSheetProviderでラップすることで：
 * - BottomSheet機能はClient Componentで提供
 * - コンテンツ部分はServer Componentのまま維持
 *
 * 構成:
 * - 上部: Canvas（メイン表示エリア）- SSRで固定高さ
 * - 下部: InformationPanel（詳細情報）- SSRでスクロール可能
 * - BottomSheet: Controller用モバイルUI - Client Componentで状態管理
 */
export const MobileTwoColumnLayout: React.FC<ClassNameProps> = ({ className }) => {
  return (
    <MobileBottomSheetProvider
      className={className}
      topPanel={<Canvas />}
      bottomPanel={<InformationPanel />}
    />
  );
};
