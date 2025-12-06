'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnimationStore } from '@/stores/animationStore';
import { getCircleOfFifthsData } from '../utils/circleOfFifthsData';

/**
 * 進行（プログレッション）を可視化するレイヤー
 *
 * 五度進行や裏コードへの進行を矢印で表示します。
 */
export const ProgressionLayer: React.FC = () => {
  const { activeAnimations } = useAnimationStore();
  const { segments } = getCircleOfFifthsData();

  // 矢印のマーカー定義（全ての矢印で共有）
  const markerId = 'progression-arrow-head';

  return (
    <g className="pointer-events-none">
      <defs>
        <marker id={markerId} markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" className="text-accent" />
        </marker>
      </defs>

      <AnimatePresence>
        {activeAnimations.map(anim => {
          const startSegment = segments.find(s => s.segment.position === anim.from);
          const endSegment = segments.find(s => s.segment.position === anim.to);

          if (!startSegment || !endSegment) return null;

          // メジャー/マイナーに応じて開始/終了位置を決定
          const startPos = anim.isMajor
            ? startSegment.textPositions.majorTextPos
            : startSegment.textPositions.minorTextPos;

          const endPos = anim.isMajor
            ? endSegment.textPositions.majorTextPos
            : endSegment.textPositions.minorTextPos;

          return (
            <g key={anim.id}>
              {/* 矢印の描画 */}
              <motion.path
                d={`M ${startPos.x} ${startPos.y} L ${endPos.x} ${endPos.y}`}
                className="stroke-accent text-accent"
                strokeWidth="2"
                fill="none"
                markerEnd={`url(#${markerId})`}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              />

              {/* ターゲットのハイライト（オプション） */}
              <motion.circle
                cx={endPos.x}
                cy={endPos.y}
                r="15"
                className="fill-accent/20 stroke-accent"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              />
            </g>
          );
        })}
      </AnimatePresence>
    </g>
  );
};
