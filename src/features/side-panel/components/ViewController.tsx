'use client';

import { twMerge } from 'tailwind-merge';
import { useHubStore } from '@/stores/hubStore';
import { getHubOptions } from '@/shared/constants/hubs';
import type { HubType } from '@/shared/types';
import type { ViewControllerProps } from '../types';

/**
 * View Controller (C-1) コンポーネント
 *
 * Canvasに描画するHub（五度圏 vs クロマチック）を切り替える。
 * 音楽を分析するための「世界観（レンズ）」を選択するコントロール。
 *
 * @param props - コンポーネントのプロパティ
 * @returns ViewController のJSX要素
 */
export const ViewController: React.FC<ViewControllerProps> = ({
  className,
  title = 'View controller',
}) => {
  const { hubType, setHubType } = useHubStore();

  const handleHubTypeChange = (newHubType: HubType) => {
    setHubType(newHubType);
  };

  const hubOptions = getHubOptions();

  return (
    <div className={twMerge('space-y-4', className)}>
      {/* Component Title */}
      <h2 className="text-text-primary text-lg font-semibold">{title}</h2>

      <div
        className="bg-background-muted grid grid-cols-2 gap-2 rounded-md p-1"
        role="radiogroup"
        aria-label="Hub種類の選択"
      >
        {hubOptions.map(option => (
          <button
            key={option.value}
            onClick={() => handleHubTypeChange(option.value)}
            className={twMerge(
              'rounded px-3 py-2 text-sm font-medium transition-all duration-200',
              'focus:ring-text-primary focus:ring-2 focus:ring-offset-1 focus:ring-offset-transparent focus:outline-none',
              hubType === option.value
                ? 'bg-key-area-selected text-text-primary border-border border shadow-sm'
                : 'text-text-secondary hover:bg-key-area-hover hover:text-text-primary'
            )}
            role="radio"
            aria-checked={hubType === option.value}
            aria-describedby={`${option.value}-description`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* 選択されたHubの説明 */}
      {hubOptions.map(
        option =>
          hubType === option.value && (
            <p
              key={option.value}
              id={`${option.value}-description`}
              className="text-text-muted text-sm"
            >
              <span>{option.label}:</span> {option.description}
            </p>
          )
      )}
    </div>
  );
};
