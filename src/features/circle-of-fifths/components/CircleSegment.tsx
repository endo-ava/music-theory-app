import { memo } from 'react';
import { KeyArea } from './KeyArea';
import type { Point } from '@/shared/types/graphics';
import type { SegmentPaths } from '../types';
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
    const { minorKey, majorKey, keySignature } = segment;

    return (
      <g>
        {/* マイナーキーエリア（クリック可能） */}
        <KeyArea
          keyDTO={minorKey}
          segment={segment}
          path={paths.minorPath}
          textPosition={textPositions.minorTextPos}
          textRotation={textRotation}
        />

        {/* メジャーキーエリア（クリック可能） */}
        <KeyArea
          keyDTO={majorKey}
          segment={segment}
          path={paths.majorPath}
          textPosition={textPositions.majorTextPos}
          textRotation={textRotation}
        />

        {/* 調号エリア（表示のみ） */}
        <path d={paths.signaturePath} className="fill-key-area-signature stroke-border border" />

        {/* 調号テキスト */}
        <text
          className="fill-foreground/30 text-key-signature font-key-signature"
          x={0}
          y={0}
          textAnchor="middle"
          dominantBaseline="middle"
          transform={`translate(${textPositions.signatureTextPos.x}, ${textPositions.signatureTextPos.y}) rotate(${textRotation})`}
          style={{ pointerEvents: 'none' }}
        >
          {/* keySignatureの文字列を'\n'で分割して、各行を<tspan>で描画する */}
          {keySignature.split('\n').map((line, index) => (
            <tspan
              key={index}
              x={0} // 各行のx座標をリセット（translate基準）
              dy={index === 0 ? 0 : '1.2em'} // 2行目以降はdyで下にずらす
            >
              {line}
            </tspan>
          ))}
        </text>
      </g>
    );
  }
);

// コンポーネントの表示名を設定（デバッグ用）
CircleSegment.displayName = 'CircleSegment';
