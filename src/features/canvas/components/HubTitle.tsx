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
// Hub種類に応じたタイトルを取得するマッピングオブジェクト
const hubTitleMap: Record<string, string> = {
  'circle-of-fifths': '五度圏',
  'chromatic-circle': 'クロマチックサークル',
};

export const HubTitle: React.FC<HubTitleProps> = ({ className = '' }) => {
  const { hubType } = useHubStore();

  const hubTitle = hubTitleMap[hubType] || '五度圏';

  return <h1 className={`text-title text-center mb-4 ${className}`}>{hubTitle}</h1>;
};
