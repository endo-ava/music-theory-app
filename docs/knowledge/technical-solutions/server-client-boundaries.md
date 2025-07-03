# Server/Client 境界設計

## 概要

Next.js App Router における Server Component と Client Component の境界設計に関する技術的知見を蓄積します。
パフォーマンス最適化、SEO対応、ユーザー体験向上を両立する境界設計手法を記録します。

## 境界設計の基本原則

### 1. デフォルト Server Component の原則

```typescript
// ✅ 基本：Server Component を優先
// Canvas.tsx (Server Component)
export const Canvas: React.FC<CanvasProps> = ({ className, style }) => {
  return (
    <div
      className={twMerge(
        'flex flex-col items-center justify-center',
        'bg-transparent w-full h-full min-h-[400px]',
        'p-4 lg:p-8',
        className
      )}
      style={style}
      role="main"
      aria-label="メイン表示エリア"
    >
      {/* 静的な構造は Server Component */}
      <HubTitle /> {/* 状態管理が必要な部分のみ Client Component */}
      
      <div className="w-full h-full flex items-center justify-center">
        <CircleOfFifths />
      </div>
    </div>
  );
};
```

### 2. Client Component の最小化

```typescript
// ✅ 必要最小限の Client Component
// HubTitle.tsx (Client Component)
'use client';
import { useHubStore } from '../store/hubStore';

export const HubTitle: React.FC<HubTitleProps> = ({ className = '' }) => {
  const { hubType } = useHubStore(); // 状態管理が必要なため Client Component
  
  const hubTitle = hubTitleMap[hubType] || '五度圏';
  
  return <h1 className={`text-title text-center mb-4 ${className}`}>{hubTitle}</h1>;
};
```

## 境界設計の判断基準

### 1. Server Component を選択すべき場合

#### 静的コンテンツの表示
```typescript
// 静的なレイアウトコンポーネント
export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <header className="fixed top-0 w-full">
        <StaticNavigation />
      </header>
      <main className="pt-16">
        {children}
      </main>
      <footer className="mt-auto">
        <StaticFooter />
      </footer>
    </div>
  );
};
```

#### SEO重要なコンテンツ
```typescript
// SEO対応が重要なコンテンツ
export const ArticleContent: React.FC<{ article: Article }> = ({ article }) => {
  return (
    <article>
      <h1>{article.title}</h1>
      <meta name="description" content={article.description} />
      <div dangerouslySetInnerHTML={{ __html: article.content }} />
    </article>
  );
};
```

### 2. Client Component を選択すべき場合

#### 状態管理が必要
```typescript
// 状態管理が必要なコンポーネント
'use client';
import { useState, useEffect } from 'react';

export const InteractiveWidget: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [data, setData] = useState(null);
  
  useEffect(() => {
    // ブラウザ API の使用
    const handleResize = () => {
      // リサイズ処理
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <div>
      <button onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? '折りたたむ' : '展開する'}
      </button>
      {isExpanded && <div>{data}</div>}
    </div>
  );
};
```

#### ブラウザ API の使用
```typescript
// localStorage、sessionStorage、Window API など
'use client';
import { useEffect, useState } from 'react';

export const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState('dark');
  
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);
  
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };
  
  return (
    <button onClick={toggleTheme}>
      {theme === 'dark' ? '🌙' : '☀️'}
    </button>
  );
};
```

## 境界設計パターン

### 1. Wrapper パターン

```typescript
// 静的なWrapper（Server Component）
export const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="page-container">
      <StaticHeader />
      <main className="main-content">
        {children} {/* 内部でClient Componentを使用可能 */}
      </main>
      <StaticFooter />
    </div>
  );
};

// 動的なContent（Client Component）
'use client';
export const DynamicContent: React.FC = () => {
  const [state, setState] = useState(initialState);
  
  return (
    <div>
      {/* 動的コンテンツ */}
    </div>
  );
};
```

### 2. 合成パターン

```typescript
// 合成による境界設計
export const CompositeComponent: React.FC = () => {
  return (
    <div>
      {/* Server Component 部分 */}
      <StaticSection />
      
      {/* Client Component 部分 */}
      <InteractiveSection />
      
      {/* 再び Server Component 部分 */}
      <AnotherStaticSection />
    </div>
  );
};
```

