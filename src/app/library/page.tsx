import type { Metadata } from 'next';
import { LibraryLayout } from '@/features/library';

export const metadata: Metadata = {
  title: 'Library | Harmonic Orbit',
  description: '音楽理論の各用語を深く、正確に学ぶためのリファレンス画面',
};

export default function LibraryPage() {
  return (
    <div className="bg-background flex min-h-dvh flex-col">
      {/* ページヘッダー (Global Headerの下に配置される想定だが、ここでは簡易的にタイトルを表示) */}
      {/* Note: GlobalLayoutが適用されている場合、ここはメインコンテンツエリアになる */}

      <main className="flex-1 overflow-hidden">
        <LibraryLayout />
      </main>
    </div>
  );
}
