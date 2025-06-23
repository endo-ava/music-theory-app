import React from 'react';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
import { GlobalHeaderProps, NavigationLink } from './types';

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
 * @param props - コンポーネントのプロパティ
 * @returns GlobalHeaderのJSX要素
 */
export const GlobalHeader: React.FC<GlobalHeaderProps> = ({
  className,
  style,
}) => {
  return (
    <header
      className={twMerge(
        clsx(
          // 基本レイアウト - 全幅でクリーンな背景
          'w-full bg-transparent',
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
      <div className="flex-shrink-0">
        <Link 
          href="/" 
          className={clsx(
            // フォントスタイリング - ブランドロゴとして視認性重視
            'text-header-logo font-header-logo',
            // カラー - ベース色とホバー時の変化
            'text-header-logo hover:text-header-logo-hover',
            // トランジション - スムーズな色変化
            'transition-colors duration-200',
            // アクセシビリティ - フォーカス状態の視覚化
            'focus:outline-none focus:ring-2 focus:ring-header-border focus:ring-offset-2',
            'focus:ring-offset-transparent rounded-sm'
          )}
        >
          Music Theory App
        </Link>
      </div>

      {/* ナビゲーションエリア - 右端配置、レスポンシブ対応 */}
      <nav className={clsx(
        // デスクトップレイアウト - 水平方向に配置
        'hidden md:flex items-center space-x-8 lg:space-x-10'
      )}>
        {navigationLinks.map((link) => (
          <Link
            key={link.id}
            href={link.href}
            className={clsx(
              // フォントスタイリング - 統一感のある読みやすさ
              'text-header-nav font-header-nav',
              // カラー - 通常時とホバー時の明確な差別化
              'text-header-nav-link hover:text-header-nav-link-hover',
              // トランジション - スムーズなインタラクション
              'transition-colors duration-200',
              // アクセシビリティ - キーボードナビゲーション対応
              'focus:outline-none focus:ring-2 focus:ring-header-border focus:ring-offset-2',
              'focus:ring-offset-transparent rounded-sm',
              // パディング - クリック領域の拡大
              'px-2 py-1'
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* モバイルメニューボタン - 768px以下で表示 */}
      <div className="md:hidden">
        <button
          className={clsx(
            // サイズとパディング
            'p-2',
            // カラー
            'text-header-nav-link hover:text-header-nav-link-hover',
            // トランジション
            'transition-colors duration-200',
            // アクセシビリティ
            'focus:outline-none focus:ring-2 focus:ring-header-border focus:ring-offset-2',
            'focus:ring-offset-transparent rounded-sm'
          )}
          aria-label="メニューを開く"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  );
};

// 型のエクスポート
export type { GlobalHeaderProps, NavigationLink } from './types';
