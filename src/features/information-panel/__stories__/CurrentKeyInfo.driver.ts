import { within, expect } from 'storybook/test';

type Canvas = ReturnType<typeof within>;

export class CurrentKeyInfoDriver {
  private canvas: Canvas;

  constructor(canvasElement: HTMLElement) {
    this.canvas = within(canvasElement);
  }

  private get container() {
    return this.canvas.getByLabelText('Current Key');
  }

  private get currentKeyLabels() {
    return this.canvas.getAllByText('Current Key');
  }

  private getKeyButton(name?: string) {
    if (name) {
      return this.canvas.getByRole('button', { name: new RegExp(`key:.*${name}`, 'i') });
    }
    return this.canvas.getByRole('button', { name: /key:/i });
  }

  private get diatonicTable() {
    return this.canvas.getByRole('table');
  }

  private get romanNumerals() {
    return this.canvas.getAllByText(/[ⅠⅡⅢⅣⅤⅥⅦ]/);
  }

  private getChordButton(chordName?: string) {
    if (chordName) {
      return this.canvas.getByRole('button', {
        name: new RegExp(`play ${chordName} chord`, 'i'),
      });
    }
    return this.canvas.getByRole('button', { name: /play .* chord/i });
  }

  private getRelativeKeyButton(name?: string) {
    if (name) {
      return this.canvas.getByRole('button', {
        name: new RegExp(`relative key.*${name}`, 'i'),
      });
    }
    return this.canvas.getByRole('button', { name: /relative key/i });
  }

  private get allButtons() {
    return this.canvas.getAllByRole('button');
  }

  private getText(text: string | RegExp) {
    return this.canvas.getByText(text);
  }

  async expectContainerVisible() {
    await expect(this.container).toBeInTheDocument();
  }

  async expectCurrentKeyHeaderVisible() {
    const visibleCurrentKeyLabel = this.currentKeyLabels.find(
      (el: HTMLElement) => !el.getAttribute('aria-hidden')
    );
    await expect(visibleCurrentKeyLabel).toBeInTheDocument();
  }

  async expectKeyButtonVisible(keyName?: string) {
    await expect(this.getKeyButton(keyName)).toBeInTheDocument();
  }

  async expectDiatonicTableVisible() {
    await expect(this.diatonicTable).toBeInTheDocument();
  }

  async expectRomanNumeralsVisible(numerals?: string[]) {
    if (numerals) {
      for (const roman of numerals) {
        await expect(this.canvas.getByText(roman)).toBeInTheDocument();
      }
    } else {
      expect(this.romanNumerals.length).toBeGreaterThan(0);
    }
  }

  async expectChordButtonVisible(chordName?: string) {
    await expect(this.getChordButton(chordName)).toBeInTheDocument();
  }

  async expectTextVisible(text: string | RegExp) {
    await expect(this.getText(text)).toBeInTheDocument();
  }

  async expectRelativeKeyButtonVisible(keyName?: string) {
    await expect(this.getRelativeKeyButton(keyName)).toBeInTheDocument();
  }

  async expectAllButtonsHaveAriaLabelOrText() {
    const buttons = this.allButtons;
    buttons.forEach((button: HTMLElement) => {
      const hasAriaLabel = button.getAttribute('aria-label');
      const hasText = button.textContent;
      expect(hasAriaLabel || hasText).toBeTruthy();
    });
  }

  async expectButtonsFocusable() {
    const buttons = this.allButtons;
    buttons.forEach((button: HTMLElement) => {
      expect(button.tabIndex).toBeGreaterThanOrEqual(0);
    });
  }
}
