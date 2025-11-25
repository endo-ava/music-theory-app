'use client';

import React from 'react';
import { TransformWrapper, TransformComponent, useTransformEffect } from 'react-zoom-pan-pinch';
import { ClassNameProps } from '@/shared/types';
import { cn } from '@/lib/utils';
import { CoordinateGrid } from './components/CoordinateGrid';

const WORLD_SIZE = 20000;
const CENTER = WORLD_SIZE / 2;

/**
 * Transform状態を追跡し、グリッドにスケール情報を渡す
 */
const AtlasContent: React.FC = () => {
  const [scale, setScale] = React.useState(1);

  useTransformEffect(({ state }) => {
    setScale(state.scale);
  });

  return (
    <div
      style={{
        width: WORLD_SIZE,
        height: WORLD_SIZE,
        position: 'relative',
      }}
      className="bg-background"
    >
      {/* グリッド: TransformComponent内に配置し、strokeWidthを動的調整 */}
      <CoordinateGrid size={WORLD_SIZE} scale={scale} />
    </div>
  );
};

export const AtlasCanvas: React.FC<ClassNameProps> = ({ className }) => {
  return (
    <div className={cn('bg-background relative h-full w-full overflow-hidden', className)}>
      <TransformWrapper
        initialScale={1}
        centerOnInit={true}
        minScale={0.1}
        maxScale={4}
        limitToBounds={true}
        wheel={{ step: 0.05 }}
        panning={{ velocityDisabled: true }}
      >
        <TransformComponent
          wrapperClass="h-full w-full"
          contentStyle={{ width: WORLD_SIZE, height: WORLD_SIZE }}
        >
          <AtlasContent />
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};
