'use client';

import { useCurrentKeyStore } from '@/stores/currentKeyStore';
import { ClassNameProps } from '@/shared/types';
import { ResponsiveHelpIcon } from '@/shared/components/ResponsiveHelpIcon';
import { twMerge } from 'tailwind-merge';

/**
 * 現在のスケール表示コンポーネント
 *
 * 現在設定されているスケール（音楽的世界観）を表示します。
 * 相対的な音楽理論学習において、基準となるスケールを常時視覚的に確認できるよう
 * 「C Major」「F# Minor」形式で表示します。
 * PC：ホバー時にツールチップで変更方法を案内
 * モバイル：？アイコンをクリックでツールチップを表示
 *
 * @param props - コンポーネントのプロパティ
 * @returns CurrentKeyDisplay のJSX要素
 */
export const CurrentKeyDisplay: React.FC<ClassNameProps> = ({ className }) => {
  const { currentKey } = useCurrentKeyStore();

  return (
    <div className={twMerge('relative inline-block', className)}>
      {/* テキスト本体 */}
      <h2 className="cursor-default pr-4 pb-2 text-2xl lg:text-4xl">{currentKey.keyName}</h2>

      {/* レスポンシブヘルプアイコン */}
      <ResponsiveHelpIcon
        helpText="キーセクションを長押しでキー変更"
        className="absolute right-0 bottom-1"
      />
    </div>
  );
};
