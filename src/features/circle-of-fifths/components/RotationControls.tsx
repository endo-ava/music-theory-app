'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCircleOfFifthsStore } from '@/stores/circleOfFifthsStore';

/**
 * 五度圏回転コントローラー
 *
 * 円の回転を制御するボタン群を提供します。
 */
export const RotationControls: React.FC = () => {
  const { rotateLeft, rotateRight, resetRotation } = useCircleOfFifthsStore();

  return (
    <div className="border-border pointer-events-auto absolute top-4 right-4 z-10 flex gap-2 rounded-full border p-2">
      <Button
        variant="outline"
        size="icon"
        onClick={rotateLeft}
        aria-label="左へ回転"
        className="bg-muted hover:bg-accent h-8 w-8 rounded-full backdrop-blur-sm"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={resetRotation}
        aria-label="リセット"
        className="bg-muted hover:bg-accent h-8 w-8 rounded-full backdrop-blur-sm"
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={rotateRight}
        aria-label="右へ回転"
        className="bg-muted hover:bg-accent h-8 w-8 rounded-full backdrop-blur-sm"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
