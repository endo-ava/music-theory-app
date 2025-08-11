import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ライブラリ | 音楽理論学習アプリ',
  description: '音楽理論の各用語を深く、正確に学ぶためのリファレンス画面',
};

export default function LibraryPage() {
  return (
    <div className="bg-background min-h-dvh">
      <main className="container mx-auto px-6 py-8">
        <div className="mx-auto max-w-4xl">
          {/* ページヘッダー */}
          <header className="mb-8">
            <h1 className="text-foreground mb-4 text-4xl font-bold">ライブラリ</h1>
            <p className="text-muted-foreground text-lg">
              音楽理論の各用語を深く、正確に学ぶためのリファレンス（辞書）画面
            </p>
          </header>

          {/* プレースホルダーコンテンツ */}
          <div className="space-y-8">
            {/* 検索・フィルタエリア */}
            <section className="bg-card rounded-lg border p-6">
              <h2 className="mb-4 text-2xl font-semibold">検索・フィルタ</h2>
              <div className="text-muted-foreground">
                <p>今後実装予定：</p>
                <ul className="mt-2 list-inside list-disc space-y-1">
                  <li>用語検索機能</li>
                  <li>カテゴリフィルタ（スケール、コード、リズムなど）</li>
                  <li>難易度フィルタ</li>
                </ul>
              </div>
            </section>

            {/* コンテンツエリア */}
            <section className="bg-card rounded-lg border p-6">
              <h2 className="mb-4 text-2xl font-semibold">音楽理論用語集</h2>
              <div className="text-muted-foreground">
                <p>今後実装予定のコンテンツ例：</p>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="rounded border p-4">
                    <h3 className="text-foreground font-medium">五度圏</h3>
                    <p className="mt-1 text-sm">アニメーション図解付きの詳細解説</p>
                  </div>
                  <div className="rounded border p-4">
                    <h3 className="text-foreground font-medium">スケール</h3>
                    <p className="mt-1 text-sm">各スケールの特性と使用例</p>
                  </div>
                  <div className="rounded border p-4">
                    <h3 className="text-foreground font-medium">コード進行</h3>
                    <p className="mt-1 text-sm">代表的な進行パターンの解説</p>
                  </div>
                  <div className="rounded border p-4">
                    <h3 className="text-foreground font-medium">調性</h3>
                    <p className="mt-1 text-sm">長調・短調の理論と実践</p>
                  </div>
                </div>
              </div>
            </section>

            {/* インタラクティブ機能エリア */}
            {/* <section className="bg-card rounded-lg border p-6">
              <h2 className="mb-4 text-2xl font-semibold">インタラクティブ機能</h2>
              <div className="text-muted-foreground">
                <p>今後実装予定：</p>
                <ul className="mt-2 list-inside list-disc space-y-1">
                  <li>音の再生機能</li>
                  <li>ビジュアライゼーション</li>
                  <li>概念間のリンク表示</li>
                  <li>ハブ画面へのクイックアクセス</li>
                </ul>
              </div>
            </section> */}
          </div>
        </div>
      </main>
    </div>
  );
}
