'use client';

import React from 'react';
import { NavigationLink as NavigationLinkType } from '../types';
import { NavigationLink } from './NavigationLink';

/**
 * DesktopNavigationコンポーネントのProps
 */
interface DesktopNavigationProps {
  /** ナビゲーションリンクの配列 */
  navigationLinks: NavigationLinkType[];
  /** アクティブリンク判定関数 */
  isActiveLink: (link: NavigationLinkType) => boolean;
}

/**
 * デスクトップナビゲーションコンポーネント
 *
 * デスクトップ画面（768px以上）で表示される水平ナビゲーション。
 * NavigationLinkコンポーネントを使用してリンクを表示する。
 * クライアントコンポーネントとして実装され、インタラクティブな表示を担当する。
 *
 * @param props - コンポーネントのプロパティ
 * @returns DesktopNavigationのJSX要素
 */
export const DesktopNavigation: React.FC<DesktopNavigationProps> = ({
  navigationLinks,
  isActiveLink,
}) => {
  return (
    <nav className="hidden items-center space-x-8 md:flex lg:space-x-10">
      {navigationLinks.map(link => (
        <NavigationLink key={link.id} link={link} isActive={isActiveLink(link)} isMobile={false} />
      ))}
    </nav>
  );
};
