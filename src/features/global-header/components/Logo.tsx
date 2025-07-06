import React from 'react';
import Link from 'next/link';

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
    <Link
      href="/"
      className="text-header-logo font-header-logo hover:text-header-logo-hover focus-visible:ring-header-border flex-shrink-0 rounded-sm transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-transparent"
    >
      Music Theory App
    </Link>
  );
};
