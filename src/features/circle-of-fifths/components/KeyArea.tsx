'use client';

import { memo } from 'react';
import { motion } from 'motion/react';
import { ANIMATION } from '../constants/index';

import { useKeyArea } from '../hooks/useKeyArea';
import type { Point } from '@/features/circle-of-fifths/types';
import { CircleSegmentDTO } from '@/domain/services/CircleOfFifths';
import { KeyDTO } from '@/domain';

/**
 * 個別キーエリアコンポーネントのProps
 */
export interface KeyAreaProps {
  /** キー名 */
  keyDTO: KeyDTO;
  /** セグメントの情報 */
  segment: CircleSegmentDTO;
  /** SVGパス */
  path: string;
  /** テキスト位置 */
  textPosition: Point;
  /** テキスト回転角度 */
  textRotation: number;
  /** アニメーション遅延時間（秒） */
  animationDelay: number;
  /** テキストアニメーション遅延時間（秒） */
  textAnimationDelay: number;
}

/**
 * 個別のキーエリアコンポーネント
 *
 * メジャーキーまたはマイナーキーの個別エリアを表示し、
 * クリックとホバーイベントを処理します。
 *
 * @param props - コンポーネントのプロパティ
 * @returns キーエリアのJSX要素
 */
export const KeyArea = memo<KeyAreaProps>(
  ({
    keyDTO: key,
    segment,
    path,
    textPosition,
    textRotation,
    animationDelay,
    textAnimationDelay,
  }) => {
    // カスタムフックから状態とイベントハンドラを受け取る
    const { states, handlers } = useKeyArea({ keyDTO: key, segment });
    const { fillClassName, textClassName } = states;
    const { handleClick, handleMouseEnter, handleMouseLeave } = handlers;

    return (
      <motion.g
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        style={{ cursor: 'pointer' }}
        whileHover={{ scale: ANIMATION.HOVER_SCALE }}
        whileTap={{ scale: ANIMATION.TAP_SCALE }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: ANIMATION.FADE_DURATION, delay: animationDelay }}
      >
        <motion.path
          className={`stroke-border border ${fillClassName}`}
          d={path}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: ANIMATION.FADE_DURATION, delay: animationDelay }}
        />
        <motion.text
          className={`fill-text-primary ${textClassName}`}
          x={textPosition.x}
          y={textPosition.y}
          textAnchor="middle"
          dominantBaseline="middle"
          transform={`rotate(${textRotation} ${textPosition.x} ${textPosition.y})`}
          style={{ pointerEvents: 'none' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: ANIMATION.FADE_DURATION, delay: textAnimationDelay }}
        >
          {key.shortName}
        </motion.text>
      </motion.g>
    );
  }
);

// コンポーネントの表示名を設定（デバッグ用）
KeyArea.displayName = 'KeyArea';
