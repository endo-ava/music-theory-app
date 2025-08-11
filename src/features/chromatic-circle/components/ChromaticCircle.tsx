import { ClassNameProps } from '@/shared/types';

/**
 * クロマチックサークル表示コンポーネント
 *
 * 半音階で配置された音の輪を表示します。
 * 現在は実装準備中のため、説明テキストのみを表示します。
 *
 * @param props - コンポーネントのプロパティ
 * @returns クロマチックサークルのJSX要素
 */
export const ChromaticCircle: React.FC<ClassNameProps> = ({ className }) => {
  return (
    <div className={className}>
      <div className="flex h-full w-full items-center justify-center">
        <div className="max-w-md text-center">
          {/* プレースホルダー円 */}
          <div className="border-border bg-background-muted mx-auto mb-8 flex h-48 w-48 items-center justify-center rounded-full border-2 border-dashed">
            <div className="text-center">
              <div className="mb-2 text-4xl">🎵</div>
              <div className="text-secondary-foreground text-sm">実装準備中</div>
            </div>
          </div>

          {/* 説明テキスト */}
          <div className="space-y-4">
            <h3 className="text-foreground text-lg font-semibold">クロマチックサークル</h3>
            <p className="text-secondary-foreground text-sm leading-relaxed">準備中</p>
          </div>
        </div>
      </div>
    </div>
  );
};
