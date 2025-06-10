'use client';

import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { useCircleOfFifthsStore } from '@/store/circleOfFifthsStore';
import { CircleSegment } from './CircleSegment';
import KeyInfoDisplay from './KeyInfoDisplay';
import { CIRCLE_SEGMENTS } from './constants';
import { circleVariants } from './animations';
import { STYLES, Key } from '@/types/circleOfFifths';
import './styles/circleOfFifths.css';

/**
 * 五度圏表示コンポーネント
 *
 * 五度圏を円形に表示し、各セグメントのホバー時に情報を表示します。
 * 円形を12分割し、各セグメントは3分割されて内側からマイナーキー、メジャーキー、調号を表示します。
 * メジャーキーとマイナーキーは個別にクリック可能です。
 */
export const CircleOfFifths = () => {
  const { selectedKey, hoveredKey, setSelectedKey, setHoveredKey } = useCircleOfFifthsStore();

  // キークリック時のハンドラー
  const handleKeyClick = useCallback(
    (keyName: string, isMajor: boolean, position: number) => {
      const keyData: Key = {
        name: keyName,
        isMajor,
        position,
      };
      setSelectedKey(keyData);
    },
    [setSelectedKey]
  );

  // キーホバー時のハンドラー
  const handleKeyHover = useCallback(
    (keyName: string, isMajor: boolean, position: number) => {
      const keyData: Key = {
        name: keyName,
        isMajor,
        position,
      };
      setHoveredKey(keyData);
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
      {/* SVG円形表示エリア */}
      <div className="circle-svg-container" style={{ position: 'relative', width: '100%', height: '100%' }}>
        <svg
          width="100%"
          height="100%"
          viewBox={`-${STYLES.CIRCLE_SEGMENT.RADIUS} -${STYLES.CIRCLE_SEGMENT.RADIUS} ${STYLES.CIRCLE_SEGMENT.RADIUS * 2} ${STYLES.CIRCLE_SEGMENT.RADIUS * 2}`}
          style={{ display: 'block' }}
        >
          {/* 背景円 */}
          <circle
            cx="0"
            cy="0"
            r={STYLES.CIRCLE_SEGMENT.RADIUS}
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="2"
          />

          {/* 内側の円（マイナーキーエリア境界） */}
          <circle
            cx="0"
            cy="0"
            r={STYLES.CIRCLE_SEGMENT.INNER_RADIUS}
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="1"
          />

          {/* 中間の円（メジャーキーエリア境界） */}
          <circle
            cx="0"
            cy="0"
            r={STYLES.CIRCLE_SEGMENT.MIDDLE_RADIUS}
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="1"
          />

          {/* 各セグメントを描画 */}
          {CIRCLE_SEGMENTS.map(segment => (
            <CircleSegment
              key={segment.position}
              segment={segment}
              selectedKey={selectedKey}
              hoveredKey={hoveredKey}
              onKeyClick={handleKeyClick}
              onKeyHover={handleKeyHover}
              onKeyLeave={handleKeyLeave}
            />
          ))}
        </svg>
      </div>

      {/* キー情報表示エリア */}
      <KeyInfoDisplay hoveredKey={hoveredKey} />
    </motion.div>
  );
};
