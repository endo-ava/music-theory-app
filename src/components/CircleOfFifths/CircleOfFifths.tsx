'use client';

import { FC, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useCircleOfFifthsStore } from '@/store/circleOfFifthsStore';
import KeyButton from './KeyButton';
import KeyInfo from './KeyInfo';
import { Key } from '@/types/circleOfFifths';
import '@/components/CircleOfFifths/styles/circleOfFifths.css';

// 五度圏のキー定義
const keys: Key[] = [
  { name: 'C', isMajor: true, position: 0 },
  { name: 'G', isMajor: true, position: 1 },
  { name: 'D', isMajor: true, position: 2 },
  { name: 'A', isMajor: true, position: 3 },
  { name: 'E', isMajor: true, position: 4 },
  { name: 'B', isMajor: true, position: 5 },
  { name: 'F#', isMajor: true, position: 6 },
  { name: 'C#', isMajor: true, position: 7 },
  { name: 'G#', isMajor: true, position: 8 },
  { name: 'D#', isMajor: true, position: 9 },
  { name: 'A#', isMajor: true, position: 10 },
  { name: 'F', isMajor: true, position: 11 },
];

const CircleOfFifths: FC = () => {
  const { state, setSelectedKey, setHoveredKey } = useCircleOfFifthsStore();

  // メモ化されたコールバック関数
  const handleKeyClick = useCallback(
    (key: Key) => {
      setSelectedKey(key);
    },
    [setSelectedKey]
  );

  const handleKeyHover = useCallback(
    (key: Key) => {
      setHoveredKey(key);
    },
    [setHoveredKey]
  );

  const handleKeyLeave = useCallback(() => {
    setHoveredKey(null);
  }, [setHoveredKey]);

  // キーの位置を計算する関数
  const calculateKeyPosition = (position: number, totalKeys: number) => {
    const angle = (position * 2 * Math.PI) / totalKeys - Math.PI / 2;
    const radius = 40; // 円の半径（%）
    return {
      left: `${50 + radius * Math.cos(angle)}%`,
      top: `${50 + radius * Math.sin(angle)}%`,
    };
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-[70%] max-w-[800px] aspect-square circle-of-fifths"
      >
        {keys.map(keyData => {
          const position = calculateKeyPosition(keyData.position, keys.length);
          return (
            <KeyButton
              key={keyData.name}
              keyData={keyData}
              isSelected={state.selectedKey?.name === keyData.name}
              isHovered={state.hoveredKey?.name === keyData.name}
              onClick={handleKeyClick}
              onMouseEnter={handleKeyHover}
              onMouseLeave={handleKeyLeave}
              style={{
                position: 'absolute',
                transform: 'translate(-50%, -50%)',
                ...position,
              }}
            />
          );
        })}
      </motion.div>
      <div className="mt-8">
        <KeyInfo selectedKey={state.selectedKey} />
      </div>
    </div>
  );
};

export default CircleOfFifths;
