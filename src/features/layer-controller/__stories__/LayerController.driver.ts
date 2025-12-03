import { within, userEvent, expect } from 'storybook/test';

type Canvas = ReturnType<typeof within>;

export class LayerControllerDriver {
  private canvas: Canvas;

  constructor(canvasElement: HTMLElement) {
    this.canvas = within(canvasElement);
  }

  private get container() {
    return this.canvas.getByLabelText('レイヤー設定');
  }

  private get title() {
    return this.canvas.getByText('Chord Layers');
  }

  private get switchButtons() {
    return this.canvas.getAllByRole('switch');
  }

  private getSwitch(name: string | RegExp) {
    return this.canvas.getByRole('switch', { name });
  }

  async expectStructureVisible() {
    await expect(this.container).toBeInTheDocument();
    await expect(this.title).toBeInTheDocument();
    await expect(this.switchButtons.length).toBeGreaterThan(0);
  }

  async expectResponsiveClasses() {
    await expect(this.container).toHaveClass('flex', 'flex-col', 'gap-4');
  }

  async expectTitleStyles() {
    await expect(this.title).toHaveClass('text-lg', 'font-semibold');
  }

  async expectSwitchVisible(name: string | RegExp) {
    await expect(this.getSwitch(name)).toBeInTheDocument();
  }

  async expectSwitchChecked(name: string | RegExp, checked: boolean) {
    const switchButton = this.getSwitch(name);
    if (checked) {
      await expect(switchButton).toHaveAttribute('aria-checked', 'true');
    } else {
      await expect(switchButton).toHaveAttribute('aria-checked', 'false');
    }
  }

  async toggleSwitch(name: string | RegExp) {
    await userEvent.click(this.getSwitch(name));
  }

  async expectSwitchAccessibility() {
    const switches = this.switchButtons;
    switches.forEach(async (switchButton: HTMLElement) => {
      await expect(switchButton).toHaveAttribute('role', 'switch');
      await expect(switchButton).toHaveAttribute('aria-label');
    });
  }
}
