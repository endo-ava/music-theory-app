'use client';

import { FC } from 'react';
import { Key } from '@/types/circleOfFifths';

const CircleOfFifths: FC = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="relative w-[70%] max-w-[800px] aspect-square">
        {/* 五度圏の実装は後ほど */}
      </div>
      <div className="mt-8">{/* キー情報の表示は後ほど */}</div>
    </div>
  );
};

export default CircleOfFifths;
