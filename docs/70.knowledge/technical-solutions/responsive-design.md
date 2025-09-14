# レスポンシブ設計手法

## 概要

Tailwind CSS v4 を活用したレスポンシブ設計の実装手法を蓄積します。
モバイルファーストアプローチ、デザイントークンの活用、パフォーマンス最適化を含む包括的な設計手法を記録します。

## モバイルファーストアプローチ

### 1. 基本的な設計原則

```typescript
// ✅ モバイルファーストの実装
export const Canvas: React.FC<ClassNameProps> = ({ className }) => {
  return (
    <div
      className={twMerge(
        // ベース（モバイル）スタイル
        'flex flex-col items-center justify-center',
        'w-full h-full min-h-[400px]',

        // モバイル → デスクトップへの拡張
        'p-4',           // モバイル: 16px
        'lg:p-8',        // デスクトップ: 32px

        className
      )}
    >
      {/* コンテンツ */}
    </div>
  );
};
```

### 2. ブレークポイント戦略

```css
/* Tailwind CSS v4 のブレークポイント */
/* 
  デフォルト: 0px （モバイル）
  sm: 640px  （小タブレット）
  md: 768px  （タブレット）
  lg: 1024px （デスクトップ）
  xl: 1280px （大デスクトップ）
*/
```

```typescript
// ブレークポイントの使用例
const ResponsiveGrid: React.FC = () => {
  return (
    <div className={twMerge(
      // モバイル: 1列
      'grid grid-cols-1 gap-4',

      // タブレット: 2列
      'md:grid-cols-2 md:gap-6',

      // デスクトップ: 3列
      'lg:grid-cols-3 lg:gap-8',

      // 大デスクトップ: 4列
      'xl:grid-cols-4 xl:gap-10'
    )}>
      {/* グリッドアイテム */}
    </div>
  );
};
```

## デザイントークンの活用

### 1. カスタムデザイントークン

```css
/* src/app/globals.css */
@theme {
  /* スペーシング */
  --spacing-xs: 0.25rem; /* 4px */
  --spacing-sm: 0.5rem; /* 8px */
  --spacing-md: 1rem; /* 16px */
  --spacing-lg: 1.5rem; /* 24px */
  --spacing-xl: 2rem; /* 32px */

  /* タイポグラフィ */
  --font-size-title: 1.875rem; /* 30px */
  --font-size-heading: 1.5rem; /* 24px */
  --font-size-body: 1rem; /* 16px */

  /* カラー */
  --color-primary: #3b82f6;
  --color-secondary: #6b7280;
  --color-accent: #f59e0b;
}
```

### 2. デザイントークンの使用

```typescript
// デザイントークンを使用したコンポーネント
export const ThemedComponent: React.FC = () => {
  return (
    <div className={twMerge(
      // スペーシング
      'p-md',          // --spacing-md (16px)
      'lg:p-xl',       // --spacing-xl (32px)

      // タイポグラフィ
      'text-title',    // --font-size-title

      // カラー
      'foreground',  // --color-primary
      'bg-secondary'   // --color-secondary
    )}>
      コンテンツ
    </div>
  );
};
```

## レスポンシブ実装パターン

### 1. フレキシブルレイアウト

```typescript
// フレキシブルなカードレイアウト
export const CardGrid: React.FC<{ items: Item[] }> = ({ items }) => {
  return (
    <div className={twMerge(
      // モバイル: 縦積み
      'flex flex-col space-y-4',

      // タブレット: 2列のグリッド
      'md:grid md:grid-cols-2 md:gap-6 md:space-y-0',

      // デスクトップ: 3列のグリッド
      'lg:grid-cols-3',

      // 大画面: 4列のグリッド
      'xl:grid-cols-4'
    )}>
      {items.map(item => (
        <Card key={item.id} item={item} />
      ))}
    </div>
  );
};
```

### 2. 可変サイズのコンテナ

```typescript
// 可変サイズのコンテナ
export const ResponsiveContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className={twMerge(
      // モバイル: フル幅
      'w-full px-4',

      // タブレット: 最大幅設定
      'md:max-w-3xl md:mx-auto md:px-6',

      // デスクトップ: さらに大きな最大幅
      'lg:max-w-5xl lg:px-8',

      // 大画面: 最大幅設定
      'xl:max-w-7xl xl:px-12'
    )}>
      {children}
    </div>
  );
};
```

### 3. 条件付きレンダリング

```typescript
// 画面サイズに応じた条件付きレンダリング
export const ResponsiveNavigation: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="relative">
      {/* モバイルメニューボタン */}
      <button
        className="lg:hidden p-2"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        ☰
      </button>

      {/* デスクトップナビゲーション */}
      <div className="hidden lg:flex lg:space-x-8">
        <NavigationItem href="/home">ホーム</NavigationItem>
        <NavigationItem href="/about">概要</NavigationItem>
        <NavigationItem href="/contact">連絡先</NavigationItem>
      </div>

      {/* モバイルメニュー */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-lg">
          <NavigationItem href="/home">ホーム</NavigationItem>
          <NavigationItem href="/about">概要</NavigationItem>
          <NavigationItem href="/contact">連絡先</NavigationItem>
        </div>
      )}
    </nav>
  );
};
```

