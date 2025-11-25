import React from 'react';

import { Canvas } from '@/components/layouts/Canvas';
import { ClassNameProps } from '@/shared/types';

import { ControllerPanel } from './ControllerPanel';
import { InformationPanel } from './InformationPanel';
import { ResizableLayoutProvider } from './ResizableLayoutProvider';

/**
 * デスクトップ用3分割レイアウトコンポーネント
 *
 * Composition Patternを採用し、ResizableLayoutProviderでラップすることで：
 * - リサイザブル機能はClient Componentで提供
 * - コンテンツ部分はServer Componentのまま維持
 *
 * 構成:
 * - 左: ControllerPanel（ViewController等）- リサイザブル
 * - 中央: Canvas（五度圏・クロマチック円）- リサイザブル
 * - 右: InformationPanel（詳細情報）- リサイザブル
 */
export const ThreeColumnLayout: React.FC<ClassNameProps> = ({ className }) => {
  return (
    <ResizableLayoutProvider
      className={className}
      storageId="hub-layout"
      leftPanel={<ControllerPanel className="h-full" />}
      centerPanel={<Canvas className="h-full min-w-0" />}
      rightPanel={<InformationPanel className="h-full" />}
    />
  );
};
