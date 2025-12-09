import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ClassNameProps } from '@/types';

/**
 * Atlas Search Overlay
 *
 * 画面左上にフローティング表示される検索バー兼フィルタリング操作パネル。
 * Google Mapのような「検索カプセル」のUIを提供します。
 *
 * @param {ClassNameProps} props
 */
export const AtlasSearchOverlay: React.FC<ClassNameProps> = ({ className }) => {
  return (
    <div
      role="search"
      className={cn(
        'bg-muted border-border absolute top-4 left-4 z-10 flex w-80 items-center gap-2 rounded-full border px-4 py-2 shadow-lg backdrop-blur-md transition-all sm:top-6 sm:left-6',
        className
      )}
    >
      <Search className="text-muted-foreground h-4 w-4 shrink-0" aria-hidden="true" />
      <label htmlFor="atlas-search" className="sr-only">
        Search Atlas concepts
      </label>
      <input
        id="atlas-search"
        type="text"
        placeholder="Search..."
        aria-label="Search Atlas concepts"
        className="placeholder:text-muted-foreground flex-1 border-none bg-transparent text-sm outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-0"
      />
      <div className="bg-border h-4 w-[1px]" aria-hidden="true" />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Open filters"
        className="h-6 w-6 rounded-full hover:bg-transparent"
      >
        <SlidersHorizontal className="text-muted-foreground hover:text-foreground h-4 w-4 transition-colors" />
      </Button>
    </div>
  );
};
