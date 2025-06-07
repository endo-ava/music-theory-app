'use client';

import { FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyInfoProps } from '@/types/circleOfFifths';

const KeyInfo: FC<KeyInfoProps> = ({ selectedKey }) => {
  return (
    <AnimatePresence>
      {selectedKey && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="p-4 rounded-lg bg-white/5 text-white"
        >
          <h3 className="text-xl font-bold">
            {selectedKey.name} {selectedKey.isMajor ? 'メジャー' : 'マイナー'}
          </h3>
          {/* 追加のキー情報は後ほど実装 */}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default KeyInfo;
