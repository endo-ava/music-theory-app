import { twMerge } from 'tailwind-merge';
import { ViewController } from './ViewController';
import type { SidePanelProps } from '../types';

/**
 * Side Panel サイドパネルコンポーネント
 *
 * Hub画面左側に配置されるサイドパネル。
 * 現在はViewController（C-1）のみを含み、将来的にLayerController（C-2）、
 * InformationPanel（C-3）が追加される予定。
 *
 * @param props - コンポーネントのプロパティ
 * @returns SidePanel のJSX要素
 */
export const SidePanel: React.FC<SidePanelProps> = ({ className, isVisible = true }) => {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="flex h-full justify-center">
      <aside className={twMerge('flex w-100 flex-col', className)} aria-label="サイドパネル">
        <section
          className="border-border bg-background-muted mt-8 overflow-y-auto rounded-lg border p-8 backdrop-blur-sm"
          aria-labelledby="side-panel-title"
        >
          {/* C-1: View Controller */}
          <ViewController />

          {/* 将来の拡張エリア */}
          {/* C-2: layer Controller */}
          {/* C-3: Information Panel */}
        </section>
      </aside>
    </div>
  );
};
