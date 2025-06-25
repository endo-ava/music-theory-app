'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'motion/react';
import { GlobalHeaderProps, NavigationLink } from './types';
import { useActiveLink } from './hooks/useActiveLink';

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
export const GlobalHeader: React.FC<GlobalHeaderProps> = ({ className, style }) => {
  // アクティブリンク判定フック
  const { isActiveLink } = useActiveLink();

  // モバイルメニューの開閉状態
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // メニューを閉じる関数
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // メニューを開閉する関数
  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);

  // Escapeキーでメニューを閉じる
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        closeMobileMenu();
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      // メニューが開いているときはbody要素のスクロールを防ぐ
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);
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
            // アクセシビリティ - フォーカス状態の視覚化（控えめに）
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-header-border focus-visible:ring-offset-1',
            'focus-visible:ring-offset-transparent rounded-sm'
          )}
        >
          Music Theory App
        </Link>
      </div>

      {/* ナビゲーションエリア - 右端配置、レスポンシブ対応 */}
      <nav
        className={clsx(
          // デスクトップレイアウト - 水平方向に配置
          'hidden md:flex items-center space-x-8 lg:space-x-10'
        )}
      >
        {navigationLinks.map(link => {
          const isActive = isActiveLink(link);

          return (
            <Link
              key={link.id}
              href={link.href}
              className={clsx(
                // フォントスタイリング - 統一感のある読みやすさ
                'text-header-nav font-header-nav',
                // カラー - アクティブ状態に応じた色分け
                isActive
                  ? 'text-header-nav-link-active bg-header-nav-link-active-bg'
                  : 'text-header-nav-link hover:text-header-nav-link-hover hover:bg-header-nav-link-active-bg',
                // トランジション - スムーズなインタラクション
                'transition-colors duration-200',
                // アクセシビリティ - キーボードナビゲーション対応（視覚的に控えめに）
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-header-border focus-visible:ring-offset-1',
                'focus-visible:ring-offset-transparent rounded-sm',
                // パディング - クリック領域の拡大
                'px-2 py-1'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* モバイルメニューボタン - 768px以下で表示 */}
      <div className="md:hidden">
        <button
          onClick={toggleMobileMenu}
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
          aria-label={isMobileMenuOpen ? 'メニューを閉じる' : 'メニューを開く'}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
        >
          <svg
            className={clsx(
              'w-6 h-6 transition-transform duration-200',
              isMobileMenuOpen && 'rotate-90'
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMobileMenuOpen ? (
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

      {/* モバイルメニュー - アニメーション付きドロップダウン */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.nav
            id="mobile-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={clsx(
              // 絶対配置 - ヘッダーの下に配置
              'absolute top-full left-0 right-0 z-50',
              // 背景 - セミトランスペアレントな背景
              'bg-header-bg backdrop-blur-sm',
              // ボーダー
              'border-t border-header-border',
              // モバイルのみ表示
              'md:hidden',
              // シャドウ
              'shadow-lg'
            )}
          >
            <div className="px-6 py-4 space-y-2">
              {navigationLinks.map(link => {
                const isActive = isActiveLink(link);

                return (
                  <Link
                    key={link.id}
                    href={link.href}
                    onClick={closeMobileMenu}
                    className={clsx(
                      // ブロック要素として表示
                      'block w-full text-left',
                      // フォントスタイリング
                      'text-header-nav font-header-nav',
                      // カラー - アクティブ状態に応じた色分け
                      isActive
                        ? 'text-header-nav-link-active bg-header-nav-link-active-bg'
                        : 'text-header-nav-link hover:text-header-nav-link-hover hover:bg-header-nav-link-active-bg',
                      // トランジション
                      'transition-colors duration-200',
                      // アクセシビリティ
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-header-border focus-visible:ring-offset-1',
                      'focus-visible:ring-offset-transparent rounded-sm',
                      // パディング
                      'px-3 py-2 rounded-sm'
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

// 型のエクスポート
export type { GlobalHeaderProps, NavigationLink } from './types';
