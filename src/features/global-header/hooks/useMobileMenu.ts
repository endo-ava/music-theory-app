'use client';

import { useState, useEffect } from 'react';

/**
 * モバイルメニュー管理のためのカスタムフック
 *
 * モバイルメニューの開閉状態とその制御ロジックを管理する。
 * Escapeキーでのメニュー閉じる機能やbody要素のスクロール制御も含む。
 *
 * なぜこのフックが必要か：
 * - 責務分離：モバイルメニューの状態管理ロジックをコンポーネントから切り離す
 * - 再利用性：他のコンポーネントでも同じロジックを使用可能
 * - テスタビリティ：独立したフックとしてテストが容易
 * - クライアントサイドの副作用を一箇所に集約
 *
 * @returns モバイルメニューの状態と制御関数
 */
export const useMobileMenu = () => {
  // モバイルメニューの開閉状態
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // メニューを閉じる関数
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // メニューを開閉する関数
  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);

  // Escapeキーでメニューを閉じる、およびbody要素のスクロール制御
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        closeMobileMenu();
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      // メニューが開いているときはbody要素のスクロールを防ぐ
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return {
    isMobileMenuOpen,
    closeMobileMenu,
    toggleMobileMenu,
  };
};
