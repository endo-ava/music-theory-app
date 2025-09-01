import React from 'react';
import { twMerge } from 'tailwind-merge';

import { SelectedElementArea, LayerConceptArea } from '@/features/information-panel';
import { ClassNameProps } from '@/shared/types';

/**
 * 情報パネル（右パネル）
 *
 * SelectedElementArea + LayerConceptAreaを統合し、
 * 将来的な学習進捗・履歴等を格納
 */
export const InformationPanel: React.FC<ClassNameProps> = ({ className }) => {
  return (
    <aside
      className={twMerge(
        'bg-card border-border space-y-4 overflow-y-auto rounded-lg border p-6 backdrop-blur-sm',
        className
      )}
      aria-label="情報パネル"
    >
      <h2 className="text-foreground hidden w-fit text-lg md:block">Information</h2>

      {/* C-1-1: 選択要素エリア (上段) */}
      <SelectedElementArea />

      {/* C-1-2: レイヤー概念エリア (下段) */}
      <LayerConceptArea />

      {/* 将来の拡張エリア: 学習進捗、履歴等 */}
    </aside>
  );
};
