import { twMerge } from 'tailwind-merge';
import { ViewController } from '@/features/view-controller';
import type { ClassNameProps } from '@/shared/types';
import { InformationPanel } from '../../ThreeColumnLayout';

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
 * 3つのコンポーネントを上から順に配置：
 * C-1: InformationPanel（選択情報パネル）
 * C-2: LayerController（レイヤー・コントローラー）※将来実装
 * C-3: ViewController（ビュー・コントローラー）
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
        {/* C-1: Information Panel（情報パネル） */}
        <InformationPanel />

        {/* 将来の拡張エリア */}
        {/* C-2: Layer Controller（レイヤー・コントローラー） */}

        {/* C-3: View Controller（ビュー・コントローラー） */}
        <ViewController />
      </section>
    </aside>
  );
};
