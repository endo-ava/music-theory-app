import { twMerge } from 'tailwind-merge';
import { CircleOfFifths } from '@/features/circle-of-fifths';
import { HubTitle } from './HubTitle';
import { ClassNameProps } from '@/shared/types';

/**
 * メイン表示エリア（Canvas）コンポーネント
 *
 * インタラクティブ・ハブ画面のメイン表示エリアを提供します。
 * 現在は五度圏を表示し、将来的にはクロマチックサークルとの切り替えに対応します。
 *
 * @param props - コンポーネントのプロパティ
 * @returns Canvas のJSX要素
 */
export const Canvas: React.FC<ClassNameProps> = ({ className }) => {
  return (
    <div
      className={twMerge(
        'flex flex-col w-full h-full min-h-[400px] p-4 lg:p-8 bg-transparent',
        className
      )}
      role="main"
      aria-label="メイン表示エリア"
    >
      {/* Hub タイトル */}
      <HubTitle className="text-center text-2xl lg:text-4xl" />

      {/* 固定間隔 */}
      <div className="h-8 lg:h-12 flex-shrink-0"></div>

      {/* Hub コンポーネント表示 - 五度圏 */}
      <div className="flex items-center justify-center">
        <CircleOfFifths className="w-[350px] h-[350px] lg:w-[750px] lg:h-[750px]" />
      </div>
    </div>
  );
};
