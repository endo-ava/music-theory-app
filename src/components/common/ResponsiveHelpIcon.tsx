'use client';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { HelpCircle } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface ResponsiveHelpIconProps {
  /** ヘルプテキスト */
  helpText: string;
  /** コンテナのカスタムクラス名 */
  className?: string;
  /** モバイル版アイコンサイズのTailwindクラス @default 'size-3.5' */
  mobileIconSize?: string;
  /** PC版アイコンサイズのTailwindクラス @default 'size-4' */
  desktopIconSize?: string;
}

/**
 * レスポンシブヘルプアイコンコンポーネント
 *
 * PC版：ホバー時にTooltipを表示
 * モバイル版：クリック時にPopoverを表示
 *
 * @param props - コンポーネントのプロパティ
 * @returns ResponsiveHelpIcon のJSX要素
 */
export const ResponsiveHelpIcon: React.FC<ResponsiveHelpIconProps> = ({
  helpText,
  className,
  mobileIconSize = 'size-3.5',
  desktopIconSize = 'size-4',
}) => {
  return (
    <div className={className}>
      {/* --- モバイル版（Popover: md:hidden） --- */}
      <div className="md:hidden">
        <Popover>
          <PopoverTrigger asChild>
            <button className="mx-[-4]">
              <HelpCircle className={twMerge('text-secondary-foreground', mobileIconSize)} />
            </button>
          </PopoverTrigger>
          <PopoverContent
            side="right"
            sideOffset={4}
            className="w-auto px-2 py-1 font-sans text-[8px] leading-tight"
          >
            {helpText}
          </PopoverContent>
        </Popover>
      </div>

      {/* --- PC版（Tooltip: hidden md:block） --- */}
      <div className="hidden md:block">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="mx-[-4]">
              <HelpCircle className={twMerge('text-secondary-foreground', desktopIconSize)} />
            </div>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={8} className="font-sans">
            {helpText}
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};
