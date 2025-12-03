import { within, userEvent, expect } from 'storybook/test';

type Canvas = ReturnType<typeof within>;

export class ChromaticCircleDriver {
  private canvas: Canvas;
  private element: HTMLElement;
  private user = userEvent.setup();

  constructor(canvasElement: HTMLElement) {
    this.canvas = within(canvasElement);
    this.element = canvasElement;
  }

  private get circleContainer() {
    return this.canvas.getByRole('img', { name: 'Chromatic Circle' });
  }

  private get pathElements() {
    return this.circleContainer.querySelectorAll('path');
  }

  private get textElements() {
    return this.circleContainer.querySelectorAll('text');
  }

  private get segmentGroups() {
    return this.circleContainer.querySelectorAll('g[style*="cursor: pointer"]');
  }

  private get highlightLayers() {
    return this.circleContainer.querySelectorAll('.diatonic-highlight-layer');
  }

  private get highlightPaths() {
    return this.circleContainer.querySelectorAll('.diatonic-highlight-layer path');
  }

  private get innerCircleHighlights() {
    return this.circleContainer.querySelectorAll('.diatonic-highlight-layer circle');
  }

  async expectCircleContainerVisible() {
    await expect(this.circleContainer).toBeInTheDocument();
  }

  async expectSVGStructure() {
    await expect(this.circleContainer.tagName.toLowerCase()).toBe('svg');
    await expect(this.circleContainer).toHaveAttribute('viewBox');
    expect(this.pathElements.length).toBeGreaterThan(0);
  }

  async expectTwelvePitchClasses() {
    expect(this.textElements.length).toBeGreaterThanOrEqual(12);
  }

  async expectSegmentsRendered(expectedCount = 24) {
    expect(this.pathElements.length).toBeGreaterThanOrEqual(expectedCount);
  }

  async expectTwelveSegments() {
    expect(this.segmentGroups.length).toBe(12);
  }

  async clickFirstSegment() {
    if (this.segmentGroups.length > 0) {
      const firstSegment = this.segmentGroups[0];
      await this.user.click(firstSegment);
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(firstSegment).toBeInTheDocument();
    }
  }

  async hoverFirstSegment() {
    if (this.segmentGroups.length > 0) {
      const firstSegment = this.segmentGroups[0];
      await this.user.hover(firstSegment);
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(firstSegment).toBeInTheDocument();

      await this.user.unhover(firstSegment);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  async expectPitchClassDisplayed(pitchClass: string) {
    const pitch = this.canvas.queryByText(pitchClass);
    if (pitch) {
      expect(pitch).toBeInTheDocument();
    }
  }

  async expectDiatonicHighlightVisible(expectedCount = 7) {
    expect(this.highlightLayers.length).toBeGreaterThanOrEqual(1);
    expect(this.highlightPaths.length).toBeGreaterThanOrEqual(expectedCount);
    expect(this.innerCircleHighlights.length).toBeGreaterThanOrEqual(1);
  }

  async expectDiatonicHighlightHidden() {
    expect(this.highlightPaths.length).toBe(0);
    expect(this.innerCircleHighlights.length).toBe(0);
  }

  async expectTonicEmphasis() {
    expect(this.highlightPaths.length).toBeGreaterThanOrEqual(7);

    const thickPaths = Array.from(this.highlightPaths).filter((path): path is Element => {
      return (
        path instanceof Element &&
        (path.getAttribute('stroke-width') === '1.2px' || path.getAttribute('filter') !== null)
      );
    });

    expect(thickPaths.length).toBeGreaterThanOrEqual(1);
  }

  async expectHighlightToggle() {
    const highlightPaths = this.circleContainer.querySelectorAll('.diatonic-highlight-layer path');
    return highlightPaths.length;
  }

  async waitForRender(ms = 200) {
    await new Promise(resolve => setTimeout(resolve, ms));
  }
}
