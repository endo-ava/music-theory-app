import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { GlobalHeader } from '../components/GlobalHeader';
import { GlobalHeaderDriver } from './GlobalHeader.driver';

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
 * ロゴとナビゲーションリンク（Circle, Atlas, About）を含む基本状態
 */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    // ロゴとナビゲーションリンクが表示され、クリック可能であることを確認
    const driver = new GlobalHeaderDriver(canvasElement);

    await driver.expectLogoVisible();
    await driver.expectNavigationLinksVisible();
    await driver.clickAtlasLink();
    await driver.clickAboutLink();
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
    // モバイルメニューボタンが表示され、クリックで開閉できることを確認
    const driver = new GlobalHeaderDriver(canvasElement);

    await driver.expectLogoVisible();
    await driver.expectMobileMenuButton();
    await driver.clickMobileMenuButton();
    await driver.expectMultipleLinksExist();
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
    // デスクトップビューで全ナビゲーションリンクが表示され、ホバー効果が動作することを確認
    const driver = new GlobalHeaderDriver(canvasElement);

    await driver.expectLogoVisible();
    await driver.expectNavigationLinksVisible();
    await driver.hoverLinks();
  },
};

/**
 * アクセシビリティテスト
 * キーボードナビゲーションとARIA属性の確認
 */
export const AccessibilityTest: Story = {
  play: async ({ canvasElement }) => {
    // ヘッダーのアクセシビリティ属性とキーボードナビゲーションが正しく動作することを確認
    const driver = new GlobalHeaderDriver(canvasElement);

    await driver.expectHeaderAccessibility();
    await driver.testKeyboardNavigation();
  },
};

/**
 * アクティブリンク状態のテスト
 * 現在のページに応じたアクティブ状態の表示確認
 */
export const ActiveLinkState: Story = {
  play: async ({ canvasElement }) => {
    // ナビゲーションリンクが存在し、アクティブ状態を表現できることを確認
    const driver = new GlobalHeaderDriver(canvasElement);

    await driver.expectActiveLinks();
  },
};
