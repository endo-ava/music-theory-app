'use client';

import { CircleOfFifths } from '@/components/CircleOfFifths/CircleOfFifths';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <main className="container mx-auto px-4 py-8 min-h-[80vh] flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-center mb-8">音楽理論学習アプリ</h1>
        <CircleOfFifths />
      </main>
    </div>
  );
}
