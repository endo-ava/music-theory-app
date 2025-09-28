'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';
import type { ClassNameProps } from '@/shared/types';
import { PitchClass } from '@/domain/common';
import { useCurrentKeyStore } from '@/stores/currentKeyStore';
import { Key } from '@/domain/key';

/**
 * KeyControllerコンポーネントのProps
 */
export interface KeyControllerProps extends ClassNameProps {
  /** コンポーネントのタイトル */
  title?: string;
}

/**
 * Key Controller (C-2) コンポーネント
 *
 * アプリケーションの音楽的文脈（キー/モード）を設定する。
 * Tonic（主音）とMode（旋法）を、素早くかつ直感的に選択するためのインターフェースを提供。
 *
 * Phase 1: 基本Tonicセレクター
 * - 12音の水平ボタンリスト表示
 * - 基本クリック操作でキー変更（固定でMajorキー）
 * - currentKeyStoreとの連携
 *
 * @param props - コンポーネントのプロパティ
 * @returns KeyControllerのJSX要素
 */
export const KeyController: React.FC<KeyControllerProps> = ({ className, title = 'Key' }) => {
  const { currentKey, setCurrentKey } = useCurrentKeyStore();

  /**
   * 主音クリック時のハンドラー
   * Phase 1では固定でMajorキーを生成
   */
  const handleTonicClick = (tonic: PitchClass) => {
    const newKey = Key.major(tonic);
    setCurrentKey(newKey);
  };

  return (
    <div className={twMerge('space-y-2', className)}>
      {/* Component Title - モバイルでは非表示、md以上で表示 */}
      <h2 className="text-foreground hidden text-lg md:block">{title}</h2>

      {/* Tonic Selector - 12音の水平ボタンリスト */}
      <div className="space-y-2">
        <h3 className="text-secondary-foreground text-sm font-medium">Tonic</h3>
        <div className="grid grid-cols-6 gap-1 sm:grid-cols-12">
          {PitchClass.ALL_PITCH_CLASSES.map(pitchClass => {
            const isSelected = currentKey.centerPitch.equals(pitchClass) && currentKey.isMajor;
            return (
              <button
                key={pitchClass.sharpName}
                onClick={() => handleTonicClick(pitchClass)}
                className={twMerge(
                  'hover:bg-accent hover:text-accent-foreground focus:ring-ring flex h-8 min-w-0 items-center justify-center rounded border px-2 text-xs font-medium transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none',
                  isSelected
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-card text-card-foreground'
                )}
                aria-pressed={isSelected}
                aria-label={`Select ${pitchClass.sharpName} major key`}
              >
                {pitchClass.sharpName}
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Key Display */}
      <div className="text-secondary-foreground text-xs">
        Current: <span className="font-medium">{currentKey.contextName}</span>
      </div>
    </div>
  );
};
