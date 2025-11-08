'use client';

import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

/**
 * RelativeModeSliderコンポーネントのProps
 */
export interface RelativeModeSliderProps {
  /** 現在選択されているモードのインデックス (0-6) */
  value: number;
  /** モード変更時のコールバック */
  onValueChange: (modeIndex: number) => void;
  /** カスタムクラス名 */
  className?: string;
}

/**
 * ディグリー情報: ローマ数字、モード名、親キーからのディグリー
 */
const DEGREE_INFO = [
  { roman: 'I', mode: 'Ionian', degree: '1st' },
  { roman: 'ii', mode: 'Dorian', degree: '2nd' },
  { roman: 'iii', mode: 'Phrygian', degree: '3rd' },
  { roman: 'IV', mode: 'Lydian', degree: '4th' },
  { roman: 'V', mode: 'Mixolydian', degree: '5th' },
  { roman: 'vi', mode: 'Aeolian', degree: '6th' },
  { roman: 'vii°', mode: 'Locrian', degree: '7th' },
] as const;

/**
 * Relative Mode用のモード選択スライダー
 *
 * Relative Mode（平行調選択方式）において、親メジャーキーのダイアトニックモードを選択します。
 * 各モードは親キーの構成音の何度目から始まるかをディグリーネーム（ローマ数字）で表示します。
 *
 * 特徴:
 * - ディグリーネーム（I, ii, iii...）表示により、親キーとの関係性を視覚化
 * - ツールチップでモード名と開始度数を表示
 * - グラデーション背景でモードの明暗を表現（Major → minor）
 *
 * @param props - コンポーネントのプロパティ
 * @returns RelativeModeSliderのJSX要素
 */
export const RelativeModeSlider: React.FC<RelativeModeSliderProps> = ({
  value,
  onValueChange,
  className,
}) => {
  // ツールチップ表示状態
  const [hoveredModeIndex, setHoveredModeIndex] = React.useState<number | null>(null);
  const sliderRef = React.useRef<HTMLDivElement>(null);

  // スライダーの値変更ハンドラー（step=1なので整数値のみ）
  const handleValueChange = React.useCallback(
    (values: number[]) => {
      if (values.length > 0) {
        onValueChange(values[0]);
      }
    },
    [onValueChange]
  );

  // マウス位置からモードインデックスを計算
  const handleMouseMove = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const modeIndex = Math.round(percentage * 6);
    setHoveredModeIndex(modeIndex);
  }, []);

  const handleMouseLeave = React.useCallback(() => {
    setHoveredModeIndex(null);
  }, []);

  return (
    <TooltipProvider delayDuration={0}>
      <div className={className}>
        {/* スライダー本体 */}
        <div
          ref={sliderRef}
          className="relative cursor-pointer"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* グラデーション背景トラック */}
          <div
            className="pointer-events-none absolute inset-x-0 h-2 rounded-full opacity-40"
            style={{
              background:
                'linear-gradient(to right, #fbbf24 0%, #f59e0b 20%, #84cc16 40%, #22c55e 60%, #3b82f6 80%, #8b5cf6 100%)',
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          />

          {/* Shadcn/ui Slider */}
          <Slider
            value={[value]}
            onValueChange={handleValueChange}
            min={0}
            max={6}
            step={1}
            className="relative [&_[data-slot=slider-thumb]]:size-4 [&_[data-slot=slider-thumb]]:border-2 [&_[data-slot=slider-thumb]]:shadow-lg [&_[data-slot=slider-thumb]]:hover:ring-2 [&_[data-slot=slider-thumb]]:focus-visible:ring-2 [&_[data-slot=slider-track]]:h-2 [&_[data-slot=slider-track]]:bg-transparent"
          />

          {/* ホバー時のツールチップ - ディグリー情報付き */}
          {hoveredModeIndex !== null && (
            <Tooltip open={true}>
              <TooltipTrigger asChild>
                <div
                  className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2"
                  style={{
                    left: `${(hoveredModeIndex / 6) * 100}%`,
                    transform: 'translateX(-50%)',
                  }}
                />
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="font-medium">{DEGREE_INFO[hoveredModeIndex].mode}</p>
                <p className="text-muted-foreground text-xs">
                  {DEGREE_INFO[hoveredModeIndex].degree} degree (
                  {DEGREE_INFO[hoveredModeIndex].roman})
                </p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        {/* ディグリーネームラベル - 2行表示（ローマ数字 + モード名） */}
        <div className="text-muted-foreground mt-3 flex justify-between text-xs">
          {DEGREE_INFO.map((info, index) => {
            const isMajor = info.mode === 'Ionian';
            const isMinor = info.mode === 'Aeolian';
            const modeLabel = isMajor ? 'Ion/Maj' : isMinor ? 'Aeo/Min' : info.mode.slice(0, 3);

            return (
              <button
                key={info.roman}
                onClick={() => onValueChange(index)}
                className={`text-secondary-foreground hover:text-foreground flex cursor-pointer flex-col items-center transition-colors ${
                  index === value ? 'text-foreground font-bold' : ''
                }`}
                type="button"
                aria-label={`Select ${info.mode} mode (${info.roman})`}
              >
                <span className="mb-1">{info.roman}</span>
                <span className="text-[10px]">{modeLabel}</span>
              </button>
            );
          })}
        </div>

        {/* 現在選択されているディグリー情報 */}
        <div className="text-muted-foreground mt-2 flex justify-between text-xs font-medium">
          <span>I</span>
          <span className="text-foreground text-center font-semibold">
            {DEGREE_INFO[value].roman} - {DEGREE_INFO[value].mode}
          </span>
          <span>vii°</span>
        </div>
      </div>
    </TooltipProvider>
  );
};
