'use client';
import { twMerge } from 'tailwind-merge';
import { useHubStore } from '../store/hubStore';
import type { HubType } from '../types';
import { ClassNameProps } from '@/shared/types';

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
const hubTitleMap: Record<HubType, string> = {
  'circle-of-fifths': '五度圏',
  'chromatic-circle': 'クロマチックサークル',
};

export const HubTitle: React.FC<ClassNameProps> = ({ className }) => {
  const { hubType } = useHubStore();

  const hubTitle = hubTitleMap[hubType] || '五度圏';

  return <h1 className={twMerge('text-title', className)}>{hubTitle}</h1>;
};
