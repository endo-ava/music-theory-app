'use client';

import { FC } from 'react';
import { motion } from 'framer-motion';
import { Key } from '@/types/circleOfFifths';

/**
 * キーボタンのProps型定義
 */
interface KeyButtonProps {
  keyData: Key; // キー情報
  isSelected: boolean; // 選択状態
  onClick: (key: Key) => void; // クリックハンドラー
  onMouseEnter: (key: Key) => void; // マウスエンターハンドラー
  onMouseLeave: () => void; // マウスリーブハンドラー
  style: React.CSSProperties; // 位置決めスタイル (absoluteの位置情報など)
}

/**
 * 五度圏上の個別のキーを表示するボタンコンポーネント
 *
 * キーの表示、ホバー効果、クリックイベントを管理します。
 * アニメーション効果として、ホバー時のスケール変更とクリック時のバウンス効果を実装しています。
 */
const KeyButton: FC<KeyButtonProps> = ({
  keyData,
  isSelected,
  onClick,
  onMouseEnter,
  onMouseLeave,
  style,
}) => {
  return (
    <motion.button
      className={`
        font-inter
        text-[1.2rem]
        text-white
        px-4
        py-2
        rounded-lg
        backdrop-blur-sm
        select-none
        focus:outline-none
        focus-visible:ring-2
        focus-visible:ring-white
        focus-visible:ring-offset-2
        focus-visible:ring-offset-gray-900
      `}
      // style propはabsoluteの位置情報などをCSS側から受け取る
      style={style} 
      
      // 初期状態のスタイル定義
      initial={{ 
        scale: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        border: 'none',
      }}
      
      // ホバー時のスタイル定義
      whileHover={{
        scale: 1.1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
        transition: { duration: 0.3, ease: 'easeInOut' },
      }}
      
      // クリック（タップ）時のスタイル定義
      whileTap={{
        scale: 0.95,
        transition: { duration: 0.1, ease: 'easeInOut' },
      }}
      
      // isSelectedプロップに基づいた動的なスタイル定義
      // isSelectedがtrueなら選択状態のスタイル、falseならデフォルト状態のスタイルにアニメーション
      animate={
        isSelected
          ? {
              scale: 1.15,
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              boxShadow: '0 6px 12px rgba(0, 0, 0, 0.4)',
              border: '2px solid #ffffff',
              transition: { duration: 0.2, ease: 'easeOut' },
            }
          : {
              scale: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.05)', // デフォルトの背景色
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', // デフォルトの影
              border: 'none', // デフォルトの境界線
              transition: { duration: 0.3, ease: 'easeInOut' },
            }
      }
      onClick={() => onClick(keyData)}
      onMouseEnter={() => onMouseEnter(keyData)}
      onMouseLeave={onMouseLeave}
      aria-label={`${keyData.name}${keyData.isMajor ? 'メジャー' : 'マイナー'}キー`}
      role="button"
      tabIndex={0}
    >
      {keyData.name}
    </motion.button>
  );
};

export default KeyButton;