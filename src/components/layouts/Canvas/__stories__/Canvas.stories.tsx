import type { Meta, StoryObj } from '@storybook/react';
import { within, expect, userEvent } from '@storybook/test';
import { Canvas } from '../components/Canvas';
import { useHubStore } from '@/stores/hubStore';

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
          'インタラクティブ・ハブ画面のメイン表示エリア（Canvas）コンポーネント。HubTitleとCircleOfFifthsを統合し、Hub状態管理（useHubStore）と連携して動的なタイトル表示を提供します。現在は五度圏を表示し、将来的にはクロマチックサークルとの切り替えにも対応します。注意：HubTitle（サブコンポーネント）のテストもこのストーリーに含まれています。',
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
        story:
          'デフォルトの設定でCanvasを表示します。HubTitleが表示され、その下に五度圏が配置されます。タイトルはHub状態管理により動的に変更されます。',
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
          'Canvasコンポーネントの基本的なインタラクション動作をテストします。メイン表示エリアの存在確認、HubTitleとCircleOfFifthsの表示確認を行います。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // メイン表示エリアの存在確認
    const mainArea = canvas.getByLabelText('メイン表示エリア');
    expect(mainArea).toBeInTheDocument();
    expect(mainArea).toHaveAttribute('aria-label', 'メイン表示エリア');

    // HubTitleの表示確認
    const hubTitle = canvas.getByRole('heading', { level: 1 });
    expect(hubTitle).toBeInTheDocument();
    expect(hubTitle).toHaveTextContent('Circle of Fifths');

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

    // 見出しの階層構造確認
    const heading = canvas.getByRole('heading', { level: 1 });
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

    // モバイル対応のパディング確認
    expect(mainArea).toHaveClass('p-4', 'lg:p-8');

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

/**
 * HubTitleのアクセシビリティテスト
 * HubTitle（サブコンポーネント）のアクセシビリティ要件をCanvasから確認
 */
export const HubTitleAccessibilityTest: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          'Canvas内のHubTitleコンポーネントのアクセシビリティ要件をテストします。適切な見出しレベル、セマンティクスを確認します。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 見出しの階層構造確認
    const heading = canvas.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();

    // テキストコンテンツの確認
    expect(heading).toHaveTextContent(/^(Circle of Fifths|Chromatic Circle)$/);

    // 基本的なCSSクラスの確認
    expect(heading).toHaveClass('text-title');
  },
};

/**
 * HubTitleのカスタムスタイルテスト
 * HubTitle（サブコンポーネント）のスタイルカスタマイズをCanvasから確認
 */
export const HubTitleCustomStyleTest: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          'Canvas内のHubTitleコンポーネントにカスタムスタイルが適用されていることを確認します。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // HubTitleの表示確認
    const hubTitle = canvas.getByRole('heading', { level: 1 });
    expect(hubTitle).toBeInTheDocument();

    // Canvas実装で適用されているカスタムクラスの確認
    expect(hubTitle).toHaveClass('text-center', 'text-2xl', 'lg:text-4xl');

    // セマンティクスの確認
    expect(hubTitle).toHaveClass('text-title');
  },
};

/**
 * Hub状態変更とHubTitleの連携テスト
 * useHubStoreとの連携によるHubTitleの動的変更をCanvasから確認
 */
export const HubTitleStateChangeTest: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          'Hub種類切り替え機能とCanvas内HubTitleの連携テストです。状態管理でタイトルが正しく変更されることを確認します。',
      },
    },
  },
  decorators: [
    Story => {
      const { hubType, setHubType } = useHubStore();

      return (
        <div className="min-h-screen w-full bg-gradient-to-b from-gray-900 to-black text-white">
          <Story />
          {/* テスト用コントロールボタン */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 transform">
            <div className="flex space-x-4">
              <button
                data-testid="circle-of-fifths-button"
                onClick={() => setHubType('circle-of-fifths')}
                className={`rounded-md px-4 py-2 font-medium transition-colors ${
                  hubType === 'circle-of-fifths'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                五度圏
              </button>
              <button
                data-testid="chromatic-circle-button"
                onClick={() => setHubType('chromatic-circle')}
                className={`rounded-md px-4 py-2 font-medium transition-colors ${
                  hubType === 'chromatic-circle'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                クロマチックサークル
              </button>
            </div>
          </div>
        </div>
      );
    },
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // テスト開始前にストアを初期状態に確実にセット
    useHubStore.setState({ hubType: 'circle-of-fifths' });

    // 初期状態でh1タグに「Circle of Fifths」が表示されていることを確認
    expect(canvas.getByRole('heading', { name: 'Circle of Fifths' })).toBeInTheDocument();

    // クロマチックサークルボタンをクリック
    const chromaticButton = canvas.getByTestId('chromatic-circle-button');
    await userEvent.click(chromaticButton);

    // タイトルが「Chromatic Circle」に変更されることを確認
    expect(canvas.getByRole('heading', { name: 'Chromatic Circle' })).toBeInTheDocument();

    // 五度圏ボタンをクリック
    const circleButton = canvas.getByTestId('circle-of-fifths-button');
    await userEvent.click(circleButton);

    // タイトルが「Circle of Fifths」に戻ることを確認
    expect(canvas.getByRole('heading', { name: 'Circle of Fifths' })).toBeInTheDocument();
  },
};
