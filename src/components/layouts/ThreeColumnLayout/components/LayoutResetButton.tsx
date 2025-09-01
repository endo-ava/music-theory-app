'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';
import { RotateCcw } from 'lucide-react';

import { useLayoutStore } from '@/stores/layoutStore';
import { ClassNameProps } from '@/shared/types';

interface LayoutResetButtonProps extends ClassNameProps {
  /** ボタンの表示位置 */
  position?: 'top-right' | 'bottom-right' | 'floating';
}

/**
 * レイアウトリセットボタン
 *
 * パネルレイアウトをデフォルト状態に戻すための
 * フローティングボタン
 */
export const LayoutResetButton: React.FC<LayoutResetButtonProps> = ({
  className,
  position = 'top-right',
}) => {
  const { showResetButton, resetPanelLayout, setShowResetButton } = useLayoutStore();

  if (!showResetButton) return null;

  const handleReset = () => {
    if (window.confirm('パネルレイアウトをデフォルトに戻しますか？')) {
      resetPanelLayout();
    }
  };

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'bottom-right': 'bottom-4 right-4',
    floating: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  };

  return (
    <div className={twMerge('fixed z-50', positionClasses[position], className)}>
      <button
        onClick={handleReset}
        className={twMerge(
          // 基本スタイル
          'flex items-center gap-2 px-3 py-2',
          'bg-card border-border rounded-lg border shadow-lg',
          'text-foreground text-sm font-medium',

          // ホバー・フォーカス効果
          'hover:bg-accent hover:text-accent-foreground',
          'focus:ring-primary focus:ring-2 focus:ring-offset-2 focus:outline-none',

          // トランジション
          'transition-all duration-200',

          // バックドロップ効果
          'backdrop-blur-sm',

          // アニメーション
          'animate-in fade-in-0 zoom-in-95 duration-200'
        )}
        aria-label="パネルレイアウトをデフォルトに戻す"
        title="パネルレイアウトをデフォルトに戻す"
      >
        <RotateCcw className="h-4 w-4" />
        <span>リセット</span>
      </button>

      {/* 閉じるボタン */}
      <button
        onClick={() => setShowResetButton(false)}
        className={twMerge(
          'absolute -top-2 -right-2',
          'h-6 w-6 rounded-full',
          'bg-muted border-border border',
          'text-muted-foreground hover:text-foreground',
          'text-xs font-bold',
          'hover:bg-accent',
          'transition-colors duration-200',
          'focus:ring-primary focus:ring-2 focus:ring-offset-2 focus:outline-none'
        )}
        aria-label="リセットボタンを閉じる"
        title="リセットボタンを閉じる"
      >
        ×
      </button>
    </div>
  );
};
