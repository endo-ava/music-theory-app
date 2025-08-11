import { twMerge } from 'tailwind-merge';
import { ViewController } from '@/features/view-controller';
import type { ClassNameProps } from '@/shared/types';

/**
 * Side Panel コンポーネントのProps
 */
export interface SidePanelProps extends ClassNameProps {
  /** パネルの表示状態 */
  isVisible?: boolean;
}

/**
 * Side Panel サイドパネルコンポーネント
 *
 * Hub画面左側に配置されるサイドパネル。
 * 現在はViewController（C-1）のみを含み、将来的にLayerController（C-2）、
 * InformationPanel（C-3）が追加される予定。
 * レイアウトサイズは外部制御、内部は描画責任のみ
 *
 * @param props - コンポーネントのプロパティ
 * @param props.className - カスタムクラス名（外部レイアウト制御用）
 * @param props.isVisible - パネルの表示状態（デフォルト: true）
 * @returns SidePanel のJSX要素
 */
export const SidePanel: React.FC<SidePanelProps> = ({ className, isVisible = true }) => {
  if (!isVisible) {
    return null;
  }

  return (
    <aside
      className={twMerge(
        // 内部制御：基本的な見た目とレイアウト構造
        'flex flex-col',
        // 外部制御：サイズや配置は親が決定
        className
      )}
      aria-label="サイドパネル"
    >
      <section
        className="border-border bg-card overflow-y-auto rounded-lg border p-8 backdrop-blur-sm"
        aria-label="コントロールパネル"
      >
        {/* C-1: View Controller（クライアントコンポーネント） */}
        <ViewController />

        {/* 将来の拡張エリア */}
        {/* C-2: Layer Controller */}
        {/* C-3: Information Panel */}
      </section>
    </aside>
  );
};
