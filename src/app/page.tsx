import { Canvas } from '@/features/canvas';

export default function Home() {
  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-1">
        <div className="flex-1">{/* 左側：他のコンテンツ */}</div>
        <div className="w-full lg:w-1/2">
          <Canvas />
        </div>
      </div>
    </div>
  );
}
