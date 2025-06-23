import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'チュートリアル | 音楽理論学習アプリ',
  description: '特定のテーマに沿って、物語形式で理論の背景や発展を学べる読み物コンテンツ',
};

export default function TutorialPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* ページヘッダー */}
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">チュートリアル</h1>
            <p className="text-lg text-muted-foreground">
              特定のテーマに沿って、物語形式で理論の背景や発展を学べる読み物コンテンツ
            </p>
          </header>

          {/* チュートリアルコンテンツ一覧 */}
          <div className="space-y-6">
            {/* チュートリアル1 */}
            <article className="bg-card rounded-lg border p-6 hover:shadow-md transition-shadow">
              <header className="mb-4">
                <h2 className="text-2xl font-semibold text-foreground mb-2">
                  ピタゴラス音律から平均律へ：音階はどうやって生まれたか
                </h2>
                <div className="flex items-center text-sm text-muted-foreground space-x-4">
                  <span>推定読書時間: 15分</span>
                  <span>難易度: 初級</span>
                </div>
              </header>
              <p className="text-muted-foreground mb-4">
                古代ギリシャの数学者ピタゴラスから始まった音楽と数学の関係。
                なぜ現代の楽器は「平均律」を採用しているのか、その歴史的背景と理論を物語形式で解説します。
              </p>
              <div className="bg-muted rounded p-3 text-sm text-muted-foreground">
                <p>🚧 実装予定の内容：</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>ピタゴラスの発見：音の高さと弦の長さの関係</li>
                  <li>純正律の美しさと問題点</li>
                  <li>平均律の発明とバッハの影響</li>
                  <li>インタラクティブな音程比較機能</li>
                </ul>
              </div>
            </article>

            {/* チュートリアル2 */}
            <article className="bg-card rounded-lg border p-6 hover:shadow-md transition-shadow">
              <header className="mb-4">
                <h2 className="text-2xl font-semibold text-foreground mb-2">
                  ブルースの魔法：ブルース進行とブルーノートスケールの解剖
                </h2>
                <div className="flex items-center text-sm text-muted-foreground space-x-4">
                  <span>推定読書時間: 20分</span>
                  <span>難易度: 中級</span>
                </div>
              </header>
              <p className="text-muted-foreground mb-4">
                アフリカ系アメリカ人の音楽文化から生まれたブルース。
                なぜブルースは人の心を打つのか、その秘密を音楽理論の観点から探ります。
              </p>
              <div className="bg-muted rounded p-3 text-sm text-muted-foreground">
                <p>🚧 実装予定の内容：</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>12小節ブルース進行の構造分析</li>
                  <li>ブルーノートが生む独特の響き</li>
                  <li>ジャズやロックへの影響</li>
                  <li>実際の楽曲での使用例</li>
                </ul>
              </div>
            </article>

            {/* チュートリアル3 */}
            <article className="bg-card rounded-lg border p-6 hover:shadow-md transition-shadow">
              <header className="mb-4">
                <h2 className="text-2xl font-semibold text-foreground mb-2">
                  モード入門：スケールの性格を変える7つの魔法
                </h2>
                <div className="flex items-center text-sm text-muted-foreground space-x-4">
                  <span>推定読書時間: 25分</span>
                  <span>難易度: 中級〜上級</span>
                </div>
              </header>
              <p className="text-muted-foreground mb-4">
                同じ音を使っているのに、なぜこんなに雰囲気が変わるのか？
                教会旋法（モード）の世界に足を踏み入れ、音楽の表現力を広げましょう。
              </p>
              <div className="bg-muted rounded p-3 text-sm text-muted-foreground">
                <p>🚧 実装予定の内容：</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>7つのモードの特徴と雰囲気</li>
                  <li>ジャズ、クラシック、民族音楽での使用例</li>
                  <li>モードの聞き分け練習</li>
                  <li>作曲での活用方法</li>
                </ul>
              </div>
            </article>

            {/* 今後の予定 */}
            <section className="bg-muted rounded-lg p-6">
              <h2 className="text-xl font-semibold text-foreground mb-3">
                今後追加予定のチュートリアル
              </h2>
              <div className="grid md:grid-cols-2 gap-3 text-sm text-muted-foreground">
                <div>• 和声の進化：バロックから現代まで</div>
                <div>• リズムの科学：なぜビートは人を踊らせるのか</div>
                <div>• 音色の秘密：倍音と楽器の個性</div>
                <div>• 世界の音楽：異なる文化の音階システム</div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
