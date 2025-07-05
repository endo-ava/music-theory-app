import React from 'react';
import { NavigationLink } from '../types';
import { Logo } from './Logo';
import { ActiveLinkProvider } from './ActiveLinkProvider';

/**
 * ナビゲーションリンクの定義
 */
const navigationLinks: NavigationLink[] = [
  { id: 'hub', label: 'Hub', href: '/' },
  { id: 'library', label: 'Library', href: '/library' },
  { id: 'tutorial', label: 'Tutorial', href: '/tutorial' },
];

/**
 * グローバルヘッダーコンポーネント
 *
 * アプリケーション全体で使用されるヘッダーコンポーネント。
 * ロゴエリアとナビゲーションリンク（Hub, Library, Tutorial）を含む。
 *
 * @returns GlobalHeaderのJSX要素
 */
export const GlobalHeader: React.FC = () => {
  return (
    <header className="w-full bg-transparent relative flex items-center justify-between px-6 py-4 lg:px-8 border-b border-header-border min-h-[4rem]">
      {/* ロゴエリア - 左端配置、Hubページへのリンク */}
      <Logo />

      {/* アクティブリンクプロバイダー - ナビゲーション要素を統合 */}
      <ActiveLinkProvider navigationLinks={navigationLinks} />
    </header>
  );
};
