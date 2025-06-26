'use client';

import React from 'react';
import { NavigationLink as NavigationLinkType } from '../types';
import { useMobileMenu } from '../hooks/useMobileMenu';
import { MobileMenuButton } from './MobileMenuButton';
import { MobileMenu } from './MobileMenu';

/**
 * MobileMenuContainerコンポーネントのProps
 */
interface MobileMenuContainerProps {
  /** ナビゲーションリンクの配列 */
  navigationLinks: NavigationLinkType[];
  /** アクティブリンク判定関数 */
  isActiveLink: (link: NavigationLinkType) => boolean;
}

/**
 * モバイルメニューコンテナコンポーネント
 *
 * MobileMenuButtonとMobileMenuを統合し、useMobileMenuフックを使用して
 * モバイルメニューの状態管理を行う。クライアントコンポーネントとして実装され、
 * インタラクティブな機能を最小限に集約する。
 *
 * @param props - コンポーネントのプロパティ
 * @returns MobileMenuContainerのJSX要素
 */
export const MobileMenuContainer: React.FC<MobileMenuContainerProps> = ({
  navigationLinks,
  isActiveLink,
}) => {
  const { isMobileMenuOpen, closeMobileMenu, toggleMobileMenu } = useMobileMenu();

  return (
    <>
      <MobileMenuButton isOpen={isMobileMenuOpen} onClick={toggleMobileMenu} />
      <MobileMenu
        isOpen={isMobileMenuOpen}
        navigationLinks={navigationLinks}
        isActiveLink={isActiveLink}
        onClose={closeMobileMenu}
      />
    </>
  );
};
