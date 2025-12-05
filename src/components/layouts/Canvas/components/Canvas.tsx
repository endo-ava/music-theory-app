import { twMerge } from 'tailwind-merge';
import { CircleOfFifths } from '@/features/circle-of-fifths';
import { CurrentKeyDisplay } from './CurrentKeyDisplay';
import { HubTypeController } from './HubTypeController';
import { ClassNameProps } from '@/shared/types';
import { ChromaticCircle } from '@/features/chromatic-circle';

/**
 * メイン表示エリア（Canvas）コンポーネント
 *
 * インタラクティブ・ハブ画面のメイン表示エリアを提供します。
 * HubTypeに応じて五度圏またはクロマチックサークルを表示します。
 *
 * @param props - コンポーネントのプロパティ
 * @returns Canvas のJSX要素
 */
export const Canvas: React.FC<ClassNameProps> = ({ className }) => {
  return (
    <main
      className={twMerge(
        'md:border-border flex h-full min-h-[300px] w-full flex-col overflow-auto rounded-lg p-4 md:min-h-[400px] md:border md:p-6',
        className
      )}
      aria-label="メイン表示エリア"
    >
      {/* 現在のベースキー表示 */}
      <div className="text-center">
        <CurrentKeyDisplay />
      </div>

      {/* 固定間隔 */}
      <div className="h-1 flex-shrink-0 lg:h-4"></div>

      {/* Hub コンポーネント表示 */}
      <div
        className="hub-container flex items-center justify-center"
        data-hub-type="circle-of-fifths"
      >
        {/* B-1: 五度圏 */}
        <CircleOfFifths className="hub-circle-of-fifths h-[350px] w-[350px] lg:h-[700px] lg:w-[700px]" />
        {/* B-2: クロマチックサークル */}
        <ChromaticCircle className="hub-chromatic-circle h-[350px] w-[350px] lg:h-[700px] lg:w-[700px]" />
        {/* Hubのコントローラー: CSSのカスタムクラスで切替 */}
        <HubTypeController />
      </div>
    </main>
  );
};
