import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Canvas } from '../components/Canvas';
import { CanvasDriver } from './Canvas.driver';

const meta: Meta<typeof Canvas> = {
  title: 'Components/Layouts/Canvas',
  component: Canvas,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'app-bg',
    },
    docs: {
      description: {
        component:
          'インタラクティブ・ハブ画面のメイン表示エリア（Canvas）コンポーネント。CircleOfFifthsを表示し、Hub状態管理（useHubStore）と連携します。現在は五度圏を表示し、将来的にはクロマチックサークルとの切り替えにも対応します。',
      },
    },
    a11y: {
      config: {
        rules: [
          {
            // 色のコントラスト問題を一時的に無効化（デザイントークンで管理）
            id: 'color-contrast',
            enabled: false,
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

/**
 * デフォルトのCanvas表示
 */
export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'デフォルトの設定でCanvasを表示します。五度圏が表示され、Hub状態管理と連携します。',
      },
    },
  },
};

/**
 * インタラクションテスト
 */
export const InteractiveTest: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          'Canvasコンポーネントの基本的なインタラクション動作をテストします。メイン表示エリアの存在確認、CircleOfFifthsの表示確認を行います。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    // メイン表示エリアとCircleOfFifthsが正しく表示されることを確認
    const driver = new CanvasDriver(canvasElement);

    await driver.expectMainAreaVisible();
    await driver.expectCircleOfFifthsVisible();
  },
};

/**
 * アクセシビリティテスト
 */
export const AccessibilityTest: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          'Canvasコンポーネントのアクセシビリティ要件をテストします。適切なセマンティクス、ARIA属性、キーボードナビゲーションを確認します。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    // アクセシビリティ属性（ARIA、見出し構造、代替テキスト）が正しく設定されていることを確認
    const driver = new CanvasDriver(canvasElement);

    await driver.expectAccessibilityAttributes();
  },
};

/**
 * レスポンシブテスト
 */
export const ResponsiveTest: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          'Canvasコンポーネントのレスポンシブ対応をテストします。異なる画面サイズでの表示確認を行います。',
      },
    },
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: { width: '375px', height: '667px' },
        },
        tablet: {
          name: 'Tablet',
          styles: { width: '768px', height: '1024px' },
        },
        desktop: {
          name: 'Desktop',
          styles: { width: '1200px', height: '800px' },
        },
      },
    },
  },
  play: async ({ canvasElement }) => {
    // レスポンシブレイアウト（クラス、パディング、フレックス）が正しく適用されていることを確認
    const driver = new CanvasDriver(canvasElement);

    await driver.expectResponsiveLayout();
  },
};

/**
 * カスタムスタイルのCanvas
 */
export const CustomStyle: Story = {
  args: {
    className: 'bg-blue-50 border-blue-300',
  },
  parameters: {
    docs: {
      description: {
        story: 'カスタムスタイルを適用したCanvasです。背景色やボーダーをカスタマイズできます。',
      },
    },
  },
};
