import { within, expect } from 'storybook/test';

type Canvas = ReturnType<typeof within>;

export class SelectedElementInfoDriver {
  private canvas: Canvas;

  constructor(canvasElement: HTMLElement) {
    this.canvas = within(canvasElement);
  }

  private get container() {
    return this.canvas.getByLabelText('Selected Chord');
  }

  private get placeholderText() {
    return this.canvas.getByText(/Click an area on the circle/i);
  }

  private get selectedChordLabels() {
    return this.canvas.getAllByText('Selected Chord');
  }

  private get selectedChordLabelsQuery() {
    return this.canvas.queryAllByText('Selected Chord');
  }

  private get table() {
    return this.canvas.getByRole('table');
  }

  private get tableQuery() {
    return this.canvas.queryByRole('table');
  }

  private get chordTonesHeader() {
    return this.canvas.getByText('chord tones');
  }

  private get degreeNameHeader() {
    return this.canvas.getByText('degree name');
  }

  private get functionHeader() {
    return this.canvas.getByText('function');
  }

  private get columnHeaders() {
    return this.canvas.getAllByRole('columnheader');
  }

  private getChordButton(chordName: string) {
    return this.canvas.getByRole('button', {
      name: new RegExp(`Play ${chordName} chord`, 'i'),
    });
  }

  private getConstituentNotes(regex: RegExp) {
    return this.canvas.getByText(regex);
  }

  private getDegreeNameCell(degree: string) {
    return this.canvas.getByText(degree);
  }

  private getFunctionCell(func: string | RegExp) {
    return this.canvas.getByText(func);
  }

  async expectContainerVisible() {
    await expect(this.container).toBeInTheDocument();
  }

  async expectPlaceholderVisible() {
    await expect(this.placeholderText).toBeInTheDocument();
  }

  async expectSelectedChordHeaderNotVisible() {
    const visibleSelectedChordLabel = this.selectedChordLabelsQuery.find(
      (el: HTMLElement) => !el.getAttribute('aria-hidden')
    );
    expect(visibleSelectedChordLabel).toBeUndefined();
  }

  async expectSelectedChordHeaderVisible() {
    const visibleSelectedChordLabel = this.selectedChordLabels.find(
      (el: HTMLElement) => !el.getAttribute('aria-hidden')
    );
    await expect(visibleSelectedChordLabel).toBeInTheDocument();
  }

  async expectTableNotVisible() {
    expect(this.tableQuery).not.toBeInTheDocument();
  }

  async expectTableVisible() {
    await expect(this.table).toBeInTheDocument();
  }

  async expectChordButtonVisible(chordName: string) {
    const chordButton = this.getChordButton(chordName);
    await expect(chordButton).toBeInTheDocument();
    await expect(chordButton).toBeEnabled();
    await expect(chordButton).toHaveTextContent(chordName);
  }

  async expectTableHeadersVisible() {
    await expect(this.chordTonesHeader).toBeInTheDocument();
    await expect(this.degreeNameHeader).toBeInTheDocument();
    await expect(this.functionHeader).toBeInTheDocument();
  }

  async expectChordTonesVisible(regex: RegExp) {
    await expect(this.getConstituentNotes(regex)).toBeInTheDocument();
  }

  async expectDegreeNameVisible(degree: string) {
    await expect(this.getDegreeNameCell(degree)).toBeInTheDocument();
  }

  async expectFunctionVisible(func: string | RegExp) {
    await expect(this.getFunctionCell(func)).toBeInTheDocument();
  }

  async expectChordButtonAriaLabel(chordName: string) {
    const chordButton = this.getChordButton(chordName);
    expect(chordButton.getAttribute('aria-label')).toContain(`Play ${chordName} chord`);
  }

  async expectTableHeadersRole() {
    const headers = this.columnHeaders;
    expect(headers).toHaveLength(3);
    expect(headers[0]).toHaveTextContent('chord tones');
    expect(headers[1]).toHaveTextContent('degree name');
    expect(headers[2]).toHaveTextContent('function');
  }

  async expectChordButtonFocusable(chordName: string) {
    const chordButton = this.getChordButton(chordName);
    expect(chordButton.tabIndex).toBeGreaterThanOrEqual(0);
  }
}
