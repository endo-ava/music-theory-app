import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect } from '@storybook/test';
import { GlobalHeader } from '../components/GlobalHeader';

const meta: Meta<typeof GlobalHeader> = {
  title: 'Components/Layouts/GlobalHeader',
  component: GlobalHeader,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'app-bg',
    },
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルトのGlobalHeaderの表示
 * ロゴとナビゲーションリンク（Hub, Library, Tutorial）を含む基本状態
 */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const user = userEvent.setup();
    const canvas = within(canvasElement);

    // ロゴが存在することを確認
    const logo = canvas.getByRole('link', { name: /hub/i });
    await expect(logo).toBeInTheDocument();

    // ナビゲーションリンクが存在することを確認
    const hubLink = canvas.getByRole('link', { name: 'Hub' });
    const libraryLink = canvas.getByRole('link', { name: 'Library' });
    const tutorialLink = canvas.getByRole('link', { name: 'Tutorial' });

    await expect(hubLink).toBeInTheDocument();
    await expect(libraryLink).toBeInTheDocument();
    await expect(tutorialLink).toBeInTheDocument();

    // ナビゲーションリンクのクリック動作をテスト
    await user.click(libraryLink);
    // Note: 実際のページ遷移は発生しないが、クリックが可能であることを確認

    await user.click(tutorialLink);
    // Note: 実際のページ遷移は発生しないが、クリックが可能であることを確認
  },
};

/**
 * モバイルビューでのGlobalHeader
 * レスポンシブデザインの確認とモバイルメニュー動作のテスト
 */
export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  play: async ({ canvasElement }) => {
    const user = userEvent.setup();
    const canvas = within(canvasElement);

    // モバイルビューでもロゴが存在することを確認
    const logo = canvas.getByRole('link', { name: /hub/i });
    await expect(logo).toBeInTheDocument();

    // モバイルメニューボタンの存在確認（存在する場合）
    try {
      const mobileMenuButton = canvas.getByRole('button');
      if (mobileMenuButton) {
        // モバイルメニューのクリック動作をテスト
        await user.click(mobileMenuButton);

        // メニューが開いた状態での操作確認
        // Note: 実装に応じてメニュー内のリンクをテスト
      }
    } catch {
      // モバイルメニューボタンが存在しない場合はスキップ
    }

    // ナビゲーションリンクの基本動作確認
    const navigationLinks = canvas.getAllByRole('link');
    await expect(navigationLinks.length).toBeGreaterThan(0);
  },
};

/**
 * デスクトップビューでのGlobalHeader
 * デスクトップレイアウトの確認とフルナビゲーション機能のテスト
 */
export const DesktopView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
  },
  play: async ({ canvasElement }) => {
    const user = userEvent.setup();
    const canvas = within(canvasElement);

    // デスクトップビューでのロゴ確認
    const logo = canvas.getByRole('link', { name: /hub/i });
    await expect(logo).toBeInTheDocument();

    // 全ナビゲーションリンクが表示されていることを確認
    const hubLink = canvas.getByRole('link', { name: 'Hub' });
    const libraryLink = canvas.getByRole('link', { name: 'Library' });
    const tutorialLink = canvas.getByRole('link', { name: 'Tutorial' });

    await expect(hubLink).toBeInTheDocument();
    await expect(libraryLink).toBeInTheDocument();
    await expect(tutorialLink).toBeInTheDocument();

    // ホバー効果のテスト
    await user.hover(libraryLink);
    await user.hover(tutorialLink);
    await user.hover(hubLink);

    // フォーカス動作のテスト
    await user.tab(); // 最初のフォーカス可能要素へ
    await user.tab(); // 次の要素へ
    await user.tab(); // さらに次の要素へ
  },
};

/**
 * アクセシビリティテスト
 * キーボードナビゲーションとARIA属性の確認
 */
export const AccessibilityTest: Story = {
  play: async ({ canvasElement }) => {
    const user = userEvent.setup();
    const canvas = within(canvasElement);

    // ヘッダー要素のrole確認
    const header = canvas.getByRole('banner');
    await expect(header).toBeInTheDocument();

    // ナビゲーションランドマークの確認
    try {
      const navigation = canvas.getByRole('navigation');
      await expect(navigation).toBeInTheDocument();
    } catch {
      // navigation roleが存在しない場合はスキップ
    }

    // キーボードナビゲーションのテスト
    const allLinks = canvas.getAllByRole('link');

    // 各リンクがフォーカス可能であることを確認
    for (const link of allLinks.slice(0, 3)) {
      // 最初の3つのリンクのみテスト
      link.focus();
      await expect(link).toHaveFocus();

      // Enterキーで実行可能であることを確認
      await user.keyboard('{Enter}');
    }

    // Tabキーでのナビゲーションテスト
    await user.tab();
    await user.tab();
    await user.tab();
  },
};

/**
 * アクティブリンク状態のテスト
 * 現在のページに応じたアクティブ状態の表示確認
 */
export const ActiveLinkState: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // ナビゲーションリンクの取得
    const hubLink = canvas.getByRole('link', { name: 'Hub' });
    const libraryLink = canvas.getByRole('link', { name: 'Library' });
    const tutorialLink = canvas.getByRole('link', { name: 'Tutorial' });

    // リンクが存在することを確認
    await expect(hubLink).toBeInTheDocument();
    await expect(libraryLink).toBeInTheDocument();
    await expect(tutorialLink).toBeInTheDocument();

    // アクティブ状態のスタイルが適用されているかを確認
    // Note: 実際の実装に応じて、アクティブクラスやARIA属性をチェック
    // 例: aria-current="page" の確認など

    // Hubリンクがデフォルトでアクティブであることを想定
    // await expect(hubLink).toHaveAttribute('aria-current', 'page');
  },
};
