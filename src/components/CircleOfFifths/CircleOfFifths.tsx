/**
 * 五度圏メインコンポーネント
 * 
 * 五度圏を円形に表示し、各セグメントのホバー時に情報を表示します。
 * 円形を12分割し、各セグメントは3分割されて内側からマイナーキー、メジャーキー、調号を表示します。
 * メジャーキーとマイナーキーは個別にクリック可能です。
 * 
 * @fileoverview 五度圏のメインコンポーネント
 */

'use client';

import { useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useCircleOfFifthsStore } from '@/store/circleOfFifthsStore';
import { CircleSegment } from './components/CircleSegment';
import KeyInfoDisplay from './components/KeyInfoDisplay';
import { CIRCLE_SEGMENTS, CIRCLE_LAYOUT, COLORS, SVG, CONTAINER_STYLES } from './constants/index';
import { circleVariants } from './animations';
import { CircleOfFifthsProps } from './types';
import { Key } from '@/types/circleOfFifths';
import './styles/circleOfFifths.module.css';

/**
 * 五度圏表示コンポーネント
 *
 * 五度圏を円形に表示し、各セグメントのホバー時に情報を表示します。
 * 円形を12分割し、各セグメントは3分割されて内側からマイナーキー、メジャーキー、調号を表示します。
 * メジャーキーとマイナーキーは個別にクリック可能です。
 * 
 * @param props - コンポーネントのプロパティ
 * @returns 五度圏のJSX要素
 */
export const CircleOfFifths = ({ className, style }: CircleOfFifthsProps) => {
  const { selectedKey, hoveredKey, setSelectedKey, setHoveredKey } = useCircleOfFifthsStore();

  // キークリック時のハンドラー（メモ化）
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

  // キーホバー時のハンドラー（メモ化）
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

  // キーからマウスが離れた時のハンドラー（メモ化）
  const handleKeyLeave = useCallback(() => {
    setHoveredKey(null);
  }, [setHoveredKey]);

  // SVGビューボックスの計算（メモ化）
  const viewBox = useMemo(() => {
    const size = CIRCLE_LAYOUT.RADIUS * 2;
    return `-${CIRCLE_LAYOUT.RADIUS} -${CIRCLE_LAYOUT.RADIUS} ${size} ${size}`;
  }, []);

  // コンテナスタイルの計算（メモ化）
  const containerStyle = useMemo(() => {
    return {
      position: CONTAINER_STYLES.POSITION,
      width: CONTAINER_STYLES.CONTAINER_WIDTH,
      height: CONTAINER_STYLES.CONTAINER_HEIGHT,
      ...style,
    };
  }, [style]);

  return (
    <motion.div
      className={`circle-of-fifths ${className || ''}`.trim()}
      style={containerStyle}
      variants={circleVariants}
      initial="hidden"
      animate="visible"
    >
      {/* SVG円形表示エリア */}
      <div className="circle-svg-container">
        <svg
          width="70%"
          height="70%"
          viewBox={viewBox}
          style={{ display: SVG.DISPLAY }}
          aria-label="五度圏"
          role="img"
        >
          {/* 背景円 */}
          <circle
            cx={SVG.CENTER_X}
            cy={SVG.CENTER_Y}
            r={CIRCLE_LAYOUT.RADIUS}
            fill="none"
            stroke={COLORS.BORDER}
            strokeWidth={SVG.BACKGROUND_STROKE_WIDTH}
            aria-hidden="true"
          />

          {/* 内側の円（マイナーキーエリア境界） */}
          <circle
            cx={SVG.CENTER_X}
            cy={SVG.CENTER_Y}
            r={CIRCLE_LAYOUT.INNER_RADIUS}
            fill="none"
            stroke={COLORS.BORDER}
            strokeWidth={SVG.BORDER_STROKE_WIDTH}
            aria-hidden="true"
          />

          {/* 中間の円（メジャーキーエリア境界） */}
          <circle
            cx={SVG.CENTER_X}
            cy={SVG.CENTER_Y}
            r={CIRCLE_LAYOUT.MIDDLE_RADIUS}
            fill="none"
            stroke={COLORS.BORDER}
            strokeWidth={SVG.BORDER_STROKE_WIDTH}
            aria-hidden="true"
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

// コンポーネントの表示名を設定（デバッグ用）
CircleOfFifths.displayName = 'CircleOfFifths';
