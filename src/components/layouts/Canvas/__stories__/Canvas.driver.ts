import { within, expect } from 'storybook/test';

type Canvas = ReturnType<typeof within>;

export class CanvasDriver {
  private canvas: Canvas;

  constructor(canvasElement: HTMLElement) {
    this.canvas = within(canvasElement);
  }

  private get mainArea() {
    return this.canvas.getByLabelText('メイン表示エリア');
  }

  private get circleOfFifths() {
    return this.canvas.getByRole('img', { name: 'Circle of Fifths' });
  }

  private get heading() {
    return this.canvas.getByRole('heading', { level: 2 });
  }

  async expectMainAreaVisible() {
    await expect(this.mainArea).toBeInTheDocument();
    await expect(this.mainArea).toHaveAttribute('aria-label', 'メイン表示エリア');
  }

  async expectCircleOfFifthsVisible() {
    await expect(this.circleOfFifths).toBeInTheDocument();
  }

  async expectAccessibilityAttributes() {
    await expect(this.mainArea).toHaveAttribute('aria-label', 'メイン表示エリア');
    await expect(this.heading).toBeInTheDocument();

    const svg = this.canvas.getByRole('img', { name: 'Circle of Fifths' });
    await expect(svg).toHaveAttribute('aria-label', 'Circle of Fifths');
  }

  async expectResponsiveLayout() {
    await expect(this.mainArea).toHaveClass('w-full', 'h-full');
    await expect(this.mainArea).toHaveClass('p-4');
    await expect(this.mainArea).toHaveClass('flex', 'flex-col');
  }
}
