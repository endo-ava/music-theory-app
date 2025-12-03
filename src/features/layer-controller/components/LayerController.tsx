import React from 'react';
import { Layers } from 'lucide-react';
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
      <div className="flex items-center gap-2">
        <Layers className="text-muted-foreground h-4 w-4" />
        <h2 className="text-foreground text-sm font-semibold tracking-wider uppercase">Layer</h2>
      </div>

      {/* アコーディオン2: コードレイヤー */}
      <ChordLayerAccordion />
    </div>
  );
};
