import React from 'react';

import { Canvas } from '@/components/layouts/Canvas';
import { ClassNameProps } from '@/shared/types';

import { ControllerPanel } from './ControllerPanel';
import { InformationPanel } from './InformationPanel';
import { ResizableLayoutProvider } from './ResizableLayoutProvider';

/**
 * 3分割レイアウトコンポーネント（Server Component）
 *
 * Composition Patternを採用し、ResizableLayoutProviderでラップすることで：
 * - リサイザブル機能はClient Componentで提供
 * - コンテンツ部分はServer Componentのまま維持
 *
 * 左: コントローラーパネル（ViewController等）
 * 中央: キャンバス（五度圏・クロマチック円）
 * 右: 情報パネル（SelectedElementArea + LayerConceptArea）
 */
export const ThreeColumnLayout: React.FC<ClassNameProps> = ({ className }) => {
  return (
    <ResizableLayoutProvider
      className={className}
      leftPanel={<ControllerPanel className="h-full" />}
      centerPanel={<Canvas className="h-full min-w-0" />}
      rightPanel={<InformationPanel className="h-full" />}
    />
  );
};
