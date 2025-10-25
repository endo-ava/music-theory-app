import { ChromaticSegment } from './ChromaticSegment';
import { getChromaticCircleData } from '../utils/chromaticCircleData';
import type { ClassNameProps } from '@/shared/types';

/**
 * クロマチックサークル表示コンポーネント
 *
 * 12個のピッチクラス（C, C♯, D...）を半音階順に円形配置します。
 * ピザ型のセグメントで構成され、各セグメントにはピッチクラス名が表示されます。
 */
export const ChromaticCircle: React.FC<ClassNameProps> = ({ className }) => {
  const { viewBox, segments } = getChromaticCircleData();

  return (
    <div className={className}>
      <svg
        viewBox={viewBox}
        className="block"
        aria-label="Chromatic Circle"
        role="img"
        style={{ overflow: 'visible' }}
      >
        {segments.map(({ segment, paths, textPosition }) => (
          <ChromaticSegment
            key={segment.position}
            segment={segment}
            paths={paths}
            textPosition={textPosition}
          />
        ))}
      </svg>
    </div>
  );
};
