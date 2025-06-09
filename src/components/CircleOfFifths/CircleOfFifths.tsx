'use client';

import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { useCircleOfFifthsStore } from '@/store/circleOfFifthsStore';
import KeyButton from './KeyButton';
import KeyInfoDisplay from './KeyInfoDisplay';
import { KEYS } from './constants';
import { calculateKeyPosition } from './utils';
import { circleVariants } from './animations';
import { STYLES, Key } from '@/types/circleOfFifths';
import './styles/circleOfFifths.css';

/**
 * 五度圏表示コンポーネント
 *
 * 五度圏を円形に表示し、各キーのホバー時に情報を表示します。
 * キーの配置は円周上に均等に配置され、メジャーキーは外側、マイナーキーは内側に表示されます。
 */
export const CircleOfFifths = () => {
  const { selectedKey, hoveredKey, setSelectedKey, setHoveredKey } = useCircleOfFifthsStore();

  // キークリック時のハンドラー
  const handleKeyClick = useCallback(
    (key: Key) => {
      setSelectedKey(key);
    },
    [setSelectedKey]
  );

  // キーホバー時のハンドラー
  const handleKeyHover = useCallback(
    (key: Key) => {
      setHoveredKey(key);
    },
    [setHoveredKey]
  );

  // キーからマウスが離れた時のハンドラー
  const handleKeyLeave = useCallback(() => {
    setHoveredKey(null);
  }, [setHoveredKey]);

  return (
    <motion.div
      className="circle-of-fifths"
      style={{
        width: STYLES.CIRCLE.WIDTH,
        maxWidth: STYLES.CIRCLE.MAX_WIDTH,
        background: `linear-gradient(135deg, ${STYLES.CIRCLE.BACKGROUND.FROM}, ${STYLES.CIRCLE.BACKGROUND.TO})`,
        overflow: 'visible',
      }}
      variants={circleVariants}
      initial="hidden"
      animate="visible"
    >
      {/* キーボタンの配置エリア */}
      <div className="circle">
        {KEYS.map(keyData => {
          const position = calculateKeyPosition(keyData);
          return (
            <KeyButton
              key={keyData.name}
              keyData={keyData}
              isSelected={selectedKey?.name === keyData.name}
              onClick={handleKeyClick}
              onMouseEnter={handleKeyHover}
              onMouseLeave={handleKeyLeave}
              style={{
                position: 'absolute',
                left: `calc(50% + ${position.x}px)`,
                top: `calc(50% + ${position.y}px)`,
                transform: 'translate(-50%, -50%)',
                width: `${STYLES.KEY_BUTTON.WIDTH}px`,
                height: `${STYLES.KEY_BUTTON.HEIGHT}px`,
              }}
            />
          );
        })}
      </div>

      {/* キー情報表示エリア */}
      <KeyInfoDisplay hoveredKey={hoveredKey} />
    </motion.div>
  );
};
