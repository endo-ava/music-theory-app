'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';
import { useViewController } from '../hooks/useViewController';
import { HubRadioGroup } from './HubRadioGroup';
import type { ClassNameProps } from '@/shared/types';

/**
 * ViewControllerコンポーネントのProps
 */
export interface ViewControllerProps extends ClassNameProps {
  /** コンポーネントのタイトル */
  title?: string;
}

/**
 * View Controller (C-1) コンポーネント
 *
 * Canvasに描画するHub（五度圏 vs クロマチック）を切り替える。
 * 音楽を分析するための「世界観（レンズ）」を選択するコントロール。
 *
 * @param props - コンポーネントのプロパティ
 * @returns ViewControllerのJSX要素
 */
export const ViewController: React.FC<ViewControllerProps> = ({ className, title = 'View' }) => {
  // カスタムフックによるロジック分離
  const { hubType, hubOptions, selectedOption, radioGroupRef, handleHubTypeChange, handleKeyDown } =
    useViewController();

  return (
    <div className={twMerge('space-y-2', className)}>
      {/* Component Title - モバイルでは非表示、md以上で表示 */}
      <h2 className="text-foreground hidden text-lg md:block">{title}</h2>

      {/* Hub ラジオグループ - 子コンポーネントに分離 */}
      <HubRadioGroup
        ref={radioGroupRef}
        hubOptions={hubOptions}
        selectedHub={hubType}
        onHubChange={handleHubTypeChange}
        onKeyDown={handleKeyDown}
      />

      {/* 選択されたHubの説明 */}
      {selectedOption && (
        <p id={`${selectedOption.value}-description`} className="text-secondary-foreground text-sm">
          <span className="font-medium">{selectedOption.label}:</span> {selectedOption.description}
        </p>
      )}
    </div>
  );
};
