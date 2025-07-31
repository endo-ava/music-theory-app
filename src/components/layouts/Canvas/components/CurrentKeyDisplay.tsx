'use client';

import { useCurrentMusicalKeyStore } from '@/stores/currentMusicalKeyStore';
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
  const { currentMusicalKey } = useCurrentMusicalKeyStore();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <h1 className={className}>{currentMusicalKey.getDisplayName()}</h1>
      </TooltipTrigger>
      <TooltipContent side="right">変更するには長押ししてください</TooltipContent>
    </Tooltip>
  );
};
