import type { Meta, StoryObj } from '@storybook/react';
import { within, expect, userEvent } from '@storybook/test';
import { HubTitle } from '../components/HubTitle';
import { useHubStore } from '@/stores/hubStore';

const meta: Meta<typeof HubTitle> = {
  title: 'Components/Canvas/HubTitle',
  component: HubTitle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Hub の種類に応じたタイトルを表示するクライアントコンポーネント。useHubStore を使用してHub状態管理と連携し、五度圏やクロマチックサークルなどのタイトルを動的に表示します。',
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
      <div className="flex min-h-[200px] items-center justify-center bg-gray-50 p-8">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルトのHubTitle表示（五度圏）
 */
export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'デフォルトの設定でHubTitleを表示します。初期状態では「五度圏」が表示されます。',
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
          'HubTitleコンポーネントの基本的なインタラクション動作をテストします。状態管理との連携を確認します。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // テスト開始前にストアを初期状態に確実にセット
    useHubStore.setState({ hubType: 'circle-of-fifths' });

    // HubTitleの表示確認
    const hubTitle = canvas.getByRole('heading', { level: 1 });
    expect(hubTitle).toBeInTheDocument();
    expect(hubTitle).toHaveTextContent('Circle of Fifths');

    // セマンティクスの確認
    expect(hubTitle).toHaveClass('text-title');
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
          'HubTitleコンポーネントのアクセシビリティ要件をテストします。適切な見出しレベル、セマンティクスを確認します。',
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
 * カスタムスタイルのHubTitle
 */
export const CustomStyle: Story = {
  args: {
    className: 'text-blue-600 text-4xl font-bold',
  },
  parameters: {
    docs: {
      description: {
        story:
          'カスタムスタイルを適用したHubTitleです。色、サイズ、フォントウェイトをカスタマイズできます。',
      },
    },
  },
};

/**
 * Hub状態変更のデモンストレーション
 */
export const HubTypeDemo: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          'Hub種類を切り替えるデモンストレーションです。ボタンをクリックしてタイトルの変化を確認できます。',
      },
    },
  },
  decorators: [
    Story => {
      const { hubType, setHubType } = useHubStore();

      return (
        <div className="flex min-h-[300px] flex-col items-center justify-center space-y-8 bg-gray-50 p-8">
          <Story />
          <div className="flex space-x-4">
            <button
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
          <p className="text-sm text-gray-600">
            現在のHub種類: <span className="font-mono font-bold">{hubType}</span>
          </p>
        </div>
      );
    },
  ],
};

/**
 * Hub状態変更のインタラクションテスト
 */
export const HubTypeSwitchTest: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          'Hub種類切り替え機能の自動テストです。ボタンクリックでタイトルが正しく変更されることを確認します。',
      },
    },
  },
  decorators: [
    Story => {
      const { hubType, setHubType } = useHubStore();

      return (
        <div className="flex min-h-[300px] flex-col items-center justify-center space-y-8 bg-gray-50 p-8">
          <Story />
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
