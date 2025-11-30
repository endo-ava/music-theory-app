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
  const sectionClassName = 'bg-transparent border-none shadow-none p-0';
  const divider = <div className="h-px w-full bg-white/10" />;

  return (
    <aside
      className={twMerge(
        'md:bg-panel md:border-border scrollbar-hide space-y-6 overflow-y-auto border-transparent bg-transparent p-6 md:rounded-xl md:border md:backdrop-blur-xl',
        className
      )}
      aria-label="コントローラーパネル"
    >
      <div className="hidden items-center gap-2 md:flex">
        <div className="bg-primary/20 text-primary flex h-6 w-6 items-center justify-center rounded-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M12 2v20" />
            <path d="M2 12h20" />
            <circle cx="12" cy="12" r="10" />
          </svg>
        </div>
        <h2 className="text-foreground text-lg font-semibold tracking-tight">Controller</h2>
      </div>

      {divider}

      {/* C-1: View Controller（ビュー・コントローラー） */}
      <ViewController className={sectionClassName} />

      {divider}

      {/* C-2: Key Controller（キー・コントローラー） */}
      <KeyController className={sectionClassName} />

      {divider}

      {/* C-3: Layer Controller（レイヤー・コントローラー） */}
      <LayerController className={sectionClassName} />

      {/* 将来の拡張エリア: 設定・オプション等 */}
    </aside>
  );
};
