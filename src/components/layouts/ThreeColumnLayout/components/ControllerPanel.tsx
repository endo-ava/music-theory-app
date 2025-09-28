import React from 'react';
import { twMerge } from 'tailwind-merge';

import { ViewController } from '@/features/view-controller';
import { KeyController } from '@/features/key-controller';
import { LayerController } from '@/features/layer-controller';
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
        'md:bg-card md:border-border space-y-4 overflow-y-auto border-transparent bg-transparent p-6 md:rounded-lg md:border md:backdrop-blur-sm',
        className
      )}
      aria-label="コントローラーパネル"
    >
      <h2 className="text-foreground hidden w-fit text-lg md:block">Controller</h2>

      {/* C-1: View Controller（ビュー・コントローラー） */}
      <ViewController />

      {/* C-2: Key Controller（キー・コントローラー） */}
      <KeyController />

      {/* C-3: Layer Controller（レイヤー・コントローラー） */}
      <LayerController className="md:py-6" />

      {/* 将来の拡張エリア: 設定・オプション等 */}
    </aside>
  );
};
