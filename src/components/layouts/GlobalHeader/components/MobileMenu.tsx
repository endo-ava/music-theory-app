'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NavigationLink as NavigationLinkType } from '../types';
import { NavigationLink } from './NavigationLink';

/**
 * MobileMenuコンポーネントのProps
 */
interface MobileMenuProps {
  /** メニューが開いているかどうか */
  isOpen: boolean;
  /** ナビゲーションリンクの配列 */
  navigationLinks: NavigationLinkType[];
  /** アクティブリンク判定関数 */
  isActiveLink: (link: NavigationLinkType) => boolean;
  /** メニューを閉じる関数 */
  onClose: () => void;
}

/**
 * モバイルメニューコンポーネント
 *
 * モバイル画面（768px未満）で表示されるドロップダウンメニュー。
 * Framer Motionを使用したスムーズなアニメーションと、
 * NavigationLinkコンポーネントを使用したリンク表示を行う。
 * クライアントコンポーネントとして実装され、アニメーション処理を担当する。
 *
 * @param props - コンポーネントのプロパティ
 * @returns MobileMenuのJSX要素
 */
export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  navigationLinks,
  isActiveLink,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.nav
          id="mobile-menu"
          role="navigation"
          aria-label="モバイルメニュー"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="bg-bg-from border-border absolute top-full right-0 left-0 z-50 border-t shadow-lg backdrop-blur-sm md:hidden"
        >
          <div className="space-y-2 px-6 py-4">
            {navigationLinks.map(link => (
              <NavigationLink
                key={link.id}
                link={link}
                isActive={isActiveLink(link)}
                onClick={onClose}
                isMobile={true}
              />
            ))}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};
