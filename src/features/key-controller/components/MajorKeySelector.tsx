'use client';

import React from 'react';
import { Key } from '@/domain/key';
import { PitchClass } from '@/domain/common';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

/**
 * MajorKeySelectorコンポーネントのProps
 */
export interface MajorKeySelectorProps {
  /** 現在選択されている親メジャーキー */
  value: Key;
  /** 親メジャーキー変更時のコールバック */
  onValueChange: (majorKey: Key) => void;
  /** カスタムクラス名 */
  className?: string;
}

/**
 * 12のメジャーキーを選択するためのドロップダウンメニュー（Relative Mode用）
 *
 * Relative Mode（平行調選択方式）において、親となるメジャーキーを選択します。
 * 選択されたメジャーキーの構成音から、各モードの主音が決定されます。
 *
 * @param props - コンポーネントのプロパティ
 * @returns MajorKeySelectorのJSX要素
 */
export const MajorKeySelector: React.FC<MajorKeySelectorProps> = ({
  value,
  onValueChange,
  className,
}) => {
  // Keyからstring、stringからKeyへの変換
  const handleValueChange = React.useCallback(
    (selectedValue: string) => {
      const selectedPitchClass = PitchClass.ALL_PITCH_CLASSES.find(
        pc => pc.sharpName === selectedValue || pc.flatName === selectedValue
      );
      if (selectedPitchClass) {
        onValueChange(Key.major(selectedPitchClass));
      }
    },
    [onValueChange]
  );

  // 現在選択されているメジャーキーの主音名を取得
  const currentTonicName = value.centerPitch.sharpName;

  return (
    <Select value={currentTonicName} onValueChange={handleValueChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder="Select a major key..." />
      </SelectTrigger>
      <SelectContent className="bg-panel border-border shadow-lg">
        {PitchClass.ALL_PITCH_CLASSES.map(pitchClass => {
          const majorKey = Key.major(pitchClass);
          const keySignature = majorKey.keySignature;

          // 調号の表記を取得（ドメインロジック）
          const signatureStr = keySignature.getSignatureNotation();

          return (
            <SelectItem
              key={pitchClass.sharpName}
              value={pitchClass.sharpName}
              className="hover:bg-accent focus:bg-accent transition-colors"
            >
              <span className="font-medium">{pitchClass.sharpName} Major</span>
              <span className="text-muted-foreground ml-2 text-xs">({signatureStr})</span>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};
