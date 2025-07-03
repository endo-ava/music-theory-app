import { Canvas } from '@/features/canvas';

export default function Home() {
  return (
    <div>
      <div className="py-2 flex flex-col">
        <div className="flex justify-end">
          <div className="w-full max-w-7xl">
            <Canvas />
          </div>
        </div>
      </div>
    </div>
  );
}
