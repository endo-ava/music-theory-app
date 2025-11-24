'use client';
import React, { memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCurrentKeyStore } from '@/stores/currentKeyStore';
import { useDiatonicHighlight } from '../hooks/useDiatonicHighlight';
import { getChromaticCircleData } from '../utils/chromaticCircleData';
import { getMusicColorVariable } from '@/shared/utils/musicColorSystem';
import { CIRCLE_LAYOUT, ANIMATION } from '../constants';

/** ハイライトパスのプロパティ */
interface HighlightPathProps {
  /** SVGパスデータ */
  path: string;
  /** ハイライト色 */
  color: string;
  /** トニックかどうか */
  isTonic: boolean;
}

/**
 * ハイライトパスコンポーネント
 * ピッチクラスセグメントのハイライト描画
 */
const HighlightPath: React.FC<HighlightPathProps> = memo(({ path, color, isTonic }) => (
  <motion.path
    d={path}
    stroke={color}
    strokeWidth={isTonic ? '1.2px' : '0.8px'}
    filter={isTonic ? `drop-shadow(0 0 4px ${color}) drop-shadow(0 0 8px ${color})` : ''}
    fill="none"
    strokeLinejoin="miter"
    strokeLinecap="square"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: ANIMATION.FADE_DURATION }}
  />
));

HighlightPath.displayName = 'HighlightPath';

/**
 * ダイアトニックコード構成音のハイライトレイヤー
 *
 * クロマチックサークルのセグメント上に重ねて描画することで、
 * ダイアトニックスケールの構成音（7音）をハイライト表示します。
 * また、内側の円周もハイライトして構成音のつながりを表現します。
 */
export const DiatonicHighlightLayer: React.FC = memo(() => {
  const { currentKey } = useCurrentKeyStore();
  const { highlightPositions, tonicPosition, isVisible } = useDiatonicHighlight(currentKey);
  const { segments } = getChromaticCircleData();

  // 非表示の場合は何も描画しない
  if (!isVisible) {
    return null;
  }

  // 現在のキーの色（ハイライト色）
  const currentKeyColor = getMusicColorVariable(currentKey);
  const innerRadius = CIRCLE_LAYOUT.CENTER_RADIUS;

  return (
    <g className="diatonic-highlight-layer" style={{ pointerEvents: 'none' }}>
      <AnimatePresence>
        {/* 各ダイアトニック構成音のセグメントをハイライト */}
        {segments.map(({ segment, paths }) => {
          const shouldHighlight = highlightPositions.has(segment.position);

          if (!shouldHighlight) {
            return null;
          }

          const isTonic = segment.position === tonicPosition;

          return (
            <HighlightPath
              key={segment.position}
              path={paths.pitchPath}
              color={currentKeyColor}
              isTonic={isTonic}
            />
          );
        })}

        {/* 内側の円周をハイライト */}
        <motion.circle
          key="inner-circle-highlight"
          cx={0}
          cy={0}
          r={innerRadius}
          stroke={currentKeyColor}
          strokeWidth="0.8px"
          fill="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: ANIMATION.FADE_DURATION }}
        />
      </AnimatePresence>
    </g>
  );
});

DiatonicHighlightLayer.displayName = 'DiatonicHighlightLayer';
