'use client';

import React from 'react';
import { motion } from 'motion/react';
import { CloseIcon, HandleIcon } from '@/shared/components/icons';

/**
 * BottomSheetHeaderコンポーネントのProps
 */
export interface BottomSheetHeaderProps {
  /**
   * シートの状態を切り替える関数
   */
  onToggle: () => void;
  /**
   * シートを閉じる関数
   */
  onClose: () => void;
}

/**
 * BottomSheetHeaderコンポーネント
 *
 * ボトムシートのヘッダー部分（ハンドルアイコン + クローズボタン）を表示する。
 * タップでトグル操作、クローズボタンでシートを閉じる機能を提供。
 *
 * @param props - コンポーネントのプロパティ
 * @returns BottomSheetHeaderのJSX要素
 */
export const BottomSheetHeader: React.FC<BottomSheetHeaderProps> = ({ onToggle, onClose }) => {
  return (
    <div className="relative">
      {/* Trigger Area (tap to toggle) - Full width except close button */}
      <motion.button
        className="flex w-full cursor-pointer items-center justify-center py-4"
        onClick={onToggle}
        whileTap={{ scale: 0.98 }}
        aria-label="ボトムシートを開く"
        tabIndex={0}
      >
        <HandleIcon />
      </motion.button>

      {/* Close Button - Absolute positioned */}
      <button
        onClick={onClose}
        className="text-text-secondary hover:text-text-primary absolute top-3 right-6 rounded-md transition-colors"
        aria-label="ボトムシートを閉じる"
        tabIndex={0}
      >
        <CloseIcon />
      </button>
    </div>
  );
};
