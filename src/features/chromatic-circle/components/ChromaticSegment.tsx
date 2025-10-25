'use client';

import { memo, useCallback, useMemo } from 'react';
import { motion } from 'motion/react';
import { useChromaticCircleStore } from '@/stores/chromaticCircleStore';
import { useAudio } from '../hooks/useAudio';
import type { Point, ChromaticSegmentDTO, ChromaticSegmentPaths } from '../types';
import { ANIMATION } from '../constants';

export interface ChromaticSegmentProps {
  /** Domain層のDTO */
  segment: ChromaticSegmentDTO;
  /** 2層構造のSVGパス */
  paths: ChromaticSegmentPaths;
  /** テキスト位置 */
  textPosition: Point;
}

/**
 * クロマチックサークルの単一セグメントコンポーネント
 *
 * 五度圏と統一された2層構造（ピッチクラス表示エリア + 調号エリア）で表示します。
 * ピッチクラス名はピッチクラス表示エリアの中央に配置されます。
 * ホバー・クリックインタラクションをサポートします。
 */
export const ChromaticSegment = memo<ChromaticSegmentProps>(({ segment, paths, textPosition }) => {
  const { selectedPitchClass, hoveredPitchClass, setSelectedPitchClass, setHoveredPitchClass } =
    useChromaticCircleStore();
  const { playPitchClass } = useAudio();

  // 選択・ホバー状態の判定
  const isSelected = selectedPitchClass?.position === segment.position;
  const isHovered = hoveredPitchClass?.position === segment.position;

  // クラス名の計算
  const fillClassName = useMemo(() => {
    if (isSelected) return 'fill-key-area-selected';
    if (isHovered) return 'fill-key-area-hover';
    return 'fill-key-area-major';
  }, [isSelected, isHovered]);

  // イベントハンドラ
  const handleClick = useCallback(() => {
    setSelectedPitchClass(segment);
    playPitchClass(segment);
  }, [segment, setSelectedPitchClass, playPitchClass]);

  const handleMouseEnter = useCallback(() => {
    setHoveredPitchClass(segment);
  }, [segment, setHoveredPitchClass]);

  const handleMouseLeave = useCallback(() => {
    setHoveredPitchClass(null);
  }, [setHoveredPitchClass]);

  return (
    <motion.g
      style={{ cursor: 'pointer', userSelect: 'none' }}
      whileHover={{ scale: ANIMATION.HOVER_SCALE }}
      whileTap={{ scale: ANIMATION.TAP_SCALE }}
      transition={{
        duration: ANIMATION.FADE_DURATION,
        // アクセシビリティ: モーション感度に配慮
        ...(typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? { duration: 0 }
          : {}),
      }}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* ピッチクラス表示エリア（90px～175px）- 五度圏のメジャーキーと同じ色 */}
      <path d={paths.pitchPath} className={`${fillClassName} stroke-border border`} />

      {/* 調号エリア（175px～200px）- 外側の装飾リング */}
      <path d={paths.signaturePath} className="fill-key-area-signature stroke-border border" />

      {/* ピッチクラス名（Domain層がフォーマット済み） */}
      <text
        className="fill-foreground text-key-major font-key-major"
        x={textPosition.x}
        y={textPosition.y}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        {segment.pitchClassName}
      </text>
    </motion.g>
  );
});

ChromaticSegment.displayName = 'ChromaticSegment';
