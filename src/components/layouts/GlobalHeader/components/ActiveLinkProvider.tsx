'use client';

import React from 'react';
import { NavigationLink as NavigationLinkType } from '../types';
import { useActiveLink } from '../hooks/useActiveLink';
import { DesktopNavigation } from './DesktopNavigation';
import { MobileMenuContainer } from './MobileMenuContainer';

/**
 * ActiveLinkProviderコンポーネントのProps
 */
interface ActiveLinkProviderProps {
  /** ナビゲーションリンクの配列 */
  navigationLinks: NavigationLinkType[];
}

/**
 * アクティブリンクプロバイダーコンポーネント
 *
 * useActiveLinkフックを使用してアクティブリンクの判定を行い、
 * デスクトップナビゲーションとモバイルメニューコンテナにその情報を提供する。
 * クライアントコンポーネントとして実装され、パス判定の機能のみを担当する。
 *
 * @param props - コンポーネントのプロパティ
 * @returns ActiveLinkProviderのJSX要素
 */
export const ActiveLinkProvider: React.FC<ActiveLinkProviderProps> = ({ navigationLinks }) => {
  const { isActiveLink } = useActiveLink();

  return (
    <>
      {/* デスクトップナビゲーションエリア - 右端配置、レスポンシブ対応 */}
      <DesktopNavigation navigationLinks={navigationLinks} isActiveLink={isActiveLink} />

      {/* モバイルメニューコンテナ - ボタンとメニューを統合 */}
      <MobileMenuContainer navigationLinks={navigationLinks} isActiveLink={isActiveLink} />
    </>
  );
};
