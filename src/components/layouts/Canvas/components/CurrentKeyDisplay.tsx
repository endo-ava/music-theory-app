'use client';

import { useCurrentKeyStore } from '@/stores/currentKeyStore';
import { ClassNameProps } from '@/shared/types';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

/**
 * 現在のスケール表示コンポーネント
 *
 * 現在設定されているスケール（音楽的世界観）を表示します。
 * 相対的な音楽理論学習において、基準となるスケールを常時視覚的に確認できるよう
 * 「C Major」「F# Minor」形式で表示します。
 * ホバー時にツールチップで変更方法を案内します。
 *
 * @param props - コンポーネントのプロパティ
 * @returns CurrentKeyDisplay のJSX要素
 */
export const CurrentKeyDisplay: React.FC<ClassNameProps> = ({ className }) => {
  const { currentKey } = useCurrentKeyStore();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <h1 className={className}>{currentKey.keyName}</h1>
      </TooltipTrigger>
      <TooltipContent side="top">長押しでキー変更</TooltipContent>
    </Tooltip>
  );
};
