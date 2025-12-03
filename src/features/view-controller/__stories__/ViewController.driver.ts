import { within, userEvent, expect } from 'storybook/test';

type Canvas = ReturnType<typeof within>;

export class ViewControllerDriver {
  private canvas: Canvas;
  private element: HTMLElement;

  constructor(canvasElement: HTMLElement) {
    this.canvas = within(canvasElement);
    this.element = canvasElement;
  }

  private get circleButton() {
    return this.canvas.getByRole('radio', { name: 'Circle of Fifths' });
  }

  private get chromaticButton() {
    return this.canvas.getByRole('radio', { name: 'Chromatic Circle' });
  }

  private get circleDescription() {
    return this.canvas.getByText('五度圏：調性関係の視覚化');
  }

  private get chromaticDescription() {
    return this.canvas.getByText('クロマチック：音程関係の視覚化');
  }

  async expectButtonsVisible() {
    await expect(this.circleButton).toBeInTheDocument();
    await expect(this.chromaticButton).toBeInTheDocument();
  }

  async expectCircleSelected() {
    await expect(this.circleButton).toHaveAttribute('aria-checked', 'true');
    await expect(this.chromaticButton).toHaveAttribute('aria-checked', 'false');
  }

  async expectChromaticSelected() {
    await expect(this.chromaticButton).toHaveAttribute('aria-checked', 'true');
    await expect(this.circleButton).toHaveAttribute('aria-checked', 'false');
  }

  async clickChromaticButton() {
    await userEvent.click(this.chromaticButton);
  }

  async clickCircleButton() {
    await userEvent.click(this.circleButton);
  }

  async expectCircleDescriptionVisible() {
    await expect(this.circleDescription).toBeInTheDocument();
  }

  async expectChromaticDescriptionVisible() {
    await expect(this.chromaticDescription).toBeInTheDocument();
  }

  async expectKeyboardNavigation() {
    this.circleButton.focus();
    await expect(this.circleButton).toHaveFocus();

    await userEvent.keyboard('{ArrowRight}');
    await expect(this.chromaticButton).toHaveFocus();

    await userEvent.keyboard('{ArrowLeft}');
    await expect(this.circleButton).toHaveFocus();
  }

  private getRadioButton(name: string) {
    return this.canvas.getByRole('radio', { name });
  }

  async expectRadioButtonChecked(name: string, checked: boolean) {
    await expect(this.getRadioButton(name)).toHaveAttribute('aria-checked', checked.toString());
  }

  async pressKey(key: string) {
    await userEvent.keyboard(key);
  }

  async expectRadioButtonFocused(name: string) {
    await expect(this.getRadioButton(name)).toHaveFocus();
  }

  async focusRadioButton(name: string) {
    const button = this.getRadioButton(name);
    button.focus();
  }

  async expectRadioButtonTabindex(name: string, tabindex: string) {
    await expect(this.getRadioButton(name)).toHaveAttribute('tabindex', tabindex);
  }

  async expectRadioButtonDescribedBy(name: string, descriptionId: string) {
    await expect(this.getRadioButton(name)).toHaveAttribute('aria-describedby', descriptionId);
  }

  async expectDescriptionId(text: string, id: string) {
    await expect(this.canvas.getByText(text)).toHaveAttribute('id', id);
  }

  async expectDescriptionVisible(text: string) {
    await expect(this.canvas.getByText(text)).toBeInTheDocument();
  }

  async expectTitle(title: string) {
    await expect(this.canvas.getByRole('heading', { name: title })).toBeInTheDocument();
  }

  async expectRadioGroupLabel(label: string) {
    await expect(this.canvas.getByRole('radiogroup', { name: label })).toBeInTheDocument();
  }

  async expectRadioButtonVisible(name: string) {
    await expect(this.getRadioButton(name)).toBeInTheDocument();
  }

  async clickRadioButton(name: string) {
    await userEvent.click(this.getRadioButton(name));
  }

  async expectVisible() {
    await this.expectButtonsVisible();
  }
}
