import { within, expect } from 'storybook/test';

type Canvas = ReturnType<typeof within>;

export class MobileTwoColumnLayoutDriver {
  private canvas: Canvas;
  private element: HTMLElement;

  constructor(canvasElement: HTMLElement) {
    this.canvas = within(canvasElement);
    this.element = canvasElement;
  }

  private get layoutContainer() {
    return this.canvas.getByLabelText('モバイル2分割レイアウト');
  }

  private get canvasArea() {
    return this.layoutContainer.querySelector('.min-h-\\[300px\\]');
  }

  private get circleOfFifths() {
    return this.canvas.getByRole('img', { name: 'Circle of Fifths', hidden: true });
  }

  private get infoArea() {
    return this.layoutContainer.querySelector('.overflow-y-visible');
  }

  private get mobileBottomSheetElement() {
    return this.element.querySelector('.md\\:hidden');
  }

  async expectLayoutContainerVisible() {
    await expect(this.layoutContainer).toBeInTheDocument();
    await expect(this.layoutContainer).toHaveAttribute('aria-label', 'モバイル2分割レイアウト');
  }

  async expectCanvasAreaVisible() {
    expect(this.canvasArea).toBeInTheDocument();
  }

  async expectCircleOfFifthsVisible() {
    await expect(this.circleOfFifths).toBeInTheDocument();
    await expect(this.circleOfFifths).toHaveAttribute('aria-label', 'Circle of Fifths');
  }

  async expectInformationPanelVisible() {
    expect(this.infoArea).toBeInTheDocument();
  }

  async expectMobileLayoutStructure() {
    await expect(this.layoutContainer).toHaveClass('flex', 'flex-col');
  }

  async expectBottomSheetVisible() {
    expect(this.mobileBottomSheetElement).toBeInTheDocument();
  }

  async expectAccessibilityAttributes() {
    await expect(this.layoutContainer).toHaveAttribute('aria-label', 'モバイル2分割レイアウト');

    const svg = this.canvas.getByRole('img', { name: 'Circle of Fifths', hidden: true });
    await expect(svg).toHaveAttribute('aria-label', 'Circle of Fifths');
  }

  async expectResponsiveLayout() {
    await expect(this.layoutContainer).toHaveClass('flex', 'flex-col');
    expect(this.canvasArea).toBeInTheDocument();
    expect(this.infoArea).toBeInTheDocument();
  }

  async expectCustomStyles(classes: string[]) {
    for (const cls of classes) {
      await expect(this.layoutContainer).toHaveClass(cls);
    }
  }

  async expectComponentBoundary() {
    expect(this.canvasArea).toBeInTheDocument();
    expect(this.infoArea).toBeInTheDocument();

    if (this.canvasArea) {
      expect(this.layoutContainer).toContainElement(this.canvasArea as HTMLElement);
    }
  }
}
