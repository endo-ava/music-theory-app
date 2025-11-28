import type { Metadata } from 'next';
import { AtlasLayout } from '@/features/atlas';

export const metadata: Metadata = {
  title: 'Atlas | Harmonic Orbit',
  description: '音楽理論の各用語を深く、正確に学ぶためのリファレンス画面',
};

export default function AtlasPage() {
  return (
    <div className="bg-background flex min-h-dvh flex-col">
      <main className="flex-1 overflow-hidden">
        <AtlasLayout />
      </main>
    </div>
  );
}
