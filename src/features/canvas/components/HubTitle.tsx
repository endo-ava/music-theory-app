'use client';
import { twMerge } from 'tailwind-merge';
import { useHubStore } from '@/stores/hubStore';
import { getHubDisplayNameEn } from '@/shared/constants/hubs';
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
export const HubTitle: React.FC<ClassNameProps> = ({ className }) => {
  const { hubType } = useHubStore();

  const hubTitle = getHubDisplayNameEn(hubType);

  return <h1 className={twMerge('text-title', className)}>{hubTitle}</h1>;
};
