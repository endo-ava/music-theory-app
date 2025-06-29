'use client';

import React from 'react';
import { clsx } from 'clsx';

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
    <div className="md:hidden">
      <button
        onClick={onClick}
        className={clsx(
          // サイズとパディング
          'p-2',
          // カラー
          'text-header-nav-link hover:text-header-nav-link-hover hover:bg-header-nav-link-active-bg',
          // トランジション
          'transition-colors duration-150',
          // アクセシビリティ
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-header-border focus-visible:ring-offset-1',
          'focus-visible:ring-offset-transparent rounded-sm'
        )}
        aria-label={isOpen ? 'メニューを閉じる' : 'メニューを開く'}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
      >
        <svg
          className={clsx('w-6 h-6 transition-transform duration-200', isOpen && 'rotate-90')}
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
    </div>
  );
};
