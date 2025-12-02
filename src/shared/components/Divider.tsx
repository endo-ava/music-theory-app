import React from 'react';
import { twMerge } from 'tailwind-merge';

import type { ClassNameProps } from '@/shared/types';

/**
 * 視覚的な区切り線コンポーネント
 *
 * パネルやセクション間を視覚的に分割するための水平線。
 * アクセシビリティを考慮し、スクリーンリーダーには非表示。
 *
 * @component
 * @param props - Dividerコンポーネントのプロパティ
 * @param props.className - 追加のCSSクラス名（オプション）
 * @returns 区切り線のReactコンポーネント
 *
 * @example
 * ```tsx
 * <Divider />
 * <Divider className="my-8" />
 * ```
 */
export const Divider: React.FC<ClassNameProps> = ({ className }) => (
  <div
    className={twMerge('h-px w-full bg-white/10', className)}
    aria-hidden="true"
    role="separator"
  />
);
