import React from 'react';
import { Canvas } from '@/components/layouts/Canvas';
import { ControllerPanel } from '@/components/layouts/ThreeColumnLayout/components/ControllerPanel';
import { InformationPanel } from '@/components/layouts/ThreeColumnLayout/components/InformationPanel';
import { ClassNameProps } from '@/types';
import { MobileTabStructure } from './MobileTabStructure';

/**
 * モバイル用タブレアウトコンポーネント
 *
 * MobileTabStructureを使用して、実際のアプリケーションパネル（Canvas, Controller, Information）を
 * 構成するコンポジットコンポーネント。
 *
 * @param props - コンポーネントのプロパティ
 * @returns モバイル用タブレアウトのJSX要素
 */
export const MobileTabLayout: React.FC<ClassNameProps> = ({ className }) => {
  return (
    <MobileTabStructure
      className={className}
      canvas={<Canvas />}
      controller={<ControllerPanel />}
      information={<InformationPanel />}
    />
  );
};
