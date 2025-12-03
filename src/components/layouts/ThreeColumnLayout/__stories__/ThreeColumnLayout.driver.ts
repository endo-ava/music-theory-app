import { within, userEvent, expect } from 'storybook/test';

type Canvas = ReturnType<typeof within>;

export class ThreeColumnLayoutDriver {
  private canvas: Canvas;

  constructor(canvasElement: HTMLElement) {
    this.canvas = within(canvasElement);
  }

  private get layoutContainer() {
    return this.canvas.getByLabelText('デスクトップ用3分割レイアウト');
  }

  private get canvasArea() {
    return this.canvas.getByLabelText('メイン表示エリア');
  }

  // パネルのヘッダーテキストで取得している（現状の実装維持）
  private get viewPanelHeader() {
    return this.canvas.getByText('View');
  }

  private get infoPanelHeader() {
    return this.canvas.getByText('Information');
  }

  private get controllerPanel() {
    return this.canvas.getByLabelText('コントローラーパネル');
  }

  private get panelGroup() {
    return this.layoutContainer.querySelector('[data-panel-group]');
  }

  private get panels() {
    return this.layoutContainer.querySelectorAll('[data-panel]');
  }

  private get resizeHandles() {
    return this.layoutContainer.querySelectorAll('[data-panel-resize-handle-enabled]');
  }

  private get resetButton() {
    return (
      this.canvas.queryByLabelText(/レイアウトをデフォルトに戻す/) ||
      this.canvas.queryByText('リセット')
    );
  }

  async expectLayoutContainerVisible() {
    await expect(this.layoutContainer).toBeInTheDocument();
  }

  async expectPanelsVisible() {
    await expect(this.viewPanelHeader).toBeInTheDocument();
    await expect(this.canvasArea).toBeInTheDocument();
    await expect(this.infoPanelHeader).toBeInTheDocument();
  }

  async expectResizableStructure() {
    await expect(this.panelGroup).toBeInTheDocument();
    expect(this.panels).toHaveLength(3);
    expect(this.resizeHandles.length).toBeGreaterThan(0);
  }

  async expectResetButtonVisible() {
    if (this.resetButton) {
      await expect(this.resetButton).toBeInTheDocument();
    }
  }

  async clickResetButton() {
    if (this.resetButton) {
      await userEvent.click(this.resetButton);
    }
  }

  async expectAccessibilityAttributes() {
    await expect(this.layoutContainer).toHaveAttribute(
      'aria-label',
      'デスクトップ用3分割レイアウト'
    );
    await expect(this.canvasArea).toHaveAttribute('aria-label', 'メイン表示エリア');

    this.resizeHandles.forEach((handle: Element) => {
      expect(handle).toHaveAttribute('role', 'separator');
    });
  }

  async expectPanelMinSizes() {
    expect(this.panels).toHaveLength(3);
    expect(this.panels[0]).toHaveClass('min-w-[200px]');
    expect(this.panels[1]).toHaveClass('min-w-[300px]');
    expect(this.panels[2]).toHaveClass('min-w-[200px]');
  }

  async expectCustomStyles(classes: string[]) {
    for (const cls of classes) {
      await expect(this.layoutContainer).toHaveClass(cls);
    }
  }

  async expectControllerPanelContent() {
    await expect(this.controllerPanel).toBeInTheDocument();

    const titles = this.canvas.getAllByRole('heading', { level: 2 });
    const controllerTitle = titles.find((title: HTMLElement) => title.textContent === 'Controller');
    await expect(controllerTitle).toBeInTheDocument();

    const layerHeading = this.canvas.getByRole('heading', { name: 'Chord Layers', level: 3 });
    await expect(layerHeading).toBeInTheDocument();
  }

  async expectControllerPanelResponsiveClasses() {
    await expect(this.controllerPanel).toHaveClass(
      'md:bg-panel',
      'md:border-border',
      'md:rounded-xl',
      'md:border',
      'md:backdrop-blur-xl'
    );
  }
}
