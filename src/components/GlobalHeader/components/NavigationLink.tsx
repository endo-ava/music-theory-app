'use client';

import React from 'react';
import Link from 'next/link';
import { clsx } from 'clsx';
import { NavigationLink as NavigationLinkType } from '../types';

/**
 * NavigationLinkコンポーネントのProps
 */
interface NavigationLinkProps {
  /** ナビゲーションリンクの情報 */
  link: NavigationLinkType;
  /** アクティブ状態かどうか */
  isActive: boolean;
  /** クリック時のハンドラー（モバイルメニューを閉じるなど） */
  onClick?: () => void;
  /** モバイル表示用のスタイルを適用するかどうか */
  isMobile?: boolean;
}

/**
 * ナビゲーションリンクコンポーネント
 *
 * デスクトップ・モバイル両方のナビゲーションで使用される共通のリンクコンポーネント。
 * アクティブ状態に応じたスタイリングとアクセシビリティ対応を行う。
 * サーバーコンポーネントとして実装され、静的な表示のみを担当する。
 *
 * @param props - コンポーネントのプロパティ
 * @returns NavigationLinkのJSX要素
 */
export const NavigationLink: React.FC<NavigationLinkProps> = ({
  link,
  isActive,
  onClick,
  isMobile = false,
}) => {
  return (
    <Link
      key={link.id}
      href={link.href}
      onClick={onClick}
      className={clsx(
        // モバイル用の基本スタイル
        isMobile && 'block w-full text-left',
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
        // パディング - クリック領域の拡大（デスクトップとモバイルで差別化）
        isMobile ? 'px-3 py-2' : 'px-2 py-1'
      )}
      aria-current={isActive ? 'page' : undefined}
    >
      {link.label}
    </Link>
  );
};
