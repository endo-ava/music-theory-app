import { memo } from 'react';
import type { Point, ChromaticSegmentDTO, ChromaticSegmentPaths } from '../types';

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
 */
export const ChromaticSegment = memo<ChromaticSegmentProps>(({ segment, paths, textPosition }) => {
  return (
    <g>
      {/* ピッチクラス表示エリア（90px～175px）- 五度圏のメジャーキーと同じ色 */}
      <path d={paths.pitchPath} className="fill-key-area-major stroke-border border" />

      {/* 調号エリア（175px～200px）- 外側の装飾リング */}
      <path d={paths.signaturePath} className="fill-key-area-signature stroke-border border" />

      {/* ピッチクラス名（Domain層がフォーマット済み） */}
      <text
        className="fill-foreground text-key-major font-key-major"
        x={textPosition.x}
        y={textPosition.y}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ pointerEvents: 'none' }}
      >
        {segment.pitchClassName}
      </text>
    </g>
  );
});

ChromaticSegment.displayName = 'ChromaticSegment';
