'use client';

import { memo } from 'react';
import { motion } from 'motion/react';
import { CircleSegmentProps } from '../types/props';
import { ANIMATION } from '../constants/index';
import { KeyArea } from './KeyArea';

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
export const CircleSegment = memo<CircleSegmentProps>(({
  segment,
  paths,
  textPositions,
  textRotation,
}) => {
  const { position, minorKey, majorKey, keySignature } = segment;
  // アニメーション遅延を計算
  const baseDelay = position * ANIMATION.BASE_DELAY;

  return (
    <g>
      {/* マイナーキーエリア（クリック可能） */}
      <KeyArea
        keyName={minorKey}
        isMajor={false}
        segment={segment}
        path={paths.minorPath}
        textPosition={textPositions.minorTextPos}
        textRotation={textRotation}
      />

      {/* メジャーキーエリア（クリック可能） */}
      <KeyArea
        keyName={majorKey}
        isMajor={true}
        segment={segment}
        path={paths.majorPath}
        textPosition={textPositions.majorTextPos}
        textRotation={textRotation}
      />

      {/* 調号エリア（表示のみ） */}
      <motion.path
        d={paths.signaturePath}
        className={"fill-key-area-signature stroke-border border"}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: ANIMATION.FADE_DURATION, delay: baseDelay + 0.2 }}
      />

      {/* 調号テキスト */}
      <motion.text
        className={" fill-text-primary text-key-signature font-key-signature stroke-border border"}
        x={textPositions.signatureTextPos.x}
        y={textPositions.signatureTextPos.y}
        textAnchor="middle"
        dominantBaseline="middle"
        transform={`rotate(${textRotation} ${textPositions.signatureTextPos.x} ${textPositions.signatureTextPos.y})`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: ANIMATION.FADE_DURATION, delay: baseDelay + 0.5 }}
        style={{ pointerEvents: 'none' }} // テキストのクリックイベントを無効化
      >
        {/* keySignatureの文字列を'\n'で分割して、各行を<tspan>で描画する */}
        {keySignature.split('\n').map((line, index) => (
          <tspan
            key={index}
            x={textPositions.signatureTextPos.x} // 各行のx座標をリセット
            dy={index === 0 ? 0 : '1.2em'}     // 2行目以降はdyで下にずらす
          >
            {line}
          </tspan>
        ))}
      </motion.text>
    </g>
  );
});

// コンポーネントの表示名を設定（デバッグ用）
CircleSegment.displayName = 'CircleSegment'; 