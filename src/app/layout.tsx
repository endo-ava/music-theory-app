import type { Metadata } from 'next';
import './globals.css';
import { GlobalHeader } from '@/components/layouts/GlobalHeader';
import { generateMusicColorTheme } from '@/shared/utils/musicColorSystem';

export const metadata: Metadata = {
  title: '音楽理論学習アプリ',
  description: '音楽理論学習アプリ',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // ビルド時に12音×7モードの色相システムを生成
  const musicColorTheme = generateMusicColorTheme();

  return (
    <html lang="ja">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP&family=Noto+Serif+JP&display=swap"
          rel="stylesheet"
        />

        <style
          dangerouslySetInnerHTML={{
            __html: `
              :root {
                ${musicColorTheme.replace('/* 12音×7モード色相システム */\n', '')}
              }
            `,
          }}
        />
      </head>
      <body>
        <GlobalHeader />
        {children}
      </body>
    </html>
  );
}
