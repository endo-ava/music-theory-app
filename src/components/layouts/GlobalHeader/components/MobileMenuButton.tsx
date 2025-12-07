'use client';

import clsx from 'clsx';
import React from 'react';
import { CloseIcon, HamburgerIcon } from '@/components/common/icons';

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
        'text-foreground hover:bg-selected',
        // トランジション
        'transition-colors duration-150',
        // アクセシビリティ
        'focus-visible:ring-border focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 md:hidden',
        'rounded-sm focus-visible:ring-offset-transparent'
      )}
      aria-label={isOpen ? 'メニューを閉じる' : 'メニューを開く'}
      aria-expanded={isOpen}
      aria-controls="mobile-menu"
    >
      <div className="relative h-6 w-6">
        {/* HamburgerIcon */}
        <div
          className={clsx(
            'absolute inset-0 transition-all duration-200 ease-in-out',
            isOpen ? 'scale-75 rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'
          )}
        >
          <HamburgerIcon size={24} />
        </div>

        {/* CloseIcon */}
        <div
          className={clsx(
            'absolute inset-0 transition-all duration-200 ease-in-out',
            isOpen ? 'scale-100 rotate-0 opacity-100' : 'scale-75 rotate-90 opacity-0'
          )}
        >
          <CloseIcon size={24} />
        </div>
      </div>
    </button>
  );
};
