import { within, userEvent, expect } from 'storybook/test';

type Canvas = ReturnType<typeof within>;

export class KeyControllerDriver {
  private canvas: Canvas;

  constructor(canvasElement: HTMLElement) {
    this.canvas = within(canvasElement);
  }

  private get rootSelectTrigger() {
    return this.canvas.getByRole('combobox', { name: /root/i });
  }

  private get modeSelectTrigger() {
    return this.canvas.getByRole('combobox', { name: /mode/i });
  }

  private getOption(name: string | RegExp) {
    return this.canvas.getByRole('option', { name });
  }

  async expectCurrentKey(keyName: string | RegExp) {
    // コンボボックスの値を確認するのは難しい場合があるため、
    // 選択された値が表示されているかを確認する
    await expect(this.canvas.getByText(keyName)).toBeInTheDocument();
  }

  async selectRoot(rootName: string | RegExp) {
    await userEvent.click(this.rootSelectTrigger);
    const option = this.getOption(rootName);
    await userEvent.click(option);
  }

  async selectMode(modeName: string | RegExp) {
    await userEvent.click(this.modeSelectTrigger);
    const option = this.getOption(modeName);
    await userEvent.click(option);
  }
}
