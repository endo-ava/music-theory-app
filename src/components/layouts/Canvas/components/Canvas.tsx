import { twMerge } from 'tailwind-merge';
import { CircleOfFifths } from '@/features/circle-of-fifths';
import { HubTitle } from './HubTitle';
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
    <div
      className={twMerge(
        'flex h-full min-h-[400px] w-full flex-col bg-transparent p-4 lg:p-8',
        className
      )}
      aria-label="メイン表示エリア"
    >
      {/* Hub タイトル */}
      <HubTitle className="text-center text-2xl lg:text-4xl" />

      {/* 固定間隔 */}
      <div className="h-8 flex-shrink-0 lg:h-12"></div>

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
    </div>
  );
};
