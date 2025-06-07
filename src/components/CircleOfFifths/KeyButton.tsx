'use client';

import { FC } from 'react';
import { motion } from 'framer-motion';
import { Key } from '@/types/circleOfFifths';

interface KeyButtonProps {
  keyData: Key;
  isSelected: boolean;
  isHovered: boolean;
  onClick: (key: Key) => void;
  onMouseEnter: (key: Key) => void;
  onMouseLeave: () => void;
  style?: React.CSSProperties;
}

const KeyButton: FC<KeyButtonProps> = ({
  keyData,
  isSelected,
  isHovered,
  onClick,
  onMouseEnter,
  onMouseLeave,
  style,
}) => {
  return (
    <motion.button
      className={`
        key-button
        flex items-center justify-center
        w-12 h-12
        rounded-lg
        text-white
        transition-all
        ${isSelected ? 'active' : ''}
      `}
      onClick={() => onClick(keyData)}
      onMouseEnter={() => onMouseEnter(keyData)}
      onMouseLeave={onMouseLeave}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      style={style}
      aria-label={`${keyData.name} ${keyData.isMajor ? 'メジャー' : 'マイナー'}`}
    >
      {keyData.name}
    </motion.button>
  );
};

export default KeyButton;
