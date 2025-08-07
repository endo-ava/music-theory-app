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

  // デバッグ用：生成されたCSS変数を確認
  console.log('🎨 Generated Music Color Theme:', musicColorTheme);

  return (
    <html lang="ja">
      <head>
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
