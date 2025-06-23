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
          // 基本レイアウト
          'w-full bg-transparent',
          // 内部配置
          'flex items-center justify-between',
          // パディング
          'px-6 py-4',
          // ボーダー
          'border-b border-border'
        ),
        className
      )}
      style={style}
    >
      {/* ロゴエリア */}
      <div className="flex-shrink-0">
        <Link 
          href="/" 
          className={clsx(
            // テキストスタイル
            'text-title font-medium',
            // ホバー効果
            'transition-colors duration-200',
            'hover:text-text-secondary',
            // フォーカス効果
            'focus:outline-none focus:ring-2 focus:ring-border focus:ring-offset-2',
            'focus:ring-offset-transparent'
          )}
        >
          Music Theory App
        </Link>
      </div>

      {/* ナビゲーションエリア */}
      <nav className="flex items-center space-x-8">
        {navigationLinks.map((link) => (
          <Link
            key={link.id}
            href={link.href}
            className={clsx(
              // テキストスタイル
              'text-text-primary font-medium',
              // ホバー効果
              'transition-colors duration-200',
              'hover:text-text-secondary',
              // フォーカス効果
              'focus:outline-none focus:ring-2 focus:ring-border focus:ring-offset-2',
              'focus:ring-offset-transparent'
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
};