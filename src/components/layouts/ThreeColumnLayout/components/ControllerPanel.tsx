import React from 'react';
import { twMerge } from 'tailwind-merge';

import { ViewController } from '@/features/view-controller';
import { ClassNameProps } from '@/shared/types';

/**
 * コントローラーパネル（左パネル）
 *
 * ViewControllerやその他のコントロール系機能を格納
 */
export const ControllerPanel: React.FC<ClassNameProps> = ({ className }) => {
  return (
    <aside
      className={twMerge(
        'bg-card border-border space-y-4 overflow-y-auto rounded-lg border p-6 backdrop-blur-sm',
        className
      )}
      aria-label="コントローラーパネル"
    >
      <h2 className="text-foreground hidden w-fit text-lg md:block">Controller</h2>

      {/* C-3: View Controller（ビュー・コントローラー） */}
      <ViewController />

      {/* 将来の拡張エリア: キー選択UI、設定・オプション等 */}
    </aside>
  );
};
