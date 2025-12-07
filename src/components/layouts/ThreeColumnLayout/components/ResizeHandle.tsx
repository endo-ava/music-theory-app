'use client';

import React, { useState } from 'react';
import { PanelResizeHandle } from 'react-resizable-panels';
import { twMerge } from 'tailwind-merge';
import { ClassNameProps } from '@/types';

interface ResizeHandleProps extends ClassNameProps {
  /** リサイザーの識別用ID */
  id?: string;
}

/**
 * カスタムリサイズハンドルコンポーネント
 *
 * ホバー時の視覚フィードバック、アクセシビリティ対応、
 * 美しいアニメーション効果を提供
 */
export const ResizeHandle: React.FC<ResizeHandleProps> = ({ className, id }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <PanelResizeHandle
      id={id}
      className={twMerge(
        // 基本スタイル
        'group relative flex items-center justify-center',
        'cursor-col-resize transition-all duration-200 ease-in-out',
        'hover:bg-primary/10 active:bg-primary/20',

        // サイズとレイアウト
        'w-1 min-w-[4px] hover:w-2',
        'bg-border/60 hover:bg-primary/50',

        // 角丸とその他の装飾
        'rounded-sm',
        'focus:ring-primary focus:ring-2 focus:ring-offset-2 focus:outline-none',

        // ドラッグ中の状態
        isDragging && 'bg-primary/70 w-2',

        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      aria-label="パネルサイズを調整"
      role="separator"
      tabIndex={0}
    >
      {/* 視覚的なドット表示（ホバー時のみ） */}
      <div
        className={twMerge(
          'flex flex-col gap-1 opacity-0 transition-opacity duration-200',
          (isHovered || isDragging) && 'opacity-50'
        )}
      >
        <div className="bg-foreground/40 h-1 w-1 rounded-full" />
        <div className="bg-foreground/40 h-1 w-1 rounded-full" />
        <div className="bg-foreground/40 h-1 w-1 rounded-full" />
      </div>

      {/* ドラッグ中のハイライト */}
      {isDragging && (
        <div className="via-primary/30 absolute inset-0 rounded-sm bg-gradient-to-r from-transparent to-transparent" />
      )}
    </PanelResizeHandle>
  );
};
