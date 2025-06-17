'use client';

import React, { useMemo } from 'react';
import { CircleSvgCanvasProps } from '../types';
import { CircleSegment } from './CircleSegment';

/**
 * 五度圏（Circle of Fifths）を描画するインタラクティブなSVGキャンバスコンポーネント。
 * 円を指定された数のセグメントに分割し、それぞれのキー（音名など）に対する選択、ホバーといったUIイベントを処理します。
 *
 * @param props - コンポーネントのプロパティ
 * @returns {JSX.Element} インタラクティブな五度圏を表すSVG要素。
 */
export const CircleSvgCanvas: React.FC<CircleSvgCanvasProps> = ({
  radius, segments, selectedKey, hoveredKey, onKeyClick, onKeyHover, onKeyLeave
}) => {
  // SVGビューボックスの計算（メモ化）
  const viewBox = useMemo(() => {
    const size = radius * 2;
    return `-${radius} -${radius} ${size} ${size}`;
  }, [radius]); // radiusが変更された場合のみ再計算

  return (
    <svg
      viewBox={viewBox}
      className="block"
      aria-label="五度圏"
      role="img"
    >

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