import React from 'react';

/**
 * HamburgerIconコンポーネントのProps
 */
export interface HamburgerIconProps {
  /** アイコンのサイズ（幅と高さ） */
  size?: number;
  /** 追加のCSSクラス */
  className?: string;
}

/**
 * ハンバーガーメニュー用の三本線アイコンコンポーネント
 *
 * MobileMenuButtonで使用される統一されたHamburgerアイコン。
 *
 * @param props - コンポーネントのプロパティ
 * @returns HamburgerIconのJSX要素
 */
export const HamburgerIcon: React.FC<HamburgerIconProps> = ({ size = 24, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <line x1="4" y1="6" x2="20" y2="6" />
    <line x1="4" y1="12" x2="20" y2="12" />
    <line x1="4" y1="18" x2="20" y2="18" />
  </svg>
);
