import type { Meta, StoryObj } from '@storybook/react';
import { within, expect, userEvent } from '@storybook/test';
import { KeyController } from '../components/KeyController';
import { useCurrentKeyStore } from '@/stores/currentKeyStore';
import { Key } from '@/domain/key';
import { PitchClass } from '@/domain/common';

const meta: Meta<typeof KeyController> = {
  title: 'Components/KeyController',
  component: KeyController,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Hub画面のKey Controller（C-2）コンポーネント。音楽的文脈（キー/モード）を設定するための制御インターフェース。Tonic（主音）とMode（旋法）を直感的に選択でき、currentKeyStoreと連携して状態管理を行います。',
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
      description: 'コンポーネントの見出し（デフォルト: "Key"）',
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
 * デフォルトのKeyController表示
 */
export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          'デフォルトの設定でKeyControllerを表示します。12音のTonicセレクターと、Major/Minorモード選択UI、現在のキー表示が含まれます。',
      },
    },
  },
};

/**
 * カスタムタイトルのKeyController
 */
export const CustomTitle: Story = {
  args: {
    title: 'キーの選択',
  },
  parameters: {
    docs: {
      description: {
        story:
          'カスタムタイトルを設定したKeyControllerです。デフォルトの"Key"から変更されています。',
      },
    },
  },
};

/**
 * 基本インタラクションテスト
 */
export const InteractiveTest: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          'KeyControllerコンポーネントの基本的なインタラクション動作をテストします。Tonicボタンの選択状態、モード切り替え、状態管理を検証します。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // テスト開始前にストアを初期状態に確実にセット（C Major）
    useCurrentKeyStore.setState({ currentKey: Key.major(PitchClass.C) });

    // KeyControllerの表示確認
    const title = canvas.getByRole('heading', { level: 2 });
    expect(title).toHaveTextContent('Key');

    // TonicセレクションUIの確認
    const tonicHeading = canvas.getByRole('heading', { level: 3, name: 'Tonic' });
    expect(tonicHeading).toBeInTheDocument();

    // ModeセレクションUIの確認
    const modeHeading = canvas.getByRole('heading', { level: 3, name: 'Mode' });
    expect(modeHeading).toBeInTheDocument();

    // 初期状態でCボタンが選択されていることを確認
    const cButton = canvas.getByLabelText('Select C major key');
    expect(cButton).toBeInTheDocument();
    expect(cButton).toHaveAttribute('aria-pressed', 'true');

    // 初期状態でMajorモードが選択されていることを確認
    const majorButton = canvas.getByLabelText('Select major mode');
    const minorButton = canvas.getByLabelText('Select minor mode');
    expect(majorButton).toHaveAttribute('aria-pressed', 'true');
    expect(minorButton).toHaveAttribute('aria-pressed', 'false');

    // 現在のキー表示確認
    expect(canvas.getByText('Current:')).toBeInTheDocument();
    expect(canvas.getByText('C Major')).toBeInTheDocument();
  },
};

/**
 * Tonic選択テスト
 */
export const TonicSelectionTest: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          'Tonic（主音）選択機能の自動テストです。異なるTonicボタンをクリックして状態が正しく更新されることを確認します。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // テスト開始前にストアを初期状態に設定
    useCurrentKeyStore.setState({ currentKey: Key.major(PitchClass.C) });

    // 初期状態の確認
    const cButton = canvas.getByLabelText('Select C major key');
    expect(cButton).toHaveAttribute('aria-pressed', 'true');
    expect(canvas.getByText('C Major')).toBeInTheDocument();

    // Gボタンをクリック
    const gButton = canvas.getByLabelText('Select G major key');
    await userEvent.click(gButton);

    // 状態が切り替わったことを確認
    expect(cButton).toHaveAttribute('aria-pressed', 'false');
    expect(gButton).toHaveAttribute('aria-pressed', 'true');
    expect(canvas.getByText('G Major')).toBeInTheDocument();

    // Fボタンをクリック
    const fButton = canvas.getByLabelText('Select F major key');
    await userEvent.click(fButton);

    // 状態が切り替わったことを確認
    expect(gButton).toHaveAttribute('aria-pressed', 'false');
    expect(fButton).toHaveAttribute('aria-pressed', 'true');
    expect(canvas.getByText('F Major')).toBeInTheDocument();
  },
};

/**
 * Mode切り替えテスト
 */
