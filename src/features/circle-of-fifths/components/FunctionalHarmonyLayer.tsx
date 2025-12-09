'use client';
import React, { memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCurrentKeyStore } from '@/stores/currentKeyStore';
import { useLayerStore } from '@/features/layer-controller/stores/layerStore';
import { useFunctionalHarmonyData } from '../hooks/useFunctionalHarmonyData';
import { ANIMATION, LAYOUT_OFFSETS } from '../constants';

interface FunctionalHarmonyLayerProps {
  /** テキストの回転角度（CircleOfFifthsClientから渡される） */
  textRotation: number;
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
 * 機能和声レイヤー
 *
 * T（Tonic）、D（Dominant）、SD（Subdominant）の文字を
 * それぞれ固有の色で表示するレイヤーコンポーネント。
 *
 * 度数レイヤーとは独立したレイヤーで、
 * ローマ数字は表示せず、機能記号のみを表示します。
 *
 * 責務:
 * - useFunctionalHarmonyDataから受け取ったデータを視覚的に描画
 * - 度数レイヤーとの共存時のレイアウト調整
 *
 * データ計算ロジックはuseFunctionalHarmonyDataに集約されています。
 */
export const FunctionalHarmonyLayer: React.FC<FunctionalHarmonyLayerProps> = memo(
  ({ textRotation }) => {
    const { currentKey } = useCurrentKeyStore();
    const functionalHarmonyData = useFunctionalHarmonyData(currentKey);
    const { isDegreeVisible, isFunctionalHarmonyVisible } = useLayerStore();

    if (!isFunctionalHarmonyVisible || functionalHarmonyData.length === 0) {
      return null;
    }

    // 度数レイヤーと機能和声レイヤーの両方がONの場合、機能記号を右にオフセット
    const bothLayersVisible = isDegreeVisible && isFunctionalHarmonyVisible;

    return (
      <g className="functional-harmony-layer" style={{ pointerEvents: 'none' }}>
        <AnimatePresence>
          {functionalHarmonyData.map(
            ({ abbreviation, color, textPosition, isMajor, fifthsIndex }) => {
              const key = `${currentKey.shortName}-${fifthsIndex}-${isMajor ? 'major' : 'minor'}`;

              // 度数レイヤーと機能和声レイヤーの両方がONの場合、機能記号を右にオフセット
              const functionalX = bothLayersVisible
                ? textPosition.x + LAYOUT_OFFSETS.DUAL_LAYER_X_OFFSET
                : textPosition.x;

              const functionalY = textPosition.y + LAYOUT_OFFSETS.ROMAN_Y_OFFSET;

              // 座標値を丸める（hydrationエラー対策）
              const roundedX = roundCoordinate(functionalX);
              const roundedY = roundCoordinate(functionalY);

              return (
                <motion.text
                  key={key}
                  x={0}
                  y={0}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`translate(${roundedX}, ${roundedY}) rotate(${textRotation})`}
                  className="fill-foreground text-key-layer font-semibold"
                  style={{
                    fill: color,
                    userSelect: 'none',
                    textShadow: `0 0 4px ${color}, 0 0 8px ${color}`,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: ANIMATION.FADE_DURATION,
                  }}
                >
                  {abbreviation}
                </motion.text>
              );
            }
          )}
        </AnimatePresence>
      </g>
    );
  }
);

FunctionalHarmonyLayer.displayName = 'FunctionalHarmonyLayer';
