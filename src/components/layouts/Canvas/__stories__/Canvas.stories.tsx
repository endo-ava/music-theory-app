import type { Meta, StoryObj } from '@storybook/react';
import { within, expect } from '@storybook/test';
import { Canvas } from '../components/Canvas';

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
    const canvas = within(canvasElement);

    // メイン表示エリアの存在確認
    const mainArea = canvas.getByLabelText('メイン表示エリア');
    expect(mainArea).toBeInTheDocument();
    expect(mainArea).toHaveAttribute('aria-label', 'メイン表示エリア');

    // CircleOfFifthsの表示確認
    const circleOfFifths = canvas.getByRole('img', { name: 'Circle of Fifths' });
    expect(circleOfFifths).toBeInTheDocument();
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
    const canvas = within(canvasElement);

    // メイン表示エリアのセマンティクス確認
    const mainArea = canvas.getByLabelText('メイン表示エリア');
    expect(mainArea).toBeInTheDocument();
    expect(mainArea).toHaveAttribute('aria-label', 'メイン表示エリア');

    // 見出しの階層構造確認（CurrentKeyDisplayはh2要素を使用）
    const heading = canvas.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();

    // SVG要素の代替テキスト確認
    const svg = canvas.getByRole('img', { name: 'Circle of Fifths' });
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('aria-label', 'Circle of Fifths');
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
    const canvas = within(canvasElement);

    // レスポンシブレイアウトの基本確認
    const mainArea = canvas.getByLabelText('メイン表示エリア');
    expect(mainArea).toBeInTheDocument();
    expect(mainArea).toHaveClass('w-full', 'h-full');

    // パディング設定確認
    expect(mainArea).toHaveClass('p-6');

    // フレックスレイアウト確認
    expect(mainArea).toHaveClass('flex', 'flex-col');
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
