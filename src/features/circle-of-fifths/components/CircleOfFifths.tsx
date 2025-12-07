import { CircleSegment } from './CircleSegment';
import { DiatonicHighlightLayer } from './DiatonicHighlightLayer';
import { DegreeLayer } from './DegreeLayer';
import { FunctionalHarmonyLayer } from './FunctionalHarmonyLayer';
import { RippleLayer } from './RippleLayer';
import { ProgressionLayer } from './ProgressionLayer';
import { getCircleOfFifthsData } from '../utils/circleOfFifthsData';
import { ClassNameProps } from '@/types';

/**
 * 五度圏表示コンポーネント
 *
 * 五度圏を円形に表示し、各セグメントのホバー時に情報を表示します。
 * 円形を12分割し、各セグメントは3分割されて内側からマイナーキー、メジャーキー、調号を表示します。
 * メジャーキーとマイナーキーは個別にクリック可能です。
 *
 * @param props - コンポーネントのプロパティ
 * @returns 五度圏のJSX要素
 */
export const CircleOfFifths: React.FC<ClassNameProps> = ({ className }) => {
  // サークルセグメント描画情報を取得
  const { viewBox, segments, textRotation } = getCircleOfFifthsData();

  return (
    <div className={className}>
      <svg
        viewBox={viewBox}
        className="block"
        aria-label="Circle of Fifths"
        role="img"
        style={{ overflow: 'visible' }}
      >
        {/* 各セグメント描画をループで呼び出す */}
        {segments.map(({ segment, paths, textPositions }) => (
          <CircleSegment
            key={segment.position}
            segment={segment}
            paths={paths}
            textPositions={textPositions}
            textRotation={textRotation}
          />
        ))}

        {/* ダイアトニックハイライトレイヤー（ボーダーハイライト） */}
        <DiatonicHighlightLayer />

        {/* 度数レイヤー（ローマ数字表記） */}
        <DegreeLayer />

        {/* 機能和声レイヤー（T/D/SD文字表示） */}
        <FunctionalHarmonyLayer />

        {/* 進行（プログレッション）レイヤー（矢印アニメーション） */}
        <ProgressionLayer />

        {/* リップルレイヤー（最前面に描画） */}
        <RippleLayer />
      </svg>
    </div>
  );
};
