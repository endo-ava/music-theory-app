import { within, userEvent, expect, waitFor, fireEvent } from 'storybook/test';

type Canvas = ReturnType<typeof within>;

export class AtlasCanvasDriver {
  private canvas: Canvas;
  private user = userEvent.setup();

  constructor(canvasElement: HTMLElement) {
    this.canvas = within(canvasElement);
  }

  private getNodeElement(label: string) {
    // In React Flow, nodes might be tricky to find by text if they are complex.
    // But our AtlasNode renders label in a span or div.
    return this.canvas.getByText(label);
  }

  private get searchInput() {
    return this.canvas.getByPlaceholderText(/search/i);
  }

  async clickNode(label: string) {
    const node = this.getNodeElement(label);
    await fireEvent.click(node);
  }

  async expectNodeVisible(label: string) {
    const node = await this.canvas.findByText(label);
    await expect(node).toBeInTheDocument();
  }

  async expectNodeNotVisible(label: string) {
    await waitFor(() => {
      const node = this.canvas.queryByText(label);
      if (node) {
        expect(node).not.toBeVisible();
      } else {
        expect(node).toBeNull();
      }
    });
  }

  async typeSearch(text: string) {
    const input = this.searchInput;
    await this.user.type(input, text);
  }
}
