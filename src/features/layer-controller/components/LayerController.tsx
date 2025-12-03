import React from 'react';
import { twMerge } from 'tailwind-merge';
import { ClassNameProps } from '@/shared/types';

import { ChordLayerAccordion } from './ChordLayerAccordion';

/**
 * レイヤーコントローラーのメインコンポーネント
 *
 * 音楽理論の各レイヤー（スケール、コード、関係性）の表示制御を行う。
 * 現在はコードレイヤーのダイアトニックコード表示のみ実装。
 */
export const LayerController: React.FC<ClassNameProps> = ({ className }) => {
  return (
    <div
      className={twMerge(
        'border-border bg-card space-y-2 rounded-lg border p-4 shadow-sm',
        className
      )}
    >
      <h2 className="text-foreground hidden text-lg font-semibold md:block">Layer</h2>

      {/* アコーディオン2: コードレイヤー */}
      <ChordLayerAccordion />
    </div>
  );
};
