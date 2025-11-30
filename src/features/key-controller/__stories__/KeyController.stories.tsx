import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within, userEvent, waitFor } from 'storybook/test';
import { KeyController } from '../components/KeyController';
import { useCurrentKeyStore } from '@/stores/currentKeyStore';
import { Key } from '@/domain/key';
import { PitchClass } from '@/domain/common';

const meta = {
  title: 'Features/KeyController',
  component: KeyController,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    Story => {
      // 各Storyの前にストアをC Majorにリセット
      const cMajor = Key.major(PitchClass.fromCircleOfFifths(0));
      useCurrentKeyStore.getState().setCurrentKey(cMajor);
      return <Story />;
    },
  ],
} satisfies Meta<typeof KeyController>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルト表示
 * C Majorキーが設定された初期状態
 */
export const Default: Story = {
  args: {},
};

/**
 * カスタムタイトル付き
 */
export const WithCustomTitle: Story = {
  args: {
    title: 'Musical Context',
  },
};

/**
 * Root選択のインタラクションテスト
 * RootSelectorを操作してD Majorに変更
 */
export const RootSelectionTest: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 初期状態: C Majorであることを確認
    expect(canvas.getByText('C Major')).toBeInTheDocument();

    // RootSelectorをクリック
    const rootSelector = canvas.getByRole('combobox');
    await userEvent.click(rootSelector);

    // Dのオプションを選択
    // SelectコンテンツはPortalでレンダリングされるため、canvasスコープ外を探索
    const dOption = await within(document.body).findByText('D');
    await userEvent.click(dOption);

    // 結果確認: D Majorになっていることを確認
    await waitFor(() => {
      expect(canvas.getByText('D Major')).toBeInTheDocument();
    });
  },
};

/**
 * Mode変更のインタラクションテスト
 * ModeSliderを操作してC Dorianに変更
 */
export const ModeChangeTest: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 初期状態: C Majorであることを確認
    // Current Keyバッジを確認
    expect(canvas.getByText('C Major')).toBeInTheDocument();

    // Dorianラベル（"Dor"）をクリック
    const dorianLabel = canvas.getByRole('button', { name: /Dor/i });
    await userEvent.click(dorianLabel);

    // 結果確認: C Dorianになっていることを確認
    await waitFor(() => {
      expect(canvas.getByText('C Dorian')).toBeInTheDocument();
    });
  },
};

/**
 * LydianからLocrianへの連続変更テスト
 * 最も明るいモードから最も暗いモードへのスライダー操作
 */
export const BrightnessRangeTest: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Current Keyバッジを確認

    // Lydian（最も明るい）に変更
    const lydianLabel = canvas.getByRole('button', { name: /Lyd/i });
    await userEvent.click(lydianLabel);

    await waitFor(() => {
      expect(canvas.getByText('C Lydian')).toBeInTheDocument();
    });

    // Locrian（最も暗い）に変更
    const locrianLabel = canvas.getByRole('button', { name: /Loc/i });
    await userEvent.click(locrianLabel);

    await waitFor(() => {
      expect(canvas.getByText('C Locrian')).toBeInTheDocument();
    });
  },
};

/**
 * RootとModeの統合テスト
 * RootとModeを両方操作してD Dorianを設定
 */
export const IntegrationTest: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Current Keyバッジを確認

    // 初期状態確認
    expect(canvas.getByText('C Major')).toBeInTheDocument();

    // Step 1: Root を D に変更
    const rootSelector = canvas.getByRole('combobox');
    await userEvent.click(rootSelector);

    // SelectコンテンツはPortalでレンダリングされるため、canvasスコープ外を探索
    const dOption = await within(document.body).findByText('D');
    await userEvent.click(dOption);

    await waitFor(() => {
      expect(canvas.getByText('D Major')).toBeInTheDocument();
    });

    // Step 2: Mode を Dorian に変更
    const dorianLabel = canvas.getByRole('button', { name: /Dor/i });
    await userEvent.click(dorianLabel);

    await waitFor(() => {
      expect(canvas.getByText('D Dorian')).toBeInTheDocument();
    });
  },
};

/**
 * Major⇔Minor切り替えテスト
 * よく使用される機能のクイック操作をテスト
 */
export const MajorMinorToggleTest: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Current Keyバッジを確認

    // 初期状態: C Major
    expect(canvas.getByText('C Major')).toBeInTheDocument();

    // Minor（Aeolian）に変更
    const minorLabel = canvas.getByRole('button', { name: /Aeo\/Min/i });
    await userEvent.click(minorLabel);

    await waitFor(() => {
      expect(canvas.getByText('C Minor')).toBeInTheDocument();
    });

    // 再びMajorに戻す
    const majorLabel = canvas.getByRole('button', { name: /Ion\/Maj/i });
    await userEvent.click(majorLabel);

    await waitFor(() => {
      expect(canvas.getByText('C Major')).toBeInTheDocument();
    });
  },
};

/**
 * 全モードのビジュアル確認用
 * 7つのモードすべてを順番に表示
 */
export const AllModesVisualCheck: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Current Keyバッジを確認

    // テスト用のモード名とラベル
    const modes = [
      { label: /Lyd/i, expected: 'C Lydian' },
      { label: /Ion\/Maj/i, expected: 'C Major' },
      { label: /Mix/i, expected: 'C Mixolydian' },
      { label: /Dor/i, expected: 'C Dorian' },
      { label: /Aeo\/Min/i, expected: 'C Minor' },
      { label: /Phr/i, expected: 'C Phrygian' },
      { label: /Loc/i, expected: 'C Locrian' },
    ];

    for (const mode of modes) {
      const modeLabel = canvas.getByRole('button', { name: mode.label });
      await userEvent.click(modeLabel);

      await waitFor(() => {
        expect(canvas.getByText(mode.expected)).toBeInTheDocument();
      });
    }
  },
};

/**
 * シャープ系のキー設定テスト
 * G Majorのような#系のキーを設定
 */
export const SharpKeyTest: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Current Keyバッジを確認

    // G Majorを設定
    const rootSelector = canvas.getByRole('combobox');
    await userEvent.click(rootSelector);

    // SelectコンテンツはPortalでレンダリングされるため、canvasスコープ外を探索
    const gOption = await within(document.body).findByText('G');
    await userEvent.click(gOption);

    await waitFor(() => {
      expect(canvas.getByText('G Major')).toBeInTheDocument();
    });
  },
};

/**
 * フラット系のキー設定テスト
 * F Majorのような♭系のキーを設定
 */
export const FlatKeyTest: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Current Keyバッジを確認

    // F Majorを設定
    const rootSelector = canvas.getByRole('combobox');
    await userEvent.click(rootSelector);

    // SelectコンテンツはPortalでレンダリングされるため、canvasスコープ外を探索
    const fOption = await within(document.body).findByText('F');
    await userEvent.click(fOption);

    await waitFor(() => {
      expect(canvas.getByText('F Major')).toBeInTheDocument();
    });
  },
};
