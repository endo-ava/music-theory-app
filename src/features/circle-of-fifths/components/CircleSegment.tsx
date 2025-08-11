'use client';

import { memo } from 'react';
import { motion } from 'motion/react';
import { ANIMATION } from '../constants/index';
import {
  calculateSignatureAreaDelay,
  calculateSignatureTextDelay,
  calculateKeyAnimationDelay,
  calculateTextAnimationDelay,
} from '../utils/animations';
import { KeyArea } from './KeyArea';
import type { Point, SegmentPaths } from '@/features/circle-of-fifths/types';
import { CircleSegmentDTO } from '@/domain/services/CircleOfFifths';

/**
 * セグメントコンポーネントのProps
 */
export interface CircleSegmentProps {
  /** セグメントの情報 */
  segment: CircleSegmentDTO;
  paths: SegmentPaths;
  textPositions: {
    minorTextPos: Point;
    majorTextPos: Point;
    signatureTextPos: Point;
  };
  textRotation: number;
}

/**
 * 五度圏のセグメントコンポーネント
 *
 * 各セグメントは3分割されており、内側から：
 * - マイナーキー（クリック可能）
 * - メジャーキー（クリック可能）
 * - 調号（表示のみ）
 * が表示されます。
 *
 * @param props - コンポーネントのプロパティ
 * @returns セグメントのJSX要素
 */
export const CircleSegment = memo<CircleSegmentProps>(
  ({ segment, paths, textPositions, textRotation }) => {
    const { position, minorKey, majorKey, keySignature } = segment;
    // アニメーション遅延を計算
    const signatureAreaDelay = calculateSignatureAreaDelay(position);
    const signatureTextDelay = calculateSignatureTextDelay(position);

    return (
      <g>
        {/* マイナーキーエリア（クリック可能） */}
        <KeyArea
          keyDTO={minorKey}
          segment={segment}
          path={paths.minorPath}
          textPosition={textPositions.minorTextPos}
          textRotation={textRotation}
          animationDelay={calculateKeyAnimationDelay(position, false)}
          textAnimationDelay={calculateTextAnimationDelay(position, false)}
        />

        {/* メジャーキーエリア（クリック可能） */}
        <KeyArea
          keyDTO={majorKey}
          segment={segment}
          path={paths.majorPath}
          textPosition={textPositions.majorTextPos}
          textRotation={textRotation}
          animationDelay={calculateKeyAnimationDelay(position, true)}
          textAnimationDelay={calculateTextAnimationDelay(position, true)}
        />

        {/* 調号エリア（表示のみ） */}
        <motion.path
          d={paths.signaturePath}
          className="fill-key-area-signature stroke-border border"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: ANIMATION.FADE_DURATION, delay: signatureAreaDelay }}
        />

        {/* 調号テキスト */}
        <motion.text
          className="fill-foreground text-key-signature font-key-signature stroke-border border"
          x={textPositions.signatureTextPos.x}
          y={textPositions.signatureTextPos.y}
          textAnchor="middle"
          dominantBaseline="middle"
          transform={`rotate(${textRotation} ${textPositions.signatureTextPos.x} ${textPositions.signatureTextPos.y})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: ANIMATION.FADE_DURATION, delay: signatureTextDelay }}
          style={{ pointerEvents: 'none' }} // テキストのクリックイベントを無効化
        >
          {/* keySignatureの文字列を'\n'で分割して、各行を<tspan>で描画する */}
          {keySignature.split('\n').map((line, index) => (
            <tspan
              key={index}
              x={textPositions.signatureTextPos.x} // 各行のx座標をリセット
              dy={index === 0 ? 0 : '1.2em'} // 2行目以降はdyで下にずらす
            >
              {line}
            </tspan>
          ))}
        </motion.text>
      </g>
    );
  }
);

// コンポーネントの表示名を設定（デバッグ用）
CircleSegment.displayName = 'CircleSegment';