export const ModeSwitchTest: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          'Mode（調性）切り替え機能の自動テストです。Major/Minor間の切り替えが正しく動作し、tonicが保持されることを確認します。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // テスト開始前にストアを初期状態に設定
    useCurrentKeyStore.setState({ currentKey: Key.major(PitchClass.C) });

    // 初期状態の確認
    const majorButton = canvas.getByLabelText('Select major mode');
    const minorButton = canvas.getByLabelText('Select minor mode');

    expect(majorButton).toHaveAttribute('aria-pressed', 'true');
    expect(minorButton).toHaveAttribute('aria-pressed', 'false');
    expect(canvas.getByText('C Major')).toBeInTheDocument();

    // Minorボタンをクリック
    await userEvent.click(minorButton);

    // 状態が切り替わったことを確認
    expect(majorButton).toHaveAttribute('aria-pressed', 'false');
    expect(minorButton).toHaveAttribute('aria-pressed', 'true');
    expect(canvas.getByText('C Minor')).toBeInTheDocument();

    // Majorボタンをクリックして戻す
    await userEvent.click(majorButton);

    // 元の状態に戻ったことを確認
    expect(majorButton).toHaveAttribute('aria-pressed', 'true');
    expect(minorButton).toHaveAttribute('aria-pressed', 'false');
    expect(canvas.getByText('C Major')).toBeInTheDocument();
  },
};

/**
 * 複合操作テスト（TonicとMode）
 */
export const ComplexInteractionTest: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          'TonicとModeの複合操作をテストします。異なるTonicでMode切り替え、Minorモードでのtonic変更など、実際のユースケースを想定した操作を検証します。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // テスト開始前にストアを初期状態に設定
    useCurrentKeyStore.setState({ currentKey: Key.major(PitchClass.C) });

    // 1. C Major → A Major
    const aButton = canvas.getByLabelText('Select A major key');
    await userEvent.click(aButton);
    expect(canvas.getByText('A Major')).toBeInTheDocument();

    // 2. A Major → A Minor（tonicを維持してmodeを変更）
    const minorButton = canvas.getByLabelText('Select minor mode');
    await userEvent.click(minorButton);
    expect(canvas.getByText('A Minor')).toBeInTheDocument();
    expect(aButton).toHaveAttribute('aria-pressed', 'true');

    // 3. A Minor → D Minor（modeを維持してtonicを変更）
    const dButton = canvas.getByLabelText('Select D minor key');
    await userEvent.click(dButton);
    expect(canvas.getByText('D Minor')).toBeInTheDocument();
    expect(minorButton).toHaveAttribute('aria-pressed', 'true');
    expect(dButton).toHaveAttribute('aria-pressed', 'true');

    // 4. D Minor → D Major
    const majorButton = canvas.getByLabelText('Select major mode');
    await userEvent.click(majorButton);
    expect(canvas.getByText('D Major')).toBeInTheDocument();
    expect(dButton).toHaveAttribute('aria-pressed', 'true');
    expect(majorButton).toHaveAttribute('aria-pressed', 'true');
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
          'KeyControllerコンポーネントのアクセシビリティ要件をテストします。適切なARIA属性、キーボードフォーカス、ラベルの関連付けを確認します。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 見出しの確認
    const keyHeading = canvas.getByRole('heading', { level: 2, name: 'Key' });
    const tonicHeading = canvas.getByRole('heading', { level: 3, name: 'Tonic' });
    const modeHeading = canvas.getByRole('heading', { level: 3, name: 'Mode' });

    expect(keyHeading).toBeInTheDocument();
    expect(tonicHeading).toBeInTheDocument();
    expect(modeHeading).toBeInTheDocument();

    // 全てのTonicボタンの確認
    const expectedTonics = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#', 'F'];
    for (const tonic of expectedTonics) {
      const button = canvas.getByLabelText(
        new RegExp(`Select ${tonic.replace('#', '#')} (major|minor) key`)
      );
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('aria-pressed');
    }

    // Modeボタンの確認
    const majorButton = canvas.getByLabelText('Select major mode');
    const minorButton = canvas.getByLabelText('Select minor mode');

    expect(majorButton).toHaveAttribute('aria-pressed');
    expect(minorButton).toHaveAttribute('aria-pressed');

    // フォーカス可能であることを確認
    const cButton = canvas.getByLabelText('Select C major key');
    cButton.focus();
    expect(cButton).toHaveFocus();

    majorButton.focus();
    expect(majorButton).toHaveFocus();
  },
};

/**
 * カスタムスタイルのKeyController
 */
export const CustomStyle: Story = {
  args: {
    className: 'border-2 border-purple-500 p-4 bg-purple-50/10 rounded-lg',
  },
  parameters: {
    docs: {
      description: {
        story:
          'カスタムスタイルを適用したKeyControllerです。className propsを使用して外部レイアウトやスタイルをカスタマイズできます。',
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
