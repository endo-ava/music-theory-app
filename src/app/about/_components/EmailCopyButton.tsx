'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EmailCopyButtonProps {
  email: string;
  className?: string;
}

export function EmailCopyButton({ email, className }: EmailCopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn('ml-2 h-8 w-8 transition-all duration-300', className)}
      onClick={handleCopy}
      aria-label="Copy email address"
    >
      <div className="relative h-4 w-4">
        <Copy
          className={cn(
            'absolute inset-0 h-full w-full transition-all duration-300',
            copied ? 'scale-50 opacity-0' : 'scale-100 opacity-100'
          )}
        />
        <Check
          className={cn(
            'absolute inset-0 h-full w-full text-green-500 transition-all duration-300',
            copied ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
          )}
        />
      </div>
    </Button>
  );
}
