import { within, userEvent, waitFor, expect } from 'storybook/test';

type Canvas = ReturnType<typeof within>;

export class MobileBottomSheetDriver {
  private canvas: Canvas;
  private element: HTMLElement;

  constructor(canvasElement: HTMLElement) {
    this.canvas = within(canvasElement);
    this.element = canvasElement;
  }

  private get backgroundContent() {
    return this.canvas.getByText('音楽理論アプリ');
  }

  private getSnapPointDisplay(value: string) {
    return this.canvas.getByText((_content, element) => {
      // Exact match to avoid multiple elements
      return element?.textContent === `現在のスナップポイント: ${value}`;
    });
  }

  private getSnapPointButton(name: string) {
    return this.canvas.getByRole('button', { name });
  }

  private get circleOfFifths() {
    return this.canvas.getByRole('img', { name: 'Circle of Fifths' });
  }

  async expectBackgroundContentVisible() {
    await expect(this.backgroundContent).toBeInTheDocument();
  }

  async expectSnapPointDisplay(value: string) {
    await waitFor(() => expect(this.getSnapPointDisplay(value)).toBeInTheDocument());
  }

  async clickSnapPointButton(name: string) {
    await userEvent.click(this.getSnapPointButton(name));
  }

  async expectSnapPointButtonVisible(name: string) {
    await expect(this.getSnapPointButton(name)).toBeInTheDocument();
  }

  async expectCircleOfFifthsVisible() {
    await expect(this.circleOfFifths).toBeInTheDocument();
  }
}
