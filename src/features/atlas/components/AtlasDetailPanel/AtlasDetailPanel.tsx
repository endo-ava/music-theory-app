import React from 'react';
import { ClassNameProps } from '@/types';
import { cn } from '@/lib/utils';

export const AtlasDetailPanel: React.FC<ClassNameProps> = ({ className }) => {
  return (
    <aside
      className={cn(
        'border-border bg-panel h-full overflow-y-auto rounded-lg border p-4 backdrop-blur-sm',
        className
      )}
    >
      <h2 className="mb-4 text-lg font-semibold">Details</h2>
      <div className="text-muted-foreground text-sm">
        <p>Select a node to view details.</p>
      </div>
    </aside>
  );
};
