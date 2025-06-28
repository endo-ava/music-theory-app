'use client';

import { FC } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getKeyInfo } from '../utils/dataOperations';
import { keyInfoVariants, keyInfoItemVariants } from '../animations';
import { useCircleOfFifthsStore } from '@/store/circleOfFifthsStore';

/**
 * キー情報表示コンポーネント
 *
 * ホバー中のキーに関する情報を表示します。
 * キーの名前、調性、五度圏上の位置、平行調などの情報を表示します。
 * アニメーション効果として、表示/非表示時のフェードとスケール変更を実装しています。
 */
const KeyInfoDisplay: FC = () => {
  const selectedKey = useCircleOfFifthsStore(state => state.selectedKey);
  if (!selectedKey) return null;

  const keyInfo = getKeyInfo(selectedKey);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={selectedKey.name}
        variants={keyInfoVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="
          absolute bottom-[-24px] left-1/2 transform -translate-x-full translate-y-full
          bg-key-area-minor backdrop-blur-sm rounded-lg p-6 shadow-lg border border-border
          z-50 transition-all duration-300
        "
      >
        {/* キー名と調性 */}
        <motion.h2
          variants={keyInfoItemVariants}
          className="text-2xl font-bold text-text-primary mb-4"
        >
          {keyInfo.name}
        </motion.h2>

        {/* キーの詳細情報 */}
        <motion.div variants={keyInfoItemVariants} className="space-y-2 text-text-secondary">
          <p>調性: {keyInfo.scale}</p>
          {keyInfo.relativeKey && <p>平行調: {keyInfo.relativeKey}</p>}
          <motion.div
            variants={keyInfoItemVariants}
            className="mt-4 p-3 bg-background-muted rounded-md"
          >
            <p className="text-sm text-text-muted">
              関連するコードやスケール情報は今後追加予定です
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default KeyInfoDisplay;
