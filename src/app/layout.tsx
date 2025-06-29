import type { Metadata } from 'next';
import './globals.css';
import { GlobalHeader } from '@/features/global-header';

export const metadata: Metadata = {
  title: '音楽理論学習アプリ',
  description: '音楽理論学習アプリ',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <GlobalHeader />
        {children}
      </body>
    </html>
  );
}
