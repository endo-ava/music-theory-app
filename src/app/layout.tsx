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
    <html lang="ja" className="dark">
      <head>
        {/* Typography: Poppins (heading) + DM Sans (body) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&family=Noto+Sans+JP&family=Noto+Serif+JP&family=JetBrains+Mono&display=swap"
          rel="stylesheet"
        />

        {/* Music Color Theme - Dynamic 84 colors */}
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
