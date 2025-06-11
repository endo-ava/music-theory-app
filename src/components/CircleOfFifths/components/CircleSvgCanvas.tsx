import React, { useMemo, useCallback } from 'react';
import { CircleSegmentProps, CircleSvgCanvasProps } from '../types';
import { SVG, FONT_SIZES, COLORS, ANIMATION, FONT_WEIGHTS } from '../constants/index';
import { CircleSegment } from './CircleSegment';

export const CircleSvgCanvas: React.FC<CircleSvgCanvasProps> = ({
  radius, innerRadius, middleRadius, segments,
  selectedKey, hoveredKey, onKeyClick, onKeyHover, onKeyLeave
}) => {
  // SVGビューボックスの計算（メモ化）
  const viewBox = useMemo(() => {
    const size = radius * 2;
    return `-${radius} -${radius} ${size} ${size}`;
  }, [radius]); // radiusが変更された場合のみ再計算

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={viewBox}
      style={{ display: SVG.DISPLAY_MODE }} // ここも定数化
      aria-label="五度圏"
      role="img"
    >
      {/* 背景円 */}
      <circle
        cx={SVG.CENTER_X}
        cy={SVG.CENTER_Y}
        r={radius}
        fill="none"
        stroke={COLORS.BORDER}
        strokeWidth={SVG.BACKGROUND_STROKE_WIDTH}
        aria-hidden="true"
      />

      {/* 内側の円（マイナーキーエリア境界） */}
      <circle
        cx={SVG.CENTER_X}
        cy={SVG.CENTER_Y}
        r={innerRadius}
        fill="none"
        stroke={COLORS.BORDER}
        strokeWidth={SVG.BORDER_STROKE_WIDTH}
        aria-hidden="true"
      />

      {/* 中間の円（メジャーキーエリア境界） */}
      <circle
        cx={SVG.CENTER_X}
        cy={SVG.CENTER_Y}
        r={middleRadius}
        fill="none"
        stroke={COLORS.BORDER}
        strokeWidth={SVG.BORDER_STROKE_WIDTH}
        aria-hidden="true"
      />

      {/* 各セグメントを描画 */}
      {segments.map(segment => (
        <CircleSegment
          key={segment.position}
          segment={segment}
          selectedKey={selectedKey}
          hoveredKey={hoveredKey}
          onKeyClick={onKeyClick}
          onKeyHover={onKeyHover}
          onKeyLeave={onKeyLeave}
        />
      ))}
    </svg>
  );
};