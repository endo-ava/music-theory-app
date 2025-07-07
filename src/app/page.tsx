import { Canvas } from '@/features/canvas';
import { SidePanel } from '@/features/side-panel';

export default function Home() {
  return (
    <div className="flex h-screen flex-col">
      {/* 2-column layout: Side Panel + Canvas */}
      <div className="flex flex-1">
        {/* Left: Side Panel */}
        <div className="flex-1">
          <SidePanel />
        </div>
        {/* Right: Canvas */}
        <div className="w-full lg:w-1/2">
          <Canvas />
        </div>
      </div>
    </div>
  );
}
