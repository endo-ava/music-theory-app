'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export interface SVGRippleEffectProps {
  /** リップル効果をトリガーするかどうか */
  isTriggered: boolean;
  /** アニメーション完了時のコールバック */
  onAnimationComplete?: () => void;
  /** リップルの中心X座標（SVG座標系） */
  centerX?: number;
  /** リップルの中心Y座標（SVG座標系） */
  centerY?: number;
  /** リップルの色（CSS変数） */
  color?: string;
}

interface RippleInstance {
  id: number;
  startTime: number;
}

/**
 * SVG対応の波紋エフェクトコンポーネント
 *
 * ロングプレス開始時に波紋が広がるアニメーションをSVG内で表示します。
 * Framer MotionとSVGの<circle>要素を使用して実装されています。
 */
export const SVGRippleEffect: React.FC<SVGRippleEffectProps> = ({
  isTriggered,
  onAnimationComplete,
  centerX = 0,
  centerY = 0,
  color = 'rgba(255, 255, 255, 0.4)',
}) => {
  const [ripples, setRipples] = useState<RippleInstance[]>([]);
  const [rippleId, setRippleId] = useState(0);

  const createRipple = useCallback(() => {
    const newRipple: RippleInstance = {
      id: rippleId,
      startTime: Date.now(),
    };

    setRipples(prev => [...prev, newRipple]);
    setRippleId(prev => prev + 1);
  }, [rippleId]);

  const removeRipple = useCallback(
    (id: number) => {
      setRipples(prev => prev.filter(ripple => ripple.id !== id));
      onAnimationComplete?.();
    },
    [onAnimationComplete]
  );

  // isTriggeredが変更されたときにリップルを作成
  useEffect(() => {
    if (isTriggered) {
      createRipple();
    }
  }, [isTriggered, createRipple]);

  return (
    <g className="ripple-effect-container pointer-events-none">
      <AnimatePresence>
        {ripples.map(ripple => (
          <motion.circle
            key={ripple.id}
            cx={centerX}
            cy={centerY}
            fill="none"
            stroke={color}
            initial={{
              r: 0,
              opacity: 1,
              strokeWidth: 2,
            }}
            animate={{
              r: 100,
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
};
