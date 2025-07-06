'use client';

import clsx from 'clsx';
import React from 'react';

/**
 * MobileMenuButtonコンポーネントのProps
 */
interface MobileMenuButtonProps {
  /** メニューが開いているかどうか */
  isOpen: boolean;
  /** クリック時のハンドラー */
  onClick: () => void;
}

/**
 * モバイルメニューボタンコンポーネント
 *
 * モバイル画面（768px未満）で表示されるハンバーガーメニューボタン。
 * メニューの開閉状態に応じてアイコンが変化する。
 * クライアントコンポーネントとして実装され、クリック処理のみを担当する。
 *
 * @param props - コンポーネントのプロパティ
 * @returns MobileMenuButtonのJSX要素
 */
export const MobileMenuButton: React.FC<MobileMenuButtonProps> = ({ isOpen, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        // サイズとパディング
        'p-2',
        // カラー
        'text-header-nav-link hover:bg-header-nav-link-active-bg hover:text-header-nav-link-hover',
        // トランジション
        'transition-colors duration-150',
        // アクセシビリティ
        'focus-visible:ring-header-border focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 md:hidden',
        'rounded-sm focus-visible:ring-offset-transparent'
      )}
      aria-label={isOpen ? 'メニューを閉じる' : 'メニューを開く'}
      aria-expanded={isOpen}
      aria-controls="mobile-menu"
    >
      <svg
        className={clsx('h-6 w-6 transition-transform duration-200', isOpen && 'rotate-90')}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        {isOpen ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        )}
      </svg>
    </button>
  );
};
