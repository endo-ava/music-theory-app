'use client';

import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const labelVariants = cva(
  'flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
  {
    variants: {
      variant: {
        default: '',
        layer: 'group cursor-pointer',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface LabelProps
  extends React.ComponentProps<typeof LabelPrimitive.Root>,
    VariantProps<typeof labelVariants> {}

function Label({ className, variant, children, ...props }: LabelProps) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(labelVariants({ variant }), className)}
      {...props}
    >
      {variant === 'layer' ? (
        <>
          <div className="bg-accent/60 group-hover:bg-accent h-2 w-2 rounded-full transition-colors duration-300" />
          {children}
        </>
      ) : (
        children
      )}
    </LabelPrimitive.Root>
  );
}

export { Label };
