import React from 'react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
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
 * GlobalHeaderコンポーネントのProps
 */
export interface GlobalHeaderProps {
  /** カスタムクラス名 */
  className?: string;
  /** カスタムスタイル */
  style?: React.CSSProperties;
}

/**
 * グローバルヘッダーコンポーネント
 *
 * アプリケーション全体で使用されるヘッダーコンポーネント。
 * ロゴエリアとナビゲーションリンク（Hub, Library, Tutorial）を含む。
 *
 * @param props - コンポーネントのプロパティ
 * @returns GlobalHeaderのJSX要素
 */
export const GlobalHeader: React.FC<GlobalHeaderProps> = ({ className, style }) => {
  return (
    <header
      className={twMerge(
        clsx(
          // 基本レイアウト - 全幅でクリーンな背景
          'w-full bg-transparent',
          // 位置設定 - モバイルメニューの絶対配置のための基準
          'relative',
          // フレックスレイアウト - ロゴ左端、ナビゲーション右端
          'flex items-center justify-between',
          // パディング - レスポンシブ対応
          'px-6 py-4 lg:px-8',
          // ボーダー - 下部に薄い境界線
          'border-b border-header-border',
          // 最小高さ - 一貫したヘッダー高さを保証
          'min-h-[4rem]'
        ),
        className
      )}
      style={style}
    >
      {/* ロゴエリア - 左端配置、Hubページへのリンク */}
      <Logo />

      {/* アクティブリンクプロバイダー - ナビゲーション要素を統合 */}
      <ActiveLinkProvider navigationLinks={navigationLinks} />
    </header>
  );
};