## パフォーマンス最適化

### 1. 画像の最適化

```typescript
// Next.js Image コンポーネントでのレスポンシブ画像
import Image from 'next/image';

export const ResponsiveImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  return (
    <div className="relative w-full h-64 md:h-80 lg:h-96">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover rounded-lg"
        priority
      />
    </div>
  );
};
```

### 2. 条件付きスタイル読み込み

```typescript
// 条件付きスタイルの最適化
export const OptimizedComponent: React.FC<{ variant: 'mobile' | 'desktop' }> = ({ variant }) => {
  const baseStyles = 'flex items-center justify-center';

  const variantStyles = {
    mobile: 'p-2 text-sm',
    desktop: 'p-4 text-lg'
  };

  return (
    <div className={twMerge(
      baseStyles,
      variantStyles[variant],
      // レスポンシブ対応
      'p-2 text-sm md:p-4 md:text-lg'
    )}>
      コンテンツ
    </div>
  );
};
```

## CSS 最適化の実装

### 1. 冗長なクラスの削除

```typescript
// ❌ 冗長なクラス
export const BadComponent: React.FC = () => {
  return (
    <div className="p-4 md:p-4 lg:p-8">
      {/* md:p-4 は p-4 と同じなので不要 */}
    </div>
  );
};

// ✅ 最適化されたクラス
export const GoodComponent: React.FC = () => {
  return (
    <div className="p-4 lg:p-8">
      {/* 必要最小限のクラス */}
    </div>
  );
};
```

### 2. twMerge の効果的な使用

```typescript
// twMerge を使用した適切なクラス管理
export const MergedComponent: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={twMerge(
      // ベーススタイル
      'flex flex-col items-center justify-center',
      'w-full h-full min-h-[400px]',

      // レスポンシブスタイル
      'p-4 lg:p-8',

      // 外部からのカスタマイズ
      className
    )}>
      コンテンツ
    </div>
  );
};
```

## テストでのレスポンシブ対応

### 1. Storybook でのレスポンシブテスト

```typescript
// Storybook でのレスポンシブテスト
export const ResponsiveTest: Story = {
  parameters: {
    viewport: {
      viewports: {
        mobile: { name: 'Mobile', styles: { width: '375px', height: '667px' } },
        tablet: { name: 'Tablet', styles: { width: '768px', height: '1024px' } },
        desktop: { name: 'Desktop', styles: { width: '1200px', height: '800px' } },
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // レスポンシブクラスの確認
    const element = canvas.getByRole('main');
    expect(element).toHaveClass('p-4', 'lg:p-8');

    // 画面サイズに応じた表示確認
    expect(element).toHaveClass('w-full', 'h-full');
  },
};
```

### 2. テストでの画面サイズ確認

```typescript
// Jest でのレスポンシブテスト
describe('ResponsiveComponent', () => {
  it('should apply mobile styles', () => {
    render(<ResponsiveComponent />);

    const element = screen.getByRole('main');
    expect(element).toHaveClass('p-4');
  });

  it('should apply desktop styles', () => {
    // 画面サイズを変更
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1200,
    });

    render(<ResponsiveComponent />);

    const element = screen.getByRole('main');
    expect(element).toHaveClass('lg:p-8');
  });
});
```

## 教訓・ポイント

### ✅ 成功パターン

- **モバイルファースト**: 小さな画面から大きな画面への拡張
- **デザイントークン**: 一貫性のあるデザインシステム
- **適切なブレークポイント**: 実際のデバイスサイズを考慮
- **パフォーマンス最適化**: 不要なスタイルの削除

### ❌ 避けるべきパターン

- **デスクトップファースト**: 大画面からの縮小は非効率
- **冗長なクラス**: `md:p-4` のような不要なクラス
- **固定サイズ**: 柔軟性のない固定サイズ設定
- **パフォーマンス無視**: 重いスタイルの無駄遣い

### 🔧 実装時の注意点

- **テスト確認**: 各画面サイズでの動作確認
- **アクセシビリティ**: 小画面でのタップ領域確保
- **パフォーマンス**: 不要なスタイルの除去
- **一貫性**: デザイントークンの統一使用

## 参考資料

- [Tailwind CSS Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Web Responsive Design Patterns](https://web.dev/responsive-web-design-basics/)
- [開発規約](../../03.developmentAgreement.md)

## 更新履歴

- 2025-07-03: 初版作成（Issue #34 Canvas レスポンシブ実装知見を基に）
