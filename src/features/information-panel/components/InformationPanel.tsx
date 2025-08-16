import { ClassNameProps } from '@/shared/types';
import { twMerge } from 'tailwind-merge';
import { LayerConceptArea } from './LayerConceptArea';
import { SelectedElementArea } from './SelectedElementArea';

/**
 * 選択情報パネル (Information Panel) コンポーネント
 *
 * Canvas上のインタラクションと、レイヤーコントローラーでの選択、
 * その両方に応じて動的に情報を提示する。
 * 学習の「全体（概念）」と「部分（具体物）」をシームレスに繋ぐ、
 * コンテキストに応じた情報ハブとして機能する。
 *
 * パネルは役割が異なる以下の2つのエリアに明確に分割される：
 * - レイヤー概念エリア (上段): 現在アクティブなレイヤーの概念説明
 * - 選択要素エリア (下段): Canvas上で選択した具体的な要素の詳細情報
 *
 * @param props - コンポーネントのプロパティ
 * @returns InformationPanel のJSX要素
 */
export const InformationPanel: React.FC<ClassNameProps> = ({ className }) => {
  return (
    <div className={twMerge('space-y-4', className)} aria-label="選択情報パネル">
      {/* Component Title - モバイルでは非表示、md以上で表示 */}
      <h2 className="text-foreground hidden text-lg md:block">Infomation</h2>

      {/* C-1-1: レイヤー概念エリア (上段) */}
      <LayerConceptArea />

      {/* C-1-2: 選択要素エリア (下段) */}
      <SelectedElementArea />
    </div>
  );
};
