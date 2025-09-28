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
 * Phase 1: 基本Tonicセレクター ✅
 * - 12音の水平ボタンリスト表示
 * - 基本クリック操作でキー変更（固定でMajorキー）
 * - currentKeyStoreとの連携
 *
 * Phase 2: Mode選択機能 🚧
 * - Major/Minor（Aeolian）の切り替え機能
 * - ドメインモデル（Key.major/minor）との連携
 *
 * @param props - コンポーネントのプロパティ
 * @returns KeyControllerのJSX要素
 */
export const KeyController: React.FC<KeyControllerProps> = ({ className, title = 'Key' }) => {
  const { currentKey, setCurrentKey } = useCurrentKeyStore();

  /**
   * 主音クリック時のハンドラー
   * Phase 2: 現在のモードを維持してトニックのみ変更
   */
  const handleTonicClick = (tonic: PitchClass) => {
    const newKey = currentKey.isMajor ? Key.major(tonic) : Key.minor(tonic);
    setCurrentKey(newKey);
  };

  /**
   * モード変更時のハンドラー
   * Phase 2: 現在のトニックを維持してモードのみ変更
   */
  const handleModeChange = (isMajor: boolean) => {
    const newKey = isMajor ? Key.major(currentKey.centerPitch) : Key.minor(currentKey.centerPitch);
    setCurrentKey(newKey);
  };

  return (
    <div className={twMerge('space-y-3', className)}>
      {/* Component Title - モバイルでは非表示、md以上で表示 */}
      <h2 className="text-foreground hidden text-lg md:block">{title}</h2>

      {/* Tonic Selector - 12音の水平ボタンリスト */}
      <div className="space-y-2">
        <h3 className="text-secondary-foreground text-sm font-medium">Tonic</h3>
        <div className="grid grid-cols-6 gap-1 sm:grid-cols-12">
          {PitchClass.ALL_PITCH_CLASSES.map(pitchClass => {
            const isSelected = currentKey.centerPitch.equals(pitchClass);
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
                aria-label={`Select ${pitchClass.sharpName} ${currentKey.isMajor ? 'major' : 'minor'} key`}
              >
                {pitchClass.sharpName}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mode Selector - Phase 2: Major/Minor切り替え */}
      <div className="space-y-2">
        <h3 className="text-secondary-foreground text-sm font-medium">Mode</h3>
        <div className="flex gap-1">
          <button
            onClick={() => handleModeChange(true)}
            className={twMerge(
              'hover:bg-accent hover:text-accent-foreground focus:ring-ring flex h-8 flex-1 items-center justify-center rounded border px-3 text-xs font-medium transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none',
              currentKey.isMajor
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-card text-card-foreground'
            )}
            aria-pressed={currentKey.isMajor}
            aria-label="Select major mode"
          >
            Major
          </button>
          <button
            onClick={() => handleModeChange(false)}
            className={twMerge(
              'hover:bg-accent hover:text-accent-foreground focus:ring-ring flex h-8 flex-1 items-center justify-center rounded border px-3 text-xs font-medium transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none',
              !currentKey.isMajor
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-card text-card-foreground'
            )}
            aria-pressed={!currentKey.isMajor}
            aria-label="Select minor mode"
          >
            Minor
          </button>
        </div>
      </div>

      {/* Current Key Display */}
      <div className="text-secondary-foreground text-xs">
        Current: <span className="font-medium">{currentKey.contextName}</span>
      </div>
    </div>
  );
};
