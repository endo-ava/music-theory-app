import { within, expect } from 'storybook/test';

type Canvas = ReturnType<typeof within>;

export class MobileTabLayoutDriver {
  private canvas: Canvas;

  constructor(canvasElement: HTMLElement) {
    this.canvas = within(canvasElement);
  }

  private get tabList() {
    return this.canvas.getByRole('tablist');
  }

  private get controllerTab() {
    return this.canvas.getByRole('tab', { name: /controller/i });
  }

  private get informationTab() {
    return this.canvas.getByRole('tab', { name: /information/i });
  }

  async expectLayoutVisible() {
    await expect(this.tabList).toBeInTheDocument();
    await expect(this.tabList).toHaveAttribute('role', 'tablist');
  }

  async expectCanvasVisible() {
    // Canvas エリアの SVG を確認
    const svg = this.canvas.getByRole('img', { name: /circle of fifths/i, hidden: true });
    await expect(svg).toBeInTheDocument();
  }

  async expectTabsVisible() {
    await expect(this.controllerTab).toBeInTheDocument();
    await expect(this.informationTab).toBeInTheDocument();
  }

  async expectTabActive(tabName: 'controller' | 'information') {
    const tab = tabName === 'controller' ? this.controllerTab : this.informationTab;
    await expect(tab).toHaveAttribute('aria-selected', 'true');
  }

  async expectAccessibilityAttributes() {
    // Tablist に適切な aria-label がある
    await expect(this.tabList).toHaveAttribute('aria-label');

    // 各タブに必要な ARIA 属性がある
    await expect(this.controllerTab).toHaveAttribute('role', 'tab');
    await expect(this.controllerTab).toHaveAttribute('aria-selected');
    await expect(this.controllerTab).toHaveAttribute('aria-controls');

    await expect(this.informationTab).toHaveAttribute('role', 'tab');
    await expect(this.informationTab).toHaveAttribute('aria-selected');
    await expect(this.informationTab).toHaveAttribute('aria-controls');
  }

  async expectResponsiveLayout() {
    // モバイルレイアウト構造の確認
    await this.expectLayoutVisible();
    await this.expectCanvasVisible();
    await this.expectTabsVisible();
  }
}