### 3. Props 渡しパターン

```typescript
// Server Component から Client Component への Props 渡し
export const ParentServer: React.FC = () => {
  const staticData = await fetchStaticData();
  
  return (
    <div>
      <h1>静的タイトル</h1>
      <InteractiveChild data={staticData} />
    </div>
  );
};

// Client Component で Props を受け取り
'use client';
export const InteractiveChild: React.FC<{ data: any }> = ({ data }) => {
  const [selected, setSelected] = useState(null);
  
  return (
    <div>
      {data.map(item => (
        <button 
          key={item.id}
          onClick={() => setSelected(item)}
          className={selected?.id === item.id ? 'active' : ''}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
};
```

## パフォーマンス最適化

### 1. バンドルサイズの最適化

```typescript
// ❌ 不要なライブラリをClient Componentに含める
'use client';
import { heavyLibrary } from 'heavy-library'; // 大きなライブラリ
import { useState } from 'react';

export const Component: React.FC = () => {
  const [state, setState] = useState();
  // heavyLibraryは実際には使用していない
  
  return <div>...</div>;
};

// ✅ 必要最小限のライブラリのみ
'use client';
import { useState } from 'react';

export const Component: React.FC = () => {
  const [state, setState] = useState();
  
  return <div>...</div>;
};
```

### 2. 分割読み込みの活用

```typescript
// 動的インポートによる分割読み込み
import dynamic from 'next/dynamic';

const HeavyClientComponent = dynamic(
  () => import('./HeavyClientComponent'),
  { 
    ssr: false,
    loading: () => <div>読み込み中...</div>
  }
);

export const PageComponent: React.FC = () => {
  return (
    <div>
      <StaticContent />
      <HeavyClientComponent />
    </div>
  );
};
```

## 実装上の注意点

### 1. 状態管理の境界

```typescript
// ❌ Server Component で状態管理
export const BadComponent: React.FC = () => {
  const [state, setState] = useState(); // エラー：Server Componentで状態管理
  
  return <div>...</div>;
};

// ✅ Client Component で状態管理
'use client';
export const GoodComponent: React.FC = () => {
  const [state, setState] = useState(); // 正しい：Client Componentで状態管理
  
  return <div>...</div>;
};
```

### 2. イベントハンドラーの境界

```typescript
// ❌ Server Component でイベントハンドラー
export const BadComponent: React.FC = () => {
  const handleClick = () => {
    // エラー：Server Componentでイベントハンドラー
  };
  
  return <button onClick={handleClick}>クリック</button>;
};

// ✅ Client Component でイベントハンドラー
'use client';
export const GoodComponent: React.FC = () => {
  const handleClick = () => {
    // 正しい：Client Componentでイベントハンドラー
  };
  
  return <button onClick={handleClick}>クリック</button>;
};
```

## 教訓・ポイント

### ✅ 成功パターン
- **Server Component 優先**: デフォルトでは Server Component を選択
- **最小境界**: 必要最小限の部分のみ Client Component に
- **明確な分離**: 境界の理由を明確に設計
- **パフォーマンス考慮**: バンドルサイズと初期読み込み速度を最適化

### ❌ 避けるべきパターン
- **過度な Client Component**: 不要な部分まで Client Component にしない
- **境界の曖昧さ**: Server/Client の境界が不明確
- **状態管理の混在**: Server Component での状態管理
- **パフォーマンスの未考慮**: 不要なJavaScriptの送信

### 🔧 実装時の注意点
- **'use client' の配置**: Client Component の最上位に配置
- **Props の型安全性**: Server から Client への Props は型安全に
- **SSR の考慮**: Client Component のSSR対応
- **ハイドレーションエラー**: Server/Client の不整合を避ける

## 参考資料

- [Next.js App Router - Server and Client Components](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns)
- [React - Server Components](https://react.dev/reference/react/use-client)
- [Next.js Performance Best Practices](https://nextjs.org/docs/app/building-your-application/optimizing)
- [開発規約](../../03.developmentAgreement.md)

## 更新履歴

- 2025-07-03: 初版作成（Issue #34 Canvas/HubTitle 境界設計知見を基に）