import React from 'react';

/**
 * CloseIconコンポーネントのProps
 */
export interface CloseIconProps {
  /** アイコンのサイズ（幅と高さ） */
  size?: number;
  /** 追加のCSSクラス */
  className?: string;
}

/**
 * 閉じるボタン用のXアイコンコンポーネント
 *
 * MobileBottomSheetとMobileMenuButtonで共通利用される統一されたCloseアイコン。
 *
 * @param props - コンポーネントのプロパティ
 * @returns CloseIconのJSX要素
 */
export const CloseIcon: React.FC<CloseIconProps> = ({ size = 24, className }) => (
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
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
