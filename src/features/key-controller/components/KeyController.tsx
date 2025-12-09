'use client';

import React from 'react';
import { Music2 } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import type { ClassNameProps } from '@/types';
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

const TOGGLE_ITEM_CLASS =
  'data-[state=on]:bg-primary data-[state=on]:text-primary-foreground text-xs text-muted-foreground hover:text-foreground';

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
      {/* Component Title とトグルUI */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Music2 className="text-muted-foreground h-4 w-4" />
            <h2 className="text-foreground text-sm font-semibold tracking-wider uppercase">
              {title}
            </h2>
          </div>
          {/* Current Key Badge */}
          <div className="bg-primary/10 text-primary border-primary/20 flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium shadow-[0_0_10px_-3px_var(--color-primary)]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
            {currentKey.contextName}
          </div>
        </div>

        {/* Controls Row: Toggle + Selector */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* トグルUI: Parallel / Relative */}
          <ToggleGroup
            type="single"
            value={selectionMode}
            onValueChange={value => value && setSelectionMode(value as 'parallel' | 'relative')}
            size="sm"
          >
            <ToggleGroupItem
              value="parallel"
              aria-label="Parallel Mode"
              className={TOGGLE_ITEM_CLASS}
            >
              Parallel
            </ToggleGroupItem>
            <ToggleGroupItem
              value="relative"
              aria-label="Relative Mode"
              className={TOGGLE_ITEM_CLASS}
            >
              Relative
            </ToggleGroupItem>
          </ToggleGroup>

          {/* Selector (Root or Major Key) */}
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">
              {selectionMode === 'parallel' ? 'Root' : 'Key'}
            </span>
            {selectionMode === 'parallel' ? (
              <RootSelector
                value={currentTonic}
                onValueChange={handleRootChange}
                className="w-28"
              />
            ) : (
              <MajorKeySelector
                value={parentMajorKey}
                onValueChange={handleMajorKeyChange}
                className="w-32"
              />
            )}
          </div>
        </div>

        {/* Mode Slider Area */}
        <div className="space-y-2 pt-1">
          <h3 className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
            Mode
          </h3>
          {selectionMode === 'parallel' ? (
            <ModeSlider
              value={currentModeIndex}
              onValueChange={handleModeChange}
              className="animate-in fade-in slide-in-from-left-1 w-full duration-300"
            />
          ) : (
            <RelativeModeSlider
              value={relativeModeIndex}
              onValueChange={handleRelativeModeChange}
              className="animate-in fade-in slide-in-from-right-1 w-full duration-300"
            />
          )}
        </div>
      </div>
    </div>
  );
};
