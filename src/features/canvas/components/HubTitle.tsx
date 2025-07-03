'use client';
import { useHubStore } from '../store/hubStore';

/**
 * HubTitle コンポーネントのProps
 */
export interface HubTitleProps {
  /** カスタムクラス名 */
  className?: string;
}

/**
 * Hub タイトル表示コンポーネント
 *
 * 現在のHub種類に応じたタイトルを表示します。
 * クライアントコンポーネントとして、Hub状態の変更に対応します。
 *
 * @param props - コンポーネントのプロパティ
 * @returns HubTitle のJSX要素
 */
export const HubTitle: React.FC<HubTitleProps> = ({ className = '' }) => {
  const { hubType } = useHubStore();

  // Hub種類に応じたタイトルを取得
  const getHubTitle = () => {
    switch (hubType) {
      case 'circle-of-fifths':
        return '五度圏';
      case 'chromatic-circle':
        return 'クロマチックサークル';
      default:
        return '五度圏';
    }
  };

  return <h1 className={`text-title text-center mb-4 ${className}`}>{getHubTitle()}</h1>;
};
