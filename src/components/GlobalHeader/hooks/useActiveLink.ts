'use client';

import { usePathname } from 'next/navigation';
import { NavigationLink } from '../types';

/**
 * アクティブリンク判定のためのカスタムフック
 * 
 * Next.js 15のusePathnameフックを使用して現在のパスを取得し、
 * ナビゲーションリンクのアクティブ状態を判定する。
 * 
 * なぜこのフックが必要か：
 * - 責務分離：アクティブ状態の判定ロジックをコンポーネントから切り離す
 * - 再利用性：他のコンポーネントでも同じロジックを使用可能
 * - テスタビリティ：独立したフックとしてテストが容易
 * 
 * @returns アクティブリンク判定関数
 */
export const useActiveLink = () => {
  const pathname = usePathname();

  /**
   * 指定されたリンクがアクティブかどうかを判定
   * 
   * @param link - 判定対象のナビゲーションリンク
   * @returns アクティブ状態かどうか
   */
  const isActiveLink = (link: NavigationLink): boolean => {
    // ルートパス（Hub）の特別な処理
    if (link.href === '/' && pathname === '/') {
      return true;
    }
    
    // その他のパスは完全一致で判定
    // 将来的にサブパスも考慮する場合は pathname.startsWith(link.href) を使用
    if (link.href !== '/' && pathname === link.href) {
      return true;
    }
    
    return false;
  };

  return { isActiveLink };
};