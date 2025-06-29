import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
import KeyInfoDisplay from './KeyInfoDisplay';
import { CircleSegment } from './CircleSegment';
import { useCircleOfFifths } from '../hooks/useCircleOfFifths';

/**
 * 五度圏メインコンポーネントのProps
 */
export interface CircleOfFifthsProps {
  /** カスタムクラス名 */
  className?: string;
  /** カスタムスタイル */
  style?: React.CSSProperties;
}

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
export const CircleOfFifths: React.FC<CircleOfFifthsProps> = ({ className, style }) => {
  // カスタムフックからサークルセグメント絵画情報を取得
  const { viewBox, segments, textRotation } = useCircleOfFifths();

  return (
    <div
      className={twMerge(
        clsx(
          'relative flex items-center justify-center',
          'w-[70vw] h-[70vw] max-w-[700px] max-h-[700px]'
        ),
        className
      )}
      style={style}
    >
      <div className="w-full h-full">
        <svg viewBox={viewBox} className="block" aria-label="五度圏" role="img">
          {/* 各セグメント絵画をループで呼び出す */}
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

      {/* キー情報表示エリア */}
      <KeyInfoDisplay />
    </div>
  );
};
