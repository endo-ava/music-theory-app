import React from 'react';
import { Info } from 'lucide-react';
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
  const divider = <div className="h-px w-full bg-white/10" />;

  return (
    <aside
      className={twMerge(
        'md:bg-panel md:border-border scrollbar-hide space-y-4 overflow-y-auto border-transparent bg-transparent p-6 md:rounded-xl md:border md:backdrop-blur-xl',
        className
      )}
      aria-label="情報パネル"
    >
      <div className="hidden items-center gap-2 md:flex">
        <div className="bg-primary/20 text-primary flex h-6 w-6 items-center justify-center rounded-md">
          <Info className="h-4 w-4" />
        </div>
        <h2 className="text-foreground text-lg font-semibold tracking-tight">Information</h2>
      </div>

      {divider}

      {/* C-1-1: 選択要素情報エリア (上段) */}
      <SelectedElementInfo />

      {divider}

      {/* C-1-2: 現在のキー情報エリア (下段) */}
      <CurrentKeyInfo />

      {/* 将来の拡張エリア: 学習進捗、履歴等 */}
    </aside>
  );
};
