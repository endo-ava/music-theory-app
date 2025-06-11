'use client';

import { FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key } from '@/types/circleOfFifths';
import { getKeyInfo } from '../utils/index';
import { keyInfoVariants, keyInfoItemVariants } from '../animations';
import { KeyInfoDisplayProps } from '../types';

/**
 * キー情報表示コンポーネント
 *
 * ホバー中のキーに関する情報を表示します。
 * キーの名前、調性、五度圏上の位置、平行調などの情報を表示します。
 * アニメーション効果として、表示/非表示時のフェードとスケール変更を実装しています。
 */
const KeyInfoDisplay: FC<KeyInfoDisplayProps> = ({ hoveredKey }) => {
  if (!hoveredKey) return null;

  const keyInfo = getKeyInfo(hoveredKey);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={hoveredKey.name}
        variants={keyInfoVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="
          absolute bottom-[-24px] left-1/2 transform -translate-x-full translate-y-full
          bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-white/20
          z-50 transition-all duration-300
        "
      >
        {/* キー名と調性 */}
        <motion.h2 variants={keyInfoItemVariants} className="text-2xl font-bold text-white mb-4">
          {keyInfo.name}
        </motion.h2>

        {/* キーの詳細情報 */}
        <motion.div variants={keyInfoItemVariants} className="space-y-2 text-white/80">
          <p>調性: {keyInfo.scale}</p>
          {keyInfo.relativeKey && <p>平行調: {keyInfo.relativeKey}</p>}
          <motion.div variants={keyInfoItemVariants} className="mt-4 p-3 bg-white/5 rounded-md">
            <p className="text-sm text-white/60">関連するコードやスケール情報は今後追加予定です</p>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default KeyInfoDisplay;
