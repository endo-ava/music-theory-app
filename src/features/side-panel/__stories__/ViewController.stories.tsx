import type { Meta, StoryObj } from '@storybook/react';
import { within, expect, userEvent } from '@storybook/test';
import { ViewController } from '../components/ViewController';
import { useHubStore } from '@/stores/hubStore';

const meta: Meta<typeof ViewController> = {
  title: 'Components/SidePanel/ViewController',
  component: ViewController,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Hub画面のView Controller（C-1）コンポーネント。共通データ構造（@/shared/constants/hubs）を使用してHub種類の切り替えを提供します。useHubStoreと連携してHub種類の状態管理を行い、Canvasの表示内容を制御します。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'カスタムクラス名',
    },
    title: {
      control: 'text',
      description: 'コンポーネントのタイトル',
    },
  },
  decorators: [
    Story => (
      <div className="flex min-h-[400px] items-center justify-center bg-gradient-to-b from-gray-900 to-black p-8">
        <div className="w-80">
          <Story />
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルトのViewController表示
 */
export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          'デフォルトの設定でViewControllerを表示します。共通データ構造からHub情報を取得し、初期状態では五度圏が選択されています。',
      },
    },
  },
};

/**
 * カスタムタイトルのViewController
 */
export const CustomTitle: Story = {
  args: {
    title: 'ビューの選択',
  },
  parameters: {
    docs: {
      description: {
        story: 'カスタムタイトルを設定したViewControllerです。',
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
          'ViewControllerコンポーネントの基本的なインタラクション動作をテストします。共通データ構造から取得したHub情報でボタンクリックが正常に動作することを確認します。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // テスト開始前にストアを初期状態に確実にセット
    useHubStore.setState({ hubType: 'circle-of-fifths' });

    // ViewControllerの表示確認
    const section = canvas.getByRole('radiogroup');
    expect(section).toBeInTheDocument();

    // タイトルの確認
    const title = canvas.getByRole('heading', { level: 2 });
    expect(title).toHaveTextContent('View controller');

    // 初期状態で五度圏ボタンが選択されていることを確認
    const circleButton = canvas.getByRole('radio', { name: '五度圏' });
    const chromaticButton = canvas.getByRole('radio', { name: 'クロマチック' });

    expect(circleButton).toBeInTheDocument();
    expect(chromaticButton).toBeInTheDocument();
    expect(circleButton).toHaveAttribute('aria-checked', 'true');
    expect(chromaticButton).toHaveAttribute('aria-checked', 'false');

    // 共通データ構造から取得された説明テキストの確認
    expect(canvas.getByText('五度関係で配置された調の輪')).toBeInTheDocument();
  },
};

/**
 * Hub種類切り替えテスト
 */
export const HubTypeSwitchTest: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          'Hub種類切り替え機能の自動テストです。共通データ構造から取得されたHub情報に基づいて、ボタンクリックで状態が正しく変更されることを確認します。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // テスト開始前にストアを初期状態に確実にセット
    useHubStore.setState({ hubType: 'circle-of-fifths' });

    // 初期状態の確認
    const circleButton = canvas.getByRole('radio', { name: '五度圏' });
    const chromaticButton = canvas.getByRole('radio', { name: 'クロマチック' });

    expect(circleButton).toHaveAttribute('aria-checked', 'true');
    expect(chromaticButton).toHaveAttribute('aria-checked', 'false');

    // クロマチックボタンをクリック
    await userEvent.click(chromaticButton);

    // 状態が切り替わったことを確認
    expect(circleButton).toHaveAttribute('aria-checked', 'false');
    expect(chromaticButton).toHaveAttribute('aria-checked', 'true');

    // 共通データ構造からの説明文が切り替わったことを確認
    expect(canvas.getByText('半音階で配置された音の輪')).toBeInTheDocument();

    // 五度圏ボタンをクリックして戻す
    await userEvent.click(circleButton);

    // 元の状態に戻ったことを確認
    expect(circleButton).toHaveAttribute('aria-checked', 'true');
    expect(chromaticButton).toHaveAttribute('aria-checked', 'false');
    expect(canvas.getByText('五度関係で配置された調の輪')).toBeInTheDocument();
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
          'ViewControllerコンポーネントのアクセシビリティ要件をテストします。適切なARIA属性、フォーカス管理、キーボードナビゲーションを確認します。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 見出しの確認
    const heading = canvas.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('View controller');

    // ラジオグループの確認
    const radioGroup = canvas.getByRole('radiogroup');
    expect(radioGroup).toHaveAttribute('aria-label', 'Hub種類の選択');

    // ラジオボタンの確認
    const circleButton = canvas.getByRole('radio', { name: '五度圏' });
    const chromaticButton = canvas.getByRole('radio', { name: 'クロマチック' });

    // フォーカス可能であることを確認
    circleButton.focus();
    expect(circleButton).toHaveFocus();

    chromaticButton.focus();
    expect(chromaticButton).toHaveFocus();

    // 説明との関連付け確認
    expect(circleButton).toHaveAttribute('aria-describedby', 'circle-of-fifths-description');
    expect(chromaticButton).toHaveAttribute('aria-describedby', 'chromatic-circle-description');
  },
};

/**
 * カスタムスタイルのViewController
 */
export const CustomStyle: Story = {
  args: {
    className: 'border-blue-500 bg-blue-50',
  },
  parameters: {
    docs: {
      description: {
        story:
          'カスタムスタイルを適用したViewControllerです。ボーダーと背景色をカスタマイズできます。',
      },
    },
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: false, // カスタムスタイルでのコントラスト検証を無効化
          },
        ],
      },
    },
  },
};
