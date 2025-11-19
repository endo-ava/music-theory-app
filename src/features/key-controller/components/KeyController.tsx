'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';
import type { ClassNameProps } from '@/shared/types';
import { useKeyController } from '../hooks/useKeyController';
import { RootSelector } from './RootSelector';
import { ModeSlider } from './ModeSlider';
import { MajorKeySelector } from './MajorKeySelector';
import { RelativeModeSlider } from './RelativeModeSlider';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

/**
 * KeyControllerコンポーネントのProps
 */
export interface KeyControllerProps extends ClassNameProps {
  /** コンポーネントのタイトル */
  title?: string;
}

/**
 * Key Controller (C-2) コンポーネント - トグルUI版
 *
 * アプリケーションの音楽的文脈（キー/モード）を設定する。
 * 「同主調（Parallel）」と「平行調（Relative）」という2つの異なる視点から、
 * Tonic（主音）とMode（旋法）を直感的に選択・探求するためのインターフェースを提供。
 *
 * 【機能】
 * - **Parallel Mode（同主調）**: Root固定、Mode変化。同じ主音で調号（明暗）を変更
 * - **Relative Mode（平行調）**: 親Major Key固定、Root自動変化。同じ調号内で主音を変更
 *
 * 設計思想:
 * - **2つの視点**: 同主調と平行調という音楽理論の重要な関係性を体感的に学習
 * - **インタラクティブなフィードバック**: スライダー操作でCanvas上の表示がリアルタイム変化
 * - **客観的事実の優先**: 解釈的表現ではなく、音楽理論的事実（#/♭、ディグリー）を表記
 *
 * 設計原則（SOLID）:
 * - SRP: UI表示とビジネスロジックを分離（useKeyControllerに委譲）
 * - OCP: コンポーネント構成により拡張に開放
 * - DIP: 抽象化されたフックに依存
 *
 * @param props - コンポーネントのプロパティ
 * @returns KeyControllerのJSX要素
 */
export const KeyController: React.FC<KeyControllerProps> = ({
  className,
  title = 'Key / Mode',
}) => {
  const {
    currentKey,
    selectionMode,
    setSelectionMode,
    // Parallel Mode用
    currentTonic,
    currentModeIndex,
    handleRootChange,
    handleModeChange,
    // Relative Mode用
    parentMajorKey,
    relativeModeIndex,
    handleMajorKeyChange,
    handleRelativeModeChange,
  } = useKeyController();

  return (
    <div
      className={twMerge(
        'border-border bg-card space-y-4 rounded-lg border p-4 shadow-sm',
        className
      )}
    >
      {/* Component Title とトグルUI - モバイルでは非表示、md以上で表示 */}
      <div className="hidden items-center justify-between md:flex">
        <h2 className="text-lg font-semibold">{title}</h2>

        {/* トグルUI: Parallel / Relative */}
        <ToggleGroup
          type="single"
          value={selectionMode}
          onValueChange={value => value && setSelectionMode(value as 'parallel' | 'relative')}
          size="sm"
          className="justify-start"
        >
          <ToggleGroupItem value="parallel" aria-label="Parallel Mode" className="text-xs">
            Parallel
          </ToggleGroupItem>
          <ToggleGroupItem value="relative" aria-label="Relative Mode" className="text-xs">
            Relative
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Parallel Mode (同主調) */}
      {selectionMode === 'parallel' && (
        <div className="space-y-4">
          {/* Root Selector */}
          <div className="space-y-2">
            <h3 className="text-secondary-foreground text-sm font-medium">Root</h3>
            <RootSelector value={currentTonic} onValueChange={handleRootChange} className="w-30" />
          </div>

          {/* Mode Slider */}
          <div className="space-y-2">
            <h3 className="text-secondary-foreground text-sm font-medium">Mode</h3>
            <ModeSlider
              value={currentModeIndex}
              onValueChange={handleModeChange}
              className="w-full"
            />
          </div>
        </div>
      )}

      {/* Relative Mode (平行調) */}
      {selectionMode === 'relative' && (
        <div className="space-y-4">
          {/* Major Key Selector */}
          <div className="space-y-2">
            <h3 className="text-secondary-foreground text-sm font-medium">Major Key</h3>
            <MajorKeySelector
              value={parentMajorKey}
              onValueChange={handleMajorKeyChange}
              className="w-42"
            />
          </div>

          {/* Relative Mode Slider */}
          <div className="space-y-2">
            <h3 className="text-secondary-foreground text-sm font-medium">Mode</h3>
            <RelativeModeSlider
              value={relativeModeIndex}
              onValueChange={handleRelativeModeChange}
              className="w-full"
            />
          </div>
        </div>
      )}

      {/* Current Key Display */}
      <div className="text-secondary-foreground text-right text-sm">
        Current: <span className="text-foreground font-medium">{currentKey.contextName}</span>
      </div>
    </div>
  );
};
