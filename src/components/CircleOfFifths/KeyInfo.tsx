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
          className="key-info p-4 rounded-lg bg-white/5 text-white min-w-[200px]"
        >
          <h3 className="text-xl font-bold mb-2">
            {selectedKey.name} {selectedKey.isMajor ? 'メジャー' : 'マイナー'}
          </h3>
          <div className="text-sm text-gray-300">
            <p>五度圏上の位置: {selectedKey.position + 1}</p>
            {/* 追加のキー情報は後ほど実装 */}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default KeyInfo;
