'use client';
import React, { memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCurrentKeyStore } from '@/stores/currentKeyStore';
import { useLayerStore } from '@/stores/layerStore';
import { useDiatonicChordHighlight } from '../hooks/useDiatonicChordHighlight';
import { getCircleOfFifthsData } from '../utils/circleOfFifthsData';
import { getMusicColorVariable } from '@/shared/utils/musicColorSystem';
import { ANIMATION, LAYOUT_OFFSETS } from '../constants';

/** 度数表記テキストのプロパティ */
interface DegreeTextProps {
  /** ローマ数字表記 */
  romanNumeral: string;
  /** テキスト位置X */
  x: number;
  /** テキスト位置Y */
  y: number;
  /** テキスト回転角度 */
  rotation: number;
  /** 度数表記の色 */
  color: string;
  /** 機能和声レイヤーが表示されているか */
  isFunctionalHarmonyVisible: boolean;
}

/**
 * Hydration error対策として座標を丸める
 * 10桁精度（1e10）: SVG座標系において視覚的影響なく精度の問題を解決
 */
const COORDINATE_PRECISION = 1e10;

/**
 * 座標値を丸める（hydrationエラー対策）
 * 浮動小数点の精度問題を回避するため、小数点以下10桁に丸める
 */
const roundCoordinate = (value: number): number => {
  return Math.round(value * COORDINATE_PRECISION) / COORDINATE_PRECISION;
};

/**
 * 度数表記テキストコンポーネント
 */
const DegreeText: React.FC<DegreeTextProps> = memo(
  ({ romanNumeral, x, y, rotation, color, isFunctionalHarmonyVisible }) => {
    // 機能和声レイヤーが表示されている場合、テキストを左にオフセット
    const offsetX = isFunctionalHarmonyVisible ? x - LAYOUT_OFFSETS.DUAL_LAYER_X_OFFSET : x;

    // 座標値を丸める（hydrationエラー対策）
    const roundedX = roundCoordinate(x);
    const roundedY = roundCoordinate(y);
    const roundedOffsetX = roundCoordinate(offsetX);

    return (
      <motion.text
        className="fill-foreground text-key-layer font-semibold"
        x={roundedOffsetX}
        y={roundedY}
        textAnchor="middle"
        dominantBaseline="middle"
        transform={`rotate(${rotation} ${roundedX} ${roundedY})`}
        style={{
          userSelect: 'none',
          fill: color,
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{
          duration: ANIMATION.FADE_DURATION * 0.8,
        }}
      >
        {romanNumeral}
      </motion.text>
    );
  }
);

DegreeText.displayName = 'DegreeText';

/**
 * 度数（ローマ数字）表記レイヤー
 *
 * ダイアトニックコードの度数をローマ数字で表示するレイヤー。
 * ダイアトニックボーダーハイライトとは独立して制御可能。
 */
export const DegreeLayer: React.FC = memo(() => {
  const { currentKey } = useCurrentKeyStore();
  const { isDegreeVisible, isFunctionalHarmonyVisible } = useLayerStore();
  const { getHighlightInfo } = useDiatonicChordHighlight(currentKey);
  const { segments, textRotation } = getCircleOfFifthsData();

  // レイヤーが非表示の場合は何も描画しない
  if (!isDegreeVisible) {
    return null;
  }

  return (
    <g className="degree-layer" style={{ pointerEvents: 'none' }}>
      <AnimatePresence>
        {segments.map(({ segment, textPositions }) => {
          // マイナーキーの判定
          const minorInfo = getHighlightInfo(segment.minorKey);
          // メジャーキーの判定
          const majorInfo = getHighlightInfo(segment.majorKey);

          const minorColor = getMusicColorVariable(segment.minorKey);
          const majorColor = getMusicColorVariable(segment.majorKey);

          return (
            <React.Fragment key={segment.position}>
              {/* マイナーキーの度数表記 */}
              {minorInfo.shouldHighlight && minorInfo.romanNumeral && (
                <DegreeText
                  key={`${segment.position}-minor-degree`}
                  romanNumeral={minorInfo.romanNumeral}
                  x={textPositions.minorTextPos.x}
                  y={textPositions.minorTextPos.y + LAYOUT_OFFSETS.ROMAN_Y_OFFSET}
                  rotation={textRotation}
                  color={minorColor}
                  isFunctionalHarmonyVisible={isFunctionalHarmonyVisible}
                />
              )}

              {/* メジャーキーの度数表記 */}
              {majorInfo.shouldHighlight && majorInfo.romanNumeral && (
                <DegreeText
                  key={`${segment.position}-major-degree`}
                  romanNumeral={majorInfo.romanNumeral}
                  x={textPositions.majorTextPos.x}
                  y={textPositions.majorTextPos.y + LAYOUT_OFFSETS.ROMAN_Y_OFFSET}
                  rotation={textRotation}
                  color={majorColor}
                  isFunctionalHarmonyVisible={isFunctionalHarmonyVisible}
                />
              )}
            </React.Fragment>
          );
        })}
      </AnimatePresence>
    </g>
  );
});

DegreeLayer.displayName = 'DegreeLayer';
