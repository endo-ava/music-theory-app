import type { Meta, StoryObj } from '@storybook/react';
import { within, expect, userEvent } from '@storybook/test';
import { ViewController } from '../components/ViewController';
import { useHubStore } from '@/stores/hubStore';

const meta: Meta<typeof ViewController> = {
  title: 'Features/ViewController',
  component: ViewController,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Hub画面のView Controller（C-1）コンポーネント。音楽理論の「世界観（レンズ）」を選択するための制御インターフェース。useViewControllerフックでビジネスロジックを管理し、HubRadioGroupとHubOptionButtonの子コンポーネントで構成されています。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'カスタムクラス名（外部レイアウト制御用）',
    },
    title: {
      control: 'text',
      description: 'コンポーネントの見出し（デフォルト: "View Controller"）',
    },
  },
  decorators: [
    Story => (
      <div className="flex min-h-[500px] items-center justify-center bg-gradient-to-b from-gray-900 to-black p-8">
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
          'デフォルトの設定でViewControllerを表示します。useViewControllerフックで管理される状態と、HubRadioGroupによるラジオボタンUI、選択されたHubの説明文が表示されます。',
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
        story:
          'カスタムタイトルを設定したViewControllerです。デフォルトの"View Controller"から変更されています。',
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
          'ViewControllerコンポーネントの基本的なインタラクション動作をテストします。useViewControllerフックの状態管理、HubRadioGroupのラジオボタン機能、説明文の動的表示を検証します。',
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
    expect(title).toHaveTextContent('View Controller');

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
          'Hub種類切り替え機能の自動テストです。useViewControllerフックの状態管理とHubRadioGroupのインタラクションが正しく連携することを確認します。',
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
          'ViewControllerコンポーネントのアクセシビリティ要件をテストします。HubRadioGroupのroving tabindexパターン、適切なARIA属性、キーボードナビゲーション対応を確認します。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 見出しの確認
    const heading = canvas.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('View Controller');

    // ラジオグループの確認
    const radioGroup = canvas.getByRole('radiogroup');
    expect(radioGroup).toHaveAttribute('aria-label', 'Hub種類の選択');

    // ラジオボタンの確認
    const circleButton = canvas.getByRole('radio', { name: '五度圏' });
    const chromaticButton = canvas.getByRole('radio', { name: 'クロマチック' });

    // roving tabindexパターンの確認
    expect(circleButton).toHaveAttribute('tabindex', '0'); // 選択されているボタンはfocusable
    expect(chromaticButton).toHaveAttribute('tabindex', '-1'); // 非選択はnon-focusable

    // フォーカス可能であることを確認
    circleButton.focus();
    expect(circleButton).toHaveFocus();

    // 説明との関連付け確認
    expect(circleButton).toHaveAttribute('aria-describedby', 'circle-of-fifths-description');
    expect(chromaticButton).toHaveAttribute('aria-describedby', 'chromatic-circle-description');
  },
};

/**
 * キーボードナビゲーションテスト
 */
export const KeyboardNavigationTest: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          'useViewControllerフックが提供するキーボードナビゲーション機能をテストします。Arrow keys、Home、Endキーによるroving tabindexパターンの実装を確認します。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 初期状態を設定
    useHubStore.setState({ hubType: 'circle-of-fifths' });

    const circleButton = canvas.getByRole('radio', { name: '五度圏' });
    const chromaticButton = canvas.getByRole('radio', { name: 'クロマチック' });

    // 初期フォーカス確認
    circleButton.focus();
    expect(circleButton).toHaveFocus();

    // roving tabindexパターンの確認
    expect(circleButton).toHaveAttribute('tabindex', '0');
    expect(chromaticButton).toHaveAttribute('tabindex', '-1');

    // Arrowキーでの移動テスト
    await userEvent.keyboard('{ArrowRight}');
    expect(chromaticButton).toHaveFocus();
    expect(chromaticButton).toHaveAttribute('aria-checked', 'true');

    await userEvent.keyboard('{ArrowLeft}');
    expect(circleButton).toHaveFocus();
    expect(circleButton).toHaveAttribute('aria-checked', 'true');

    // Homeキーでの移動テスト
    await userEvent.keyboard('{Home}');
    expect(circleButton).toHaveFocus();

    // Endキーでの移動テスト
    await userEvent.keyboard('{End}');
    expect(chromaticButton).toHaveFocus();
    expect(chromaticButton).toHaveAttribute('aria-checked', 'true');
  },
};

/**
 * カスタムスタイルのViewController
 */
export const CustomStyle: Story = {
  args: {
    className: 'border-l-4 border-blue-500 pl-4 bg-blue-50/20 rounded-md',
  },
  parameters: {
    docs: {
      description: {
        story:
          'カスタムスタイルを適用したViewControllerです。className propsを使用して外部レイアウトやスタイルをカスタマイズできます。',
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
