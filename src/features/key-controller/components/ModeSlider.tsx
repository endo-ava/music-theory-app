'use client';

import React from 'react';
import { ScalePattern } from '@/domain/common';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

/**
 * ModeSelectorのProps
 */
export interface ModeSliderProps {
  /** 現在選択されているモードのインデックス (0-6) */
  value: number;
  /** モード変更時のコールバック */
  onValueChange: (modeIndex: number) => void;
  /** カスタムクラス名 */
  className?: string;
}

/**
 * Mode Slider - 7つのモードをスライダーで選択
 *
 * 設計書準拠:
 * - 7つのモード（Lydian, Ionian...）を「#多（シャープ系）」から「♭多（フラット系）」への連続的な変化として表現
 * - 背景グラデーション: 調号の特性（#/♭）を視覚的に表現
 * - スナップ動作: 離したときに最も近い整数値（モード）に吸着
 * - ラベル表記: 客観的事実（調号特性）を優先し、解釈的表現（明暗）は使用しない
 *
 * @param props - コンポーネントのプロパティ
 * @returns ModeSliderのJSX要素
 */
export const ModeSlider: React.FC<ModeSliderProps> = ({ value, onValueChange, className }) => {
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

  // 現在のモード名を取得
  const currentModeName = ScalePattern.MAJOR_MODES_BY_BRIGHTNESS[value].name;

  // 全モード名リスト（ラベル表示用）
  const modeLabels = ScalePattern.MAJOR_MODES_BY_BRIGHTNESS.map(pattern => pattern.name);

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
                'linear-gradient(to right, var(--color-mode-ionian) 0%, var(--color-mode-dorian) 17%, var(--color-mode-phrygian) 33%, var(--color-mode-lydian) 50%, var(--color-mode-mixolydian) 67%, var(--color-mode-aeolian) 83%, var(--color-mode-locrian) 100%)',
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          />

          {/* Sliderコンポーネント - Thumbサイズ拡大 */}
          <Slider
            value={[value]}
            onValueChange={handleValueChange}
            min={0}
            max={6}
            step={1}
            className="relative [&_[data-slot=slider-thumb]]:size-4 [&_[data-slot=slider-thumb]]:border-2 [&_[data-slot=slider-thumb]]:shadow-lg [&_[data-slot=slider-thumb]]:hover:ring-2 [&_[data-slot=slider-thumb]]:focus-visible:ring-2 [&_[data-slot=slider-track]]:h-2 [&_[data-slot=slider-track]]:bg-transparent"
          />

          {/* ホバー時のツールチップ */}
          {hoveredModeIndex !== null && (
            <Tooltip open={true}>
              <TooltipTrigger asChild>
                <div
                  className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2"
                  style={{
                    left: `${(hoveredModeIndex / 6) * 100}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                />
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="font-medium">
                  {modeLabels[hoveredModeIndex] === 'Major'
                    ? 'Ionian / Major'
                    : modeLabels[hoveredModeIndex] === 'Minor'
                      ? 'Aeolian / Minor'
                      : modeLabels[hoveredModeIndex]}
                </p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        {/* モード名ラベル - クリック可能 */}
        <div className="text-muted-foreground mt-3 flex justify-between text-xs">
          {modeLabels.map((label, index) => {
            const isMajor = label === 'Major';
            const isMinor = label === 'Minor';
            const isSelected = index === value;
            const displayLabel = isMajor ? 'Ion/Maj' : isMinor ? 'Aeo/Min' : label.slice(0, 3);

            return (
              <button
                key={label}
                type="button"
                onClick={() => onValueChange(index)}
                className={`hover:text-foreground cursor-pointer transition-colors ${
                  isSelected ? 'text-foreground font-bold' : ''
                }`}
              >
                {displayLabel}
              </button>
            );
          })}
        </div>

        {/* 調号ラベル（シャープ/フラット） */}
        <div className="text-muted-foreground mt-2 flex justify-between text-xs font-medium">
          <span>#</span>
          <span className="text-foreground text-center font-semibold">{currentModeName}</span>
          <span>♭</span>
        </div>
      </div>
    </TooltipProvider>
  );
};
