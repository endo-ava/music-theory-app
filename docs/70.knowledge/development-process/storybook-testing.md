# Storybook テスト戦略

## 概要

Storybook を使用したビジュアルファーストのテスト戦略を蓄積します。
CSF (Component Story Format) 3.0 を活用し、インタラクションテスト、アクセシビリティテスト、レスポンシブテストを統合的に実施する手法を記録します。

## CSF 3.0 基本実装パターン

### 1. Meta 設定の基本構造

```typescript
// Canvas.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Canvas } from '../components/Canvas';

const meta: Meta<typeof Canvas> = {
  title: 'Components/Canvas',
  component: Canvas,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'app-bg', // カスタム背景の設定
    },
    docs: {
      description: {
        component: 'コンポーネントの詳細説明...',
      },
    },
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: false, // 必要に応じてルールを無効化
          },
        ],
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'カスタムクラス名',
    },
  },
  decorators: [
    Story => (
      <div className="min-h-screen w-full bg-gradient-to-b from-gray-900 to-black text-white">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;
```

### 2. Story の種類別実装

```typescript
// 基本的なStory
export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'デフォルトの設定でCanvasを表示します。',
      },
    },
  },
};

// インタラクションテスト
export const InteractiveTest: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 要素の存在確認
    const mainArea = canvas.getByRole('main');
    expect(mainArea).toBeInTheDocument();

    // 属性の確認
    expect(mainArea).toHaveAttribute('aria-label', 'メイン表示エリア');

    // 内容の確認
    const hubTitle = canvas.getByRole('heading', { level: 1 });
    expect(hubTitle).toHaveTextContent('五度圏');
  },
};
```

## テスト戦略の分類

### 1. インタラクションテスト

```typescript
export const InteractiveTest: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // DOM要素の存在確認
    const mainArea = canvas.getByRole('main');
    expect(mainArea).toBeInTheDocument();

    // 属性の確認
    expect(mainArea).toHaveAttribute('aria-label', 'メイン表示エリア');

    // テキスト内容の確認
    const hubTitle = canvas.getByRole('heading', { level: 1 });
    expect(hubTitle).toHaveTextContent('五度圏');

    // 画像要素の確認（信頼性の高い方法）
    const circleOfFifths = canvas.getByLabelText('五度圏');
    expect(circleOfFifths).toBeInTheDocument();
  },
};
```

### 2. アクセシビリティテスト

```typescript
export const AccessibilityTest: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // セマンティックHTML要素の確認
    const mainArea = canvas.getByRole('main');
    expect(mainArea).toBeInTheDocument();

    // 見出しの階層構造確認
    const heading = canvas.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();

    // 画像の代替テキスト確認
    const image = canvas.getByRole('img');
    expect(image).toHaveAttribute('aria-label');
  },
};
```

### 3. レスポンシブテスト

```typescript
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
    const mainArea = canvas.getByRole('main');
    expect(mainArea).toHaveClass('w-full', 'h-full');
    expect(mainArea).toHaveClass('p-4', 'lg:p-8');
  },
};
```

## 状態管理のテスト

### 1. 状態依存コンポーネントのテスト

```typescript
// HubTitle.stories.tsx
import { useHubStore } from '../store/hubStore';

export const StateManagementTest: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 状態の明示的な初期化
    useHubStore.setState({ hubType: 'circle-of-fifths' });

    // 初期状態の確認
    const title = canvas.getByRole('heading', { level: 1 });
    expect(title).toHaveTextContent('五度圏');

    // 状態変更テスト
    useHubStore.setState({ hubType: 'chromatic-circle' });
    await waitFor(() => {
      expect(title).toHaveTextContent('クロマチックサークル');
    });

    // 状態リセット
    useHubStore.setState({ hubType: 'circle-of-fifths' });
  },
};
```

### 2. 状態の初期化パターン

```typescript
// 各テストでの状態初期化
play: async ({ canvasElement }) => {
  // テスト開始時に必ず状態を初期化
  useHubStore.setState({ hubType: 'circle-of-fifths' });

  const canvas = within(canvasElement);
  // テスト実行...
};
```

## 高度なテスト手法

### 1. 非同期処理のテスト

```typescript
export const AsyncTest: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 非同期で表示される要素の待機
    await waitFor(() => {
      const asyncElement = canvas.getByTestId('async-content');
      expect(asyncElement).toBeInTheDocument();
    });

    // タイムアウト設定
    await waitFor(
      () => {
        const element = canvas.getByText('読み込み完了');
        expect(element).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  },
};
```

### 2. ユーザーイベントのシミュレーション

```typescript
import { userEvent } from '@storybook/test';

export const UserInteractionTest: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    // クリックイベントのシミュレーション
    const button = canvas.getByRole('button');
    await user.click(button);

    // キーボードイベントのシミュレーション
    const input = canvas.getByRole('textbox');
    await user.type(input, 'テスト入力');

    // 結果の確認
    expect(input).toHaveValue('テスト入力');
  },
};
```

## 設定とメンテナンス

### 1. Storybook 設定の最適化

```typescript
// .storybook/preview.ts
export const parameters = {
  backgrounds: {
    default: 'app-bg',
    values: [
      { name: 'app-bg', value: 'linear-gradient(to bottom, #111827, #000000)' },
      { name: 'light', value: '#ffffff' },
    ],
  },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
```

### 2. デコレータの活用

```typescript
// 共通デコレータ
const DarkThemeDecorator = (Story: any) => (
  <div className="min-h-screen w-full bg-gradient-to-b from-gray-900 to-black text-white">
    <Story />
  </div>
);

// 複数のデコレータ
decorators: [
  DarkThemeDecorator,
  (Story) => (
    <div className="p-8">
      <Story />
    </div>
  ),
],
```

## 教訓・ポイント

### ✅ 成功パターン

- **明示的な状態初期化**: テスト間の状態汚染を防ぐ
- **セマンティックなセレクター**: `getByRole` や `getByLabelText` の使用
- **包括的なテスト**: インタラクション、アクセシビリティ、レスポンシブを統合
- **適切なデコレータ**: 視覚的な一貫性を保つ

### ❌ 避けるべきパターン

- **脆弱なセレクター**: `getByRole('img')` よりも `getByLabelText()` を優先
- **状態の汚染**: テスト間での状態の影響
- **過度に複雑なテスト**: 一つのテストで多くのことを確認しすぎない
- **非同期処理の未考慮**: 適切な待機処理を実装

### 🔧 実装時の注意点

- **テストの信頼性**: 安定したセレクターとアサーションを使用
- **パフォーマンス**: 不要な再レンダリングを避ける
- **保守性**: テストの意図を明確に記述
- **視覚的な一貫性**: 適切な背景と装飾を設定

## 参考資料

- [Storybook 公式ドキュメント](https://storybook.js.org/docs/react/get-started/introduction)
- [Component Story Format 3.0](https://storybook.js.org/docs/react/api/csf)
- [Storybook Testing](https://storybook.js.org/docs/react/writing-tests/introduction)
- [開発規約](../../03.developmentAgreement.md)

## 更新履歴

- 2025-07-03: 初版作成（Issue #34 Canvas Storybook 実装知見を基に）
