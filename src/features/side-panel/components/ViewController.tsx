'use client';

import { twMerge } from 'tailwind-merge';
import { useViewController } from '../hooks/useViewController';
import { HubRadioGroup } from './HubRadioGroup';
import { HubDescription } from './HubDescription';
import type { ClassNameProps } from '@/shared/types';

/**
 * View Controller コンポーネントのProps
 */
export interface ViewControllerProps extends ClassNameProps {
  /** コンポーネントの見出し */
  title?: string;
}

/**
 * View Controller (C-1) コンポーネント
 *
 * Canvasに描画するHub（五度圏 vs クロマチック）を切り替える。
 * 音楽を分析するための「世界観（レンズ）」を選択するコントロール。
 *
 * 設計思想：
 * - "Push Client Components to the leaves" の原則
 * - 単一責任原則の徹底
 * - アクセシビリティファースト設計（キーボードナビゲーション、roving tabindex）
 * - パフォーマンスを考慮した実装（useMemo, useCallback）
 * - カスタムフックによるロジック分離
 * - 子コンポーネントによる関心の分離
 *
 * @param props - コンポーネントのプロパティ
 * @param props.className - カスタムクラス名（外部レイアウト制御用）
 * @param props.title - コンポーネントの見出し（デフォルト: 'View controller'）
 * @returns ViewController のJSX要素
 */
export const ViewController: React.FC<ViewControllerProps> = ({
  className,
  title = 'View controller',
}) => {
  // カスタムフックによるロジック分離
  const { hubType, hubOptions, selectedOption, radioGroupRef, handleHubTypeChange, handleKeyDown } =
    useViewController();

  return (
    <div className={twMerge('space-y-4', className)}>
      {/* Component Title */}
      <h2 className="text-text-primary text-lg font-semibold">{title}</h2>

      {/* Hub ラジオグループ - 子コンポーネントに分離 */}
      <HubRadioGroup
        ref={radioGroupRef}
        hubOptions={hubOptions}
        selectedHub={hubType}
        onHubChange={handleHubTypeChange}
        onKeyDown={handleKeyDown}
      />

      {/* 選択されたHubの説明 - 条件分岐を最適化 */}
      {selectedOption && (
        <HubDescription
          hubType={selectedOption.value}
          label={selectedOption.label}
          description={selectedOption.description}
        />
      )}
    </div>
  );
};
