import { within, userEvent, expect, waitFor, fireEvent } from 'storybook/test';

type Canvas = ReturnType<typeof within>;

export class AtlasCanvasDriver {
  private canvas: Canvas;
  private user = userEvent.setup();

  constructor(canvasElement: HTMLElement) {
    this.canvas = within(canvasElement);
  }

  private getNodeElement(label: string) {
    // Use data-testid for more robust node selection
    return this.canvas.getByTestId(`atlas-node-${label}`);
  }

  private get searchInput() {
    return this.canvas.getByPlaceholderText(/search/i);
  }

  async clickNode(label: string) {
    const node = this.getNodeElement(label);
    // userEventの不具合(document nullエラー)を回避するためfireEventを使用
    fireEvent.click(node);
  }

  async expectNodeVisible(label: string) {
    const node = await this.canvas.findByTestId(`atlas-node-${label}`);
    await expect(node).toBeInTheDocument();
  }

  async expectNodeNotVisible(label: string) {
    await waitFor(() => {
      const node = this.canvas.queryByTestId(`atlas-node-${label}`);
      expect(node).not.toBeInTheDocument();
    });
  }

  async typeSearch(text: string) {
    const input = this.searchInput;
    await this.user.type(input, text);
  }
}
