'use client';

import { memo, useEffect, useRef, useState } from 'react';
import { useMotionValue, useSpring } from 'motion/react';
import { useCircleOfFifthsStore } from '@/stores/circleOfFifthsStore';
import { useDragRotation } from '../hooks/useDragRotation';
import { CircleSegment } from './CircleSegment';
import { DiatonicHighlightLayer } from './DiatonicHighlightLayer';
import { DegreeLayer } from './DegreeLayer';
import { FunctionalHarmonyLayer } from './FunctionalHarmonyLayer';
import { RippleLayer } from './RippleLayer';
import { SegmentData } from '../utils/circleOfFifthsData';

interface CircleOfFifthsClientProps {
  viewBox: string;
  segments: SegmentData[];
}

/**
 * 五度圏のクライアントコンポーネント（Client Component）
 *
 * SVG要素とその内部の回転グループを管理します。
 * ドラッグ操作による回転、スプリングアニメーション、各種レイヤーを統合。
 * 親のCircleOfFifthsはサーバーコンポーネントとして維持できます。
 */
export const CircleOfFifthsClient: React.FC<CircleOfFifthsClientProps> = memo(
  ({ viewBox, segments }) => {
    // SVG要素への参照（ドラッグ回転の座標計算に使用）
    const svgRef = useRef<SVGSVGElement>(null);

    // グループ要素への参照
    const groupRef = useRef<SVGGElement>(null);

    // 回転インデックスを取得して回転角度を計算
    const { rotationIndex, setRotationIndex } = useCircleOfFifthsStore();

    // ドラッグ回転機能を有効化
    const { isDragging, handlers } = useDragRotation({
      svgRef,
      currentRotationIndex: rotationIndex,
      onRotationChange: setRotationIndex,
    });

    // C(0)を基準に、rotationIndex分だけ回転
    // 1セグメント = 30度
    // rotationIndexが増えると（右ボタン）、反時計回りに回転して次のキーが上に来る
    const targetAngle = -(rotationIndex * 30);

    // useMotionValueで回転角度を管理（ネイティブSVG transformを使用）
    const rotation = useMotionValue(targetAngle);
    const smoothRotation = useSpring(rotation, { stiffness: 50, damping: 20 });

    // テキスト回転角度を管理（円の回転を打ち消してテキストを垂直に保つ）
    const [currentTextRotation, setCurrentTextRotation] = useState(-targetAngle);

    // rotationIndexが変わったら回転角度を更新
    useEffect(() => {
      rotation.set(targetAngle);
    }, [targetAngle, rotation]);

    // スプリング値の変化を購読してSVGのtransform属性を直接更新
    // 同時にテキストの回転角度も更新（円の回転を打ち消す）
    useEffect(() => {
      const unsubscribe = smoothRotation.on('change', (value: number) => {
        if (groupRef.current) {
          // SVGネイティブのtransform属性を使用（原点は常に(0,0)）
          groupRef.current.setAttribute('transform', `rotate(${value})`);
        }
        // テキストの回転角度を円の回転の逆に設定（円の回転を打ち消してテキストを垂直に保つ）
        setCurrentTextRotation(-value);
      });

      // 初期値を設定
      if (groupRef.current) {
        groupRef.current.setAttribute('transform', `rotate(${smoothRotation.get()})`);
      }
      // 初期テキスト回転も同じ計算式を使用（円の回転を打ち消してテキストを垂直に保つ）
      setCurrentTextRotation(-smoothRotation.get());

      return unsubscribe;
    }, [smoothRotation]);

    return (
      <svg
        ref={svgRef}
        viewBox={viewBox}
        className="block h-full w-full"
        aria-label="Circle of Fifths"
        role="img"
        style={{
          overflow: 'visible',
          touchAction: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none',
        }}
      >
        <g
          ref={groupRef}
          {...handlers}
          style={{
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: 'none',
            WebkitUserSelect: 'none',
          }}
        >
          {/* 各セグメント描画をループで呼び出す */}
          {segments.map(({ segment, paths, textPositions }) => (
            <CircleSegment
              key={segment.position}
              segment={segment}
              paths={paths}
              textPositions={textPositions}
              // コンテナの回転を打ち消すために逆回転を渡す（スプリングアニメーション適用済み）
              textRotation={currentTextRotation}
            />
          ))}

          {/* ダイアトニックハイライトレイヤー（ボーダーハイライト） */}
          <DiatonicHighlightLayer />

          {/* 度数レイヤー（ローマ数字表記） */}
          <DegreeLayer textRotation={currentTextRotation} />

          {/* 機能和声レイヤー（T/D/SD文字表示） */}
          <FunctionalHarmonyLayer textRotation={currentTextRotation} />

          {/* リップルレイヤー（最前面に描画） */}
          <RippleLayer />
        </g>
      </svg>
    );
  }
);

CircleOfFifthsClient.displayName = 'CircleOfFifthsClient';
