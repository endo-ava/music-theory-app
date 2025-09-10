import React from 'react';
import { twMerge } from 'tailwind-merge';

import { SelectedElementInfo, CurrentKeyInfo } from '@/features/information-panel';
import { ClassNameProps } from '@/shared/types';

/**
 * 情報パネル（右パネル）
 *
 * SelectedElementInfo + CurrentKeyInfoを統合し、
 * 将来的な学習進捗・履歴等を格納
 */
export const InformationPanel: React.FC<ClassNameProps> = ({ className }) => {
  return (
    <aside
      className={twMerge(
        'bg-card border-border overflow-y-auto rounded-lg border p-2 backdrop-blur-sm md:p-6',
        className
      )}
      aria-label="情報パネル"
    >
      <h2 className="text-foreground hidden w-fit text-lg md:block">Information</h2>

      {/* C-1-1: 選択要素情報エリア (上段) */}
      <SelectedElementInfo />

      {/* C-1-2: 現在のキー情報エリア (下段) */}
      <CurrentKeyInfo />

      {/* 将来の拡張エリア: 学習進捗、履歴等 */}
    </aside>
  );
};
