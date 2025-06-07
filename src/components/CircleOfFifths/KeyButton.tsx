'use client';

import { FC } from 'react';
import { motion } from 'framer-motion';
import { KeyButtonProps } from '@/types/circleOfFifths';

const KeyButton: FC<KeyButtonProps> = ({
  key,
  isSelected,
  isHovered,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  return (
    <motion.button
      className={`
        absolute
        flex items-center justify-center
        rounded-lg
        text-white
        transition-all
        ${isSelected ? 'bg-white/15' : 'bg-white/5'}
        ${isHovered ? 'scale-110' : 'scale-100'}
      `}
      onClick={() => onClick(key)}
      onMouseEnter={() => onMouseEnter(key)}
      onMouseLeave={onMouseLeave}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {key.name}
    </motion.button>
  );
};

export default KeyButton;
