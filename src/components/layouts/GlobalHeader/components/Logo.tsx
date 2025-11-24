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
      className="text-secondary-foreground hover:text-foreground focus-visible:ring-border flex-shrink-0 rounded-sm text-xs font-semibold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-transparent md:text-sm"
    >
      Harmonic Orbit
    </Link>
  );
};
