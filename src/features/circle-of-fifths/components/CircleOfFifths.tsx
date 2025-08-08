import { CircleSegment } from './CircleSegment';
import { useCircleOfFifths } from '../hooks/useCircleOfFifths';
import { ClassNameProps } from '@/shared/types';

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
  // カスタムフックからサークルセグメント描画情報を取得
  const { viewBox, segments, textRotation } = useCircleOfFifths();

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
      </svg>
    </div>
  );
};
