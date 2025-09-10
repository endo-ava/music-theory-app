import React from 'react';
import { twMerge } from 'tailwind-merge';
import type { PlayButtonProps } from '../../types';

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
 *
 * @returns 再生ボタンのReactコンポーネント
 *
 */
export const PlayButton: React.FC<PlayButtonProps> = ({
  children,
  onClick,
  ariaLabel,
  className,
}) => {
  return (
    <button
      className={twMerge(
        // ベーススタイル
        'rounded px-2 py-1 transition-all duration-150 ease-out',
        // ホバー（デスクトップ）
        'hover:bg-selected',
        // アクティブ（タップ時）
        'active:bg-selected active:scale-95',
        // フォーカス（キーボードナビゲーション）
        'focus-visible:ring-2 focus-visible:outline-none',
        className
      )}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
};
