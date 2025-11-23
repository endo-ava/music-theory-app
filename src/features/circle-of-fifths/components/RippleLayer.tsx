'use client';

import React, { memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRippleStore } from '@/stores/rippleStore';

/** リップル効果の最大半径（SVG単位） */
const DEFAULT_MAX_RADIUS = 120;

/**
 * グローバルリップルレイヤー
 *
 * 全てのセグメントの最前面にリップルエフェクトを描画します。
 * useRippleStoreの状態を購読してアニメーションを制御します。
 */
export const RippleLayer: React.FC = memo(() => {
  const { ripples, removeRipple } = useRippleStore();

  return (
    <g className="ripple-layer" style={{ pointerEvents: 'none' }}>
      <AnimatePresence>
        {ripples.map(ripple => (
          <motion.circle
            key={ripple.id}
            cx={ripple.x}
            cy={ripple.y}
            fill="none"
            stroke={ripple.color}
            initial={{
              r: 0,
              opacity: 1,
              strokeWidth: 8,
            }}
            animate={{
              r: DEFAULT_MAX_RADIUS,
              opacity: 0,
              strokeWidth: 0,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 1,
              ease: 'easeOut',
            }}
            onAnimationComplete={() => removeRipple(ripple.id)}
          />
        ))}
      </AnimatePresence>
    </g>
  );
});

RippleLayer.displayName = 'RippleLayer';
