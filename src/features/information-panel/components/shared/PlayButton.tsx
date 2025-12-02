import React from 'react';
import { twMerge } from 'tailwind-merge';
import type { PlayButtonProps } from '../../types';

/**
 * PlayButtonのバリアントスタイル定数
 */
const PLAY_BUTTON_VARIANTS = {
  header:
    'text-xl font-bold text-primary hover:text-primary/80 active:scale-95 hover:bg-selected active:bg-selected',
  cell: 'w-full py-2 hover:bg-primary/10 hover:text-primary text-foreground font-medium active:bg-primary/20',
} as const;

/**
 * 統一された再生ボタンコンポーネント
 *
 * information-panel全体で使用される音声再生ボタンの標準化されたUI。
 * 一貫したスタイリング、アクセシビリティサポート、ホバーエフェクトを提供し、
 * ユーザビリティとデザインシステムの統一性を保つ。
 *
 * @component
 * @param props - PlayButtonコンポーネントのプロパティ
 * @param props.children - ボタン内に表示されるコンテンツ（コード名、音符名など）
 * @param props.onClick - ボタンがクリックされた時のハンドラー関数
 * @param props.ariaLabel - アクセシビリティ用のラベル（スクリーンリーダー対応）
 * @param props.className - 追加のCSSクラス名（オプション）
 * @param props.variant - ボタンのバリアント（'header' | 'cell'）
 *
 * @returns 再生ボタンのReactコンポーネント
 *
 */
export const PlayButton: React.FC<PlayButtonProps> = ({
  children,
  onClick,
  ariaLabel,
  className,
  variant,
}) => {
  return (
    <button
      className={twMerge(
        // ベーススタイル
        'rounded px-2 py-1 transition-all duration-150 ease-out',
        // フォーカス（キーボードナビゲーション）
        'focus-visible:ring-2 focus-visible:outline-none',
        // バリアントスタイル
        PLAY_BUTTON_VARIANTS[variant],
        className
      )}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
};
