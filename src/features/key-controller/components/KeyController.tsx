'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';
import type { ClassNameProps } from '@/shared/types';
import { useKeyController } from '../hooks/useKeyController';
import { RootSelector } from './RootSelector';
import { ModeSlider } from './ModeSlider';

/**
 * KeyControllerコンポーネントのProps
 */
export interface KeyControllerProps extends ClassNameProps {
  /** コンポーネントのタイトル */
  title?: string;
}

/**
 * Key Controller (C-2) コンポーネント - 新規設計版
 *
 * アプリケーションの音楽的文脈（キー/モード）を設定する。
 * Tonic（主音）とMode（旋法）を、素早くかつ直感的に選択するためのインターフェースを提供。
 *
 * 【新規設計準拠の実装】
 * - **Root Selector**: 12の主音（C, C♯/D♭...）を検索・選択するためのドロップダウンメニュー（最小幅）
 * - **Mode Slider**: 7つのモード（Lydian, Ionian...）を「#多（シャープ系）」から「♭多（フラット系）」への連続的な変化として表現するスライダー
 * - **Current Display**: RootとModeの現在の組み合わせをシンプルなテキストで表示
 *
 * 設計思想:
 * - **検索性と連続性の両立**: Root音は検索性重視のドロップダウン、Modeは調号特性の連続的変化を体感できるスライダー
 * - **インタラクティブなフィードバック**: スライダーを動かすとCanvas上の構成音がリアルタイムで変化
 * - **客観的事実の優先**: 解釈的表現（明暗）ではなく、音楽理論的事実（#/♭の特性）を表記
 * - **情報密度の最適化**: 必要最小限のスペースで最大限の情報を提供
 *
 * 設計原則（SOLID）:
 * - SRP: UI表示とビジネスロジックを分離（useKeyControllerに委譲）
 * - OCP: コンポーネント構成により拡張に開放
 * - DIP: 抽象化されたフックに依存
 *
 * @param props - コンポーネントのプロパティ
 * @returns KeyControllerのJSX要素
 */
export const KeyController: React.FC<KeyControllerProps> = ({ className, title = 'Key' }) => {
  const { currentKey, currentTonic, currentModeIndex, handleRootChange, handleModeChange } =
    useKeyController();

  return (
    <div className={twMerge('space-y-4', className)}>
      {/* Component Title - モバイルでは非表示、md以上で表示 */}
      <h2 className="text-foreground hidden text-lg md:block">{title}</h2>

      {/* Root Selector */}
      <div className="space-y-2">
        <h3 className="text-secondary-foreground text-sm font-medium">Root</h3>
        <RootSelector value={currentTonic} onValueChange={handleRootChange} className="w-24" />
      </div>

      {/* Mode Slider */}
      <div className="space-y-2">
        <h3 className="text-secondary-foreground text-sm font-medium">Mode</h3>
        <ModeSlider value={currentModeIndex} onValueChange={handleModeChange} className="w-full" />
      </div>

      {/* Current Key Display */}
      <div className="text-secondary-foreground text-right text-sm">
        Current: <span className="text-foreground font-medium">{currentKey.contextName}</span>
      </div>
    </div>
  );
};
