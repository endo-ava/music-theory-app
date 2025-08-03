'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface RippleEffectProps {
  /** リップル効果をトリガーするかどうか */
  isTriggered: boolean;
  /** アニメーション完了時のコールバック */
  onAnimationComplete?: () => void;
  /** カスタムクラス名 */
  className?: string;
}

interface RippleInstance {
  id: number;
  x: number;
  y: number;
}

/**
 * 波紋エフェクトコンポーネント
 *
 * ロングプレス開始時に波紋が広がるアニメーションを表示します。
 * Framer MotionとTailwindCSSを使用して実装されています。
 */
export const RippleEffect: React.FC<RippleEffectProps> = ({
  isTriggered,
  onAnimationComplete,
  className = '',
}) => {
  const [ripples, setRipples] = useState<RippleInstance[]>([]);
  const [rippleId, setRippleId] = useState(0);

  const createRipple = useCallback(() => {
    if (!isTriggered) return;

    const newRipple: RippleInstance = {
      id: rippleId,
      x: 50, // 中央から開始
      y: 50,
    };

    setRipples(prev => [...prev, newRipple]);
    setRippleId(prev => prev + 1);
  }, [isTriggered, rippleId]);

  const removeRipple = useCallback(
    (id: number) => {
      setRipples(prev => prev.filter(ripple => ripple.id !== id));
      onAnimationComplete?.();
    },
    [onAnimationComplete]
  );

  // isTriggeredが変更されたときにリップルを作成
  useState(() => {
    if (isTriggered) {
      createRipple();
    }
  });

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <AnimatePresence>
        {ripples.map(ripple => (
          <motion.div
            key={ripple.id}
            className="absolute rounded-full bg-white/30"
            style={{
              left: `${ripple.x}%`,
              top: `${ripple.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            initial={{
              width: 0,
              height: 0,
              opacity: 0.8,
            }}
            animate={{
              width: '300%',
              height: '300%',
              opacity: 0,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 0.6,
              ease: 'easeOut',
            }}
            onAnimationComplete={() => removeRipple(ripple.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
