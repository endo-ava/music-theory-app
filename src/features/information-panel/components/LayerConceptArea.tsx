import { ClassNameProps } from '@/shared/types';
import { twMerge } from 'tailwind-merge';

/**
 * レイヤー概念エリアコンポーネント
 *
 * 現在アクティブになっているレイヤーが何であるかを簡潔に提示する。
 * レイヤー・コントローラーで何らかのレイヤー（トグルスイッチ）をONにした際に表示が更新される。
 *
 * @param props - コンポーネントのプロパティ
 * @returns LayerConceptArea のJSX要素
 */
export const LayerConceptArea: React.FC<ClassNameProps> = ({ className }) => {
  return (
    <div
      className={twMerge(
        'bg-muted/50 border-accent space-y-2 rounded-lg border-l-4 p-4',
        className
      )}
      aria-label="レイヤー概念エリア"
    >
      <h3 className="text-foreground text-sm font-semibold">レイヤー概念</h3>
      <p className="text-muted-foreground text-xs leading-relaxed">
        レイヤー情報を表示します。レイヤー・コントローラーでトグルを有効にすると、ここに選択されたレイヤーの概念説明が表示されます。
      </p>
    </div>
  );
};
