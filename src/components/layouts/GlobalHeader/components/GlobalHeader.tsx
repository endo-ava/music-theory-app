import React from 'react';
import { NavigationLink } from '../types';
import { Logo } from './Logo';
import { ActiveLinkProvider } from './ActiveLinkProvider';

/**
 * ナビゲーションリンクの定義
 */
const navigationLinks: NavigationLink[] = [
  { id: 'circle', label: 'Circle', href: '/' },
  { id: 'atlas', label: 'Atlas', href: '/atlas' },
  { id: 'about', label: 'About', href: '/about' },
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
    <header className="border-border bg-background relative flex min-h-[var(--header-height-min)] w-full items-center border-b px-6 md:py-4">
      {/* ロゴエリア - 左端配置、Hubページへのリンク */}
      <div className="flex-1">
        <Logo />
      </div>

      {/* アクティブリンクプロバイダー - モバイル：右端、デスクトップ：中央配置 */}
      <div className="md:flex md:flex-1 md:justify-center">
        <ActiveLinkProvider navigationLinks={navigationLinks} />
      </div>

      {/* 右側の空白エリア - デスクトップでのレイアウトバランス用 */}
      <div className="hidden md:block md:flex-1"></div>
    </header>
  );
};
