import { within, userEvent, expect } from 'storybook/test';

type Canvas = ReturnType<typeof within>;

export class CircleOfFifthsDriver {
  private canvas: Canvas;
  private user = userEvent.setup();

  constructor(canvasElement: HTMLElement) {
    this.canvas = within(canvasElement);
  }

  private get circleContainer() {
    return this.canvas.getByRole('img', { name: 'Circle of Fifths' });
  }

  private get pathElements() {
    return this.circleContainer.querySelectorAll('path');
  }

  private get textElements() {
    return this.circleContainer.querySelectorAll('text');
  }

  private get keyAreaGroups() {
    return this.circleContainer.querySelectorAll('g[style*="cursor: pointer"]');
  }

  private get highlightLayer() {
    return this.circleContainer.querySelector('.diatonic-highlight-layer');
  }

  async expectCircleContainerVisible() {
    await expect(this.circleContainer).toBeInTheDocument();
  }

  async expectSVGStructure() {
    await expect(this.circleContainer.tagName.toLowerCase()).toBe('svg');
    await expect(this.circleContainer).toHaveAttribute('viewBox');
    expect(this.pathElements.length).toBeGreaterThan(0);
  }

  async expectSegmentsRendered(minCount = 12) {
    expect(this.pathElements.length).toBeGreaterThanOrEqual(minCount);
  }

  async expectTextElementsRendered() {
    expect(this.textElements.length).toBeGreaterThan(0);
  }

  async expectAccessibility() {
    await expect(this.circleContainer).toHaveAttribute('aria-label', 'Circle of Fifths');
    await expect(this.circleContainer.tagName.toLowerCase()).toBe('svg');
  }

  async expectKeyAreaGroups() {
    expect(this.keyAreaGroups.length).toBeGreaterThan(0);
  }

  async clickFirstKeyArea() {
    if (this.keyAreaGroups.length > 0) {
      const firstKeyArea = this.keyAreaGroups[0];
      await this.user.click(firstKeyArea);
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(firstKeyArea).toBeInTheDocument();
    }
  }

  async expectRomanNumeral(numeral: string) {
    const text = this.canvas.getByText(numeral);
    expect(text).toBeInTheDocument();
  }

  async expectRomanNumeralOptional(numeral: string) {
    const text = this.canvas.queryByText(numeral);
    if (text) {
      expect(text).toBeInTheDocument();
    }
  }

  async expectDiatonicHighlightVisible() {
    expect(this.highlightLayer).toBeInTheDocument();
  }

  async expectDiatonicHighlightHidden() {
    expect(this.highlightLayer).not.toBeInTheDocument();
  }

  async expectFunctionalHarmony(symbol: string, minCount = 1) {
    const elements = this.canvas.getAllByText(symbol);
    expect(elements.length).toBeGreaterThanOrEqual(minCount);
  }

  async expectKeyName(keyName: string) {
    const text = this.canvas.getByText(keyName);
    expect(text).toBeInTheDocument();
  }

  async expectDualLayerLayout(romanNumeral: string, functionalSymbol: string) {
    const romanText = this.canvas.getByText(romanNumeral);
    const functionalTexts = this.canvas.getAllByText(functionalSymbol);

    expect(romanText).toBeInTheDocument();
    expect(functionalTexts.length).toBeGreaterThan(0);
  }

  async waitForRender(ms = 200) {
    await new Promise(resolve => setTimeout(resolve, ms));
  }
}
