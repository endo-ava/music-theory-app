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
              <div className="text-text-secondary text-sm">実装準備中</div>
            </div>
          </div>

          {/* 説明テキスト */}
          <div className="space-y-4">
            <h3 className="text-text-primary text-lg font-semibold">クロマチックサークル</h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              半音階で配置された音の輪を表示します。
              <br />
              12の音が等間隔で配置され、各音の関係性を
              <br />
              視覚的に理解することができます。
            </p>
            <div className="bg-background-muted mt-6 rounded-md p-4">
              <p className="text-text-muted text-xs">
                📝 このコンポーネントは現在開発中です。
                <br />
                将来的にはインタラクティブなクロマチックサークルが表示されます。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
