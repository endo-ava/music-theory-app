'use client';
import React, { memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCurrentKeyStore } from '@/stores/currentKeyStore';
import { useLayerStore } from '@/features/layer-controller/stores/layerStore';
import { useDiatonicChordHighlight } from '../hooks/useDiatonicChordHighlight';
import { getCircleOfFifthsData } from '../utils/circleOfFifthsData';
import { getMusicColorVariable } from '@/utils/musicColorSystem';
import { ANIMATION } from '../constants';

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
 * マイナー・メジャー共通のハイライト描画ロジック
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
 * ダイアトニックコードのハイライトレイヤー
 *
 * セグメントの上に重ねて描画することで、隣接するセグメントによる
 * ボーダーの隠れ（オクルージョン）を防ぎます。
 */
export const DiatonicHighlightLayer: React.FC = memo(() => {
  const { currentKey } = useCurrentKeyStore();
  const { isDiatonicVisible } = useLayerStore();
  const { getHighlightInfo } = useDiatonicChordHighlight(currentKey);
  const { segments } = getCircleOfFifthsData();

  // 現在のキーの色（ハイライト色）
  const currentKeyColor = getMusicColorVariable(currentKey);

  // レイヤーが非表示の場合は何も描画しない
  if (!isDiatonicVisible) {
    return null;
  }

  return (
    <g className="diatonic-highlight-layer" style={{ pointerEvents: 'none' }}>
      <AnimatePresence>
        {segments.map(({ segment, paths }) => {
          // マイナーキーの判定
          const minorInfo = getHighlightInfo(segment.minorKey);
          // メジャーキーの判定
          const majorInfo = getHighlightInfo(segment.majorKey);

          return (
            <React.Fragment key={segment.position}>
              {/* マイナーキーのハイライト */}
              {minorInfo.shouldHighlight && (
                <HighlightPath
                  key={`${segment.position}-minor`}
                  path={paths.minorPath}
                  color={currentKeyColor}
                  isTonic={minorInfo.isTonic}
                />
              )}

              {/* メジャーキーのハイライト */}
              {majorInfo.shouldHighlight && (
                <HighlightPath
                  key={`${segment.position}-major`}
                  path={paths.majorPath}
                  color={currentKeyColor}
                  isTonic={majorInfo.isTonic}
                />
              )}
            </React.Fragment>
          );
        })}
      </AnimatePresence>
    </g>
  );
});

DiatonicHighlightLayer.displayName = 'DiatonicHighlightLayer';
