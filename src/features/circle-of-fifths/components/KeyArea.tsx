'use client';

import { memo, useMemo } from 'react';
import { motion } from 'motion/react';
import { ANIMATION } from '../constants/index';
import { COMMON_TEXT_STYLES, FONT_SIZES, LAYOUT_OFFSETS } from '../constants/keyArea';

import { useKeyArea } from '../hooks/useKeyArea';
import { SVGRippleEffect } from './SVGRippleEffect';
import type { Point } from '@/features/circle-of-fifths/types';
import { CircleSegmentDTO } from '@/domain/services/CircleOfFifths';
import { KeyDTO } from '@/domain';
import { getMusicColorVariable } from '@/shared/utils/musicColorSystem';
import { useDiatonicChordHighlight } from '../hooks/useDiatonicChordHighlight';

/**
 * キーエリアのレイアウト計算を分離したカスタムフック
 * 関心の分離によりレイアウト計算ロジックを独立
 */
const useKeyAreaLayout = (
  textPosition: Point,
  shouldHighlight: boolean,
  romanNumeral: string | null
) => {
  return useMemo(
    () => ({
      primaryTextY:
        shouldHighlight && romanNumeral
          ? textPosition.y + LAYOUT_OFFSETS.PRIMARY_Y_OFFSET
          : textPosition.y,
      romanTextY: textPosition.y + LAYOUT_OFFSETS.ROMAN_Y_OFFSET,
    }),
    [textPosition, shouldHighlight, romanNumeral]
  );
};

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
    const { states, handlers, ripple } = useKeyArea({ keyDTO: key, segment });
    const { fillClassName, textClassName } = states;

    // ダイアトニックコードハイライトの状態を取得
    const { getHighlightInfo } = useDiatonicChordHighlight();
    const { shouldHighlight, romanNumeral } = getHighlightInfo(key);

    // レイアウト計算（関心の分離）
    const layout = useKeyAreaLayout(textPosition, shouldHighlight, romanNumeral);

    // 音楽色相システムからリップルエフェクト用のCSS変数を生成
    const rippleColor = getMusicColorVariable(key);

    return (
      <motion.g
        style={{
          cursor: 'pointer',
          ...COMMON_TEXT_STYLES,
        }}
        whileHover={{ scale: ANIMATION.HOVER_SCALE }}
        whileTap={{ scale: ANIMATION.TAP_SCALE }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: ANIMATION.FADE_DURATION, delay: animationDelay }}
        {...handlers}
      >
        <motion.path
          className={fillClassName}
          d={path}
          animate={{
            opacity: 1,
            stroke: shouldHighlight ? rippleColor : 'var(--color-border)',
            strokeWidth: '1px',
            filter: shouldHighlight ? `drop-shadow(0 0 4px ${rippleColor})` : '',
            strokeLinejoin: 'miter',
            strokeLinecap: 'square',
          }}
          style={{
            shapeRendering: 'geometricPrecision',
          }}
          initial={{ opacity: 0 }}
          transition={{ duration: ANIMATION.FADE_DURATION, delay: animationDelay }}
        />
        <motion.text
          className={`fill-foreground ${textClassName}`}
          x={textPosition.x}
          y={layout.primaryTextY}
          textAnchor="middle"
          dominantBaseline="middle"
          transform={`rotate(${textRotation} ${textPosition.x} ${textPosition.y})`}
          style={{
            ...COMMON_TEXT_STYLES,
            fontSize: FONT_SIZES.PRIMARY,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: ANIMATION.FADE_DURATION, delay: textAnimationDelay }}
        >
          {key.shortName}
        </motion.text>

        {/* ダイアトニックコードのローマ数字表記 */}
        {shouldHighlight && romanNumeral && (
          <motion.text
            className="fill-foreground font-semibold"
            x={textPosition.x}
            y={layout.romanTextY}
            textAnchor="middle"
            dominantBaseline="middle"
            transform={`rotate(${textRotation} ${textPosition.x} ${textPosition.y})`}
            style={{
              ...COMMON_TEXT_STYLES,
              fontSize: FONT_SIZES.ROMAN,
              fill: rippleColor,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{
              duration: ANIMATION.FADE_DURATION * 0.8,
              delay: textAnimationDelay + 0.1,
            }}
          >
            {romanNumeral}
          </motion.text>
        )}

        {/* リップルエフェクト */}
        <SVGRippleEffect
          isTriggered={ripple.isRippleActive}
          centerX={textPosition.x}
          centerY={textPosition.y}
          color={rippleColor}
          onAnimationComplete={ripple.resetRipple}
        />
      </motion.g>
    );
  }
);

// コンポーネントの表示名を設定（デバッグ用）
KeyArea.displayName = 'KeyArea';
