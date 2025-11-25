import React from 'react';

interface CoordinateGridProps {
  size: number;
  scale?: number; // 現在のズームレベル
}

/**
 * ズームレベルに応じて適切なグリッド間隔を計算する
 * Level of Detail (LOD) を実装し、どのズームレベルでも適切な密度でグリッドを表示
 */
const getAdaptiveGridSize = (scale: number): number => {
  if (scale >= 1.0) return 100; // デフォルト: 100px
  if (scale >= 0.5) return 200; // 少しズームアウト: 200px
  if (scale >= 0.25) return 500; // 中程度ズームアウト: 500px
  if (scale >= 0.15) return 1000; // かなりズームアウト: 1000px
  return 2000; // 最大ズームアウト: 2000px
};

export const CoordinateGrid: React.FC<CoordinateGridProps> = ({ size, scale = 1 }) => {
  const center = size / 2;
  const gridSize = getAdaptiveGridSize(scale);

  // ズームレベルに応じて透明度を調整（ズームアウト時は薄く）
  const opacity = Math.max(0.15, Math.min(0.4, scale * 0.5));

  return (
    <div className="pointer-events-none absolute inset-0 select-none">
      <svg width={size} height={size} xmlns="http://www.w3.org/2000/svg" style={{ opacity }}>
        <defs>
          <pattern
            id={`grid-pattern-${gridSize}`}
            width={gridSize}
            height={gridSize}
            patternUnits="userSpaceOnUse"
            x={center % gridSize}
            y={center % gridSize}
          >
            <path
              d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          </pattern>
        </defs>

        {/* Grid Background */}
        <rect width="100%" height="100%" fill={`url(#grid-pattern-${gridSize})`} />

        {/* Axes */}
        <line
          x1={0}
          y1={center}
          x2={size}
          y2={center}
          stroke="red"
          strokeWidth="2"
          className="opacity-50"
          vectorEffect="non-scaling-stroke"
        />
        <line
          x1={center}
          y1={0}
          x2={center}
          y2={size}
          stroke="red"
          strokeWidth="2"
          className="opacity-50"
          vectorEffect="non-scaling-stroke"
        />

        {/* Origin Marker */}
        <circle cx={center} cy={center} r="5" fill="red" vectorEffect="non-scaling-stroke" />

        {/* Coordinate Labels - Show at appropriate intervals based on grid size */}

        {scale > 0.3 &&
          (() => {
            const labelInterval = gridSize * 5;
            // Calculate how many labels fit in half the size
            const maxLabelsPerSide = Math.floor(size / 2 / labelInterval);

            const labels = [];
            // Generate labels from negative to positive
            for (let i = -maxLabelsPerSide; i <= maxLabelsPerSide; i++) {
              const offset = i * labelInterval;
              if (offset === 0) continue; // Skip origin

              labels.push(
                <React.Fragment key={offset}>
                  {/* X Axis Labels */}
                  <text
                    x={center + offset}
                    y={center + 20}
                    fontSize="12"
                    fill="red"
                    textAnchor="middle"
                    vectorEffect="non-scaling-stroke"
                  >
                    {offset}
                  </text>
                  {/* Y Axis Labels */}
                  <text
                    x={center + 10}
                    y={center + offset + 4}
                    fontSize="12"
                    fill="red"
                    vectorEffect="non-scaling-stroke"
                  >
                    {offset}
                  </text>
                </React.Fragment>
              );
            }
            return labels;
          })()}
      </svg>
    </div>
  );
};
