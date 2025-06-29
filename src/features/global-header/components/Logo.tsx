import React from 'react';
import Link from 'next/link';
import { clsx } from 'clsx';

/**
 * ロゴコンポーネント
 *
 * アプリケーションのブランドロゴを表示し、ホームページへのリンクとして機能する。
 * サーバーコンポーネントとして実装され、静的な表示のみを担当する。
 *
 * @returns ロゴのJSX要素
 */
export const Logo: React.FC = () => {
  return (
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
  );
};
