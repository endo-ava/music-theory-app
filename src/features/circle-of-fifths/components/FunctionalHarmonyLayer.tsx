'use client';
import React, { memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCurrentKeyStore } from '@/stores/currentKeyStore';
import { useLayerStore } from '@/stores/layerStore';
import { useFunctionalHarmonyData } from '../hooks/useFunctionalHarmonyData';
import { ANIMATION, LAYOUT_OFFSETS } from '../constants';

/**
 * 機能和声レイヤー
 *
 * T（Tonic）、D（Dominant）、SD（Subdominant）の文字を
 * それぞれ固有の色で表示するレイヤーコンポーネント。
 *
 * ダイアトニックレイヤーとは完全に独立した新規レイヤーで、
 * ローマ数字は表示せず、機能記号のみを表示します。
 *
 * 責務:
 * - useFunctionalHarmonyDataから受け取ったデータを視覚的に描画
 * - ダイアトニックレイヤーとの共存時のレイアウト調整
 *
 * データ計算ロジックはuseFunctionalHarmonyDataに集約されています。
 */
export const FunctionalHarmonyLayer: React.FC = memo(() => {
  const { currentKey } = useCurrentKeyStore();
  const functionalHarmonyData = useFunctionalHarmonyData(currentKey);
  const { isDiatonicVisible, isFunctionalHarmonyVisible } = useLayerStore();

  if (functionalHarmonyData.length === 0) {
    return null;
  }

  // 両方のレイヤーがONの場合、機能記号を右にオフセット
  const bothLayersVisible = isDiatonicVisible && isFunctionalHarmonyVisible;

  return (
    <g className="functional-harmony-layer" style={{ pointerEvents: 'none' }}>
      <AnimatePresence>
        {functionalHarmonyData.map(
          ({ abbreviation, color, textPosition, isMajor, fifthsIndex }) => {
            const key = `${currentKey.shortName}-${fifthsIndex}-${isMajor ? 'major' : 'minor'}`;

            // 両方のレイヤーがONの場合、機能記号を右にオフセット
            const functionalX = bothLayersVisible
              ? textPosition.x + LAYOUT_OFFSETS.DUAL_LAYER_X_OFFSET
              : textPosition.x;

            return (
              <motion.text
                key={key}
                x={functionalX}
                y={textPosition.y + LAYOUT_OFFSETS.ROMAN_Y_OFFSET}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-foreground text-key-layer font-semibold"
                style={{
                  fill: color,
                  userSelect: 'none',
                  textShadow: `0 0 4px ${color}, 0 0 8px ${color}`,
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
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
});

FunctionalHarmonyLayer.displayName = 'FunctionalHarmonyLayer';
