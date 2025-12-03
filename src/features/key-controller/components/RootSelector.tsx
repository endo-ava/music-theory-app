'use client';

import React from 'react';
import { PitchClass } from '@/domain/common';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

/**
 * RootSelectorのProps
 */
export interface RootSelectorProps {
  /** 現在選択されているRoot（Tonic） */
  value: PitchClass;
  /** Root変更時のコールバック */
  onValueChange: (pitchClass: PitchClass) => void;
  /** カスタムクラス名 */
  className?: string;
}

/**
 * Root Selector - 12音のドロップダウンセレクター
 *
 * 設計書準拠:
 * - 12の主音（C, C♯/D♭...）を検索・選択するためのドロップダウンメニュー
 * - 素早く目的の音を見つける「検索性」を重視
 *
 * @param props - コンポーネントのプロパティ
 * @returns RootSelectorのJSX要素
 */
export const RootSelector: React.FC<RootSelectorProps> = ({ value, onValueChange, className }) => {
  // PitchClassからstring、stringからPitchClassへの変換
  const handleValueChange = React.useCallback(
    (selectedValue: string) => {
      const selectedPitchClass = PitchClass.ALL_PITCH_CLASSES.find(
        pc => pc.sharpName === selectedValue || pc.flatName === selectedValue
      );
      if (selectedPitchClass) {
        onValueChange(selectedPitchClass);
      }
    },
    [onValueChange]
  );

  return (
    <Select value={value.sharpName} onValueChange={handleValueChange}>
      <SelectTrigger className={className} aria-label="Select Root">
        <SelectValue placeholder="Select a root..." />
      </SelectTrigger>
      <SelectContent className="shadow-lg">
        {PitchClass.ALL_PITCH_CLASSES.map(pitchClass => (
          <SelectItem
            key={pitchClass.sharpName}
            value={pitchClass.sharpName}
            className="hover:bg-accent focus:bg-accent transition-colors"
          >
            <span className="font-medium">{pitchClass.sharpName}</span>
            {pitchClass.flatName !== pitchClass.sharpName && (
              <span className="text-muted-foreground ml-1 text-xs">/ {pitchClass.flatName}</span>
            )}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
