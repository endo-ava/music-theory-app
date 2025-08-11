import React from 'react';

/**
 * HandleIconコンポーネントのProps
 */
export interface HandleIconProps {
  /** アイコンの幅 */
  width?: number;
  /** アイコンの高さ */
  height?: number;
  /** 追加のCSSクラス */
  className?: string;
}

/**
 * ボトムシートのハンドル（取っ手）アイコンコンポーネント
 *
 * MobileBottomSheetのドラッグ用ハンドルとして使用される。
 * 横長の角丸矩形でドラッグ可能であることを視覚的に示す。
 *
 * @param props - コンポーネントのプロパティ
 * @returns HandleIconのJSX要素
 */
export const HandleIcon: React.FC<HandleIconProps> = ({
  width = 32,
  height = 6,
  className = 'text-foreground',
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 32 6"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <rect x="8" y="2" width="16" height="2" rx="1" fill="currentColor" />
  </svg>
);
