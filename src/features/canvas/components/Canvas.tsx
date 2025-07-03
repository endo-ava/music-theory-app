import { twMerge } from 'tailwind-merge';
import { CircleOfFifths } from '@/features/circle-of-fifths';
import { HubTitle } from './HubTitle';

/**
 * Canvas コンポーネントのProps
 */
export interface CanvasProps {
  /** カスタムクラス名 */
  className?: string;
  /** カスタムスタイル */
  style?: React.CSSProperties;
}

/**
 * メイン表示エリア（Canvas）コンポーネント
 *
 * インタラクティブ・ハブ画面のメイン表示エリアを提供します。
 * 現在は五度圏を表示し、将来的にはクロマチックサークルとの切り替えに対応します。
 *
 * @param props - コンポーネントのプロパティ
 * @returns Canvas のJSX要素
 */
export const Canvas: React.FC<CanvasProps> = ({ className, style }) => {
  return (
    <div
      className={twMerge(
        // メイン表示エリアのレイアウト
        'flex flex-col items-center justify-center',
        // 背景は透明（ページ全体の背景を継承）
        'bg-transparent',
        // サイズ設定
        'w-full h-full min-h-[400px]',
        // レスポンシブ対応
        'p-4 lg:p-8',
        className
      )}
      style={style}
      role="main"
      aria-label="メイン表示エリア"
    >
      {/* Hub タイトル */}
      <HubTitle />

      {/* Hub コンポーネント表示 - 現在は五度圏のみ */}
      <div className="w-full h-full flex items-center justify-center">
        <CircleOfFifths />
      </div>
    </div>
  );
};
