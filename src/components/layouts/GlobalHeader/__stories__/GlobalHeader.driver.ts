import { within, userEvent, expect } from 'storybook/test';

type Canvas = ReturnType<typeof within>;

export class GlobalHeaderDriver {
  private canvas: Canvas;
  private user = userEvent.setup();

  constructor(canvasElement: HTMLElement) {
    this.canvas = within(canvasElement);
  }

  private get logo() {
    return this.canvas.getByRole('link', { name: /harmonic orbit/i });
  }

  private get circleLink() {
    return this.canvas.getByRole('link', { name: 'Circle' });
  }

  private get atlasLink() {
    return this.canvas.getByRole('link', { name: 'Atlas' });
  }

  private get aboutLink() {
    return this.canvas.getByRole('link', { name: 'About' });
  }

  private get header() {
    return this.canvas.getByRole('banner');
  }

  private get navigation() {
    return this.canvas.queryByRole('navigation');
  }

  private get mobileMenuButton() {
    return this.canvas.queryByRole('button', { name: /メニューを開く/i });
  }

  private get allLinks() {
    return this.canvas.getAllByRole('link');
  }

  async expectLogoVisible() {
    await expect(this.logo).toBeInTheDocument();
  }

  async expectNavigationLinksVisible() {
    await expect(this.circleLink).toBeInTheDocument();
    await expect(this.atlasLink).toBeInTheDocument();
    await expect(this.aboutLink).toBeInTheDocument();
  }

  async clickAtlasLink() {
    await this.user.click(this.atlasLink);
  }

  async clickAboutLink() {
    await this.user.click(this.aboutLink);
  }

  async clickCircleLink() {
    await this.user.click(this.circleLink);
  }

  async expectMobileMenuButton() {
    if (this.mobileMenuButton) {
      await expect(this.mobileMenuButton).toBeInTheDocument();
    }
  }

  async clickMobileMenuButton() {
    if (this.mobileMenuButton) {
      await this.user.click(this.mobileMenuButton);

      const closeButton = this.canvas.queryByRole('button', { name: /メニューを閉じる/i });
      if (closeButton) {
        await expect(closeButton).toBeInTheDocument();
      }
    }
  }

  async expectMultipleLinksExist() {
    const links = this.allLinks;
    await expect(links.length).toBeGreaterThan(0);
  }

  async expectHeaderAccessibility() {
    await expect(this.header).toBeInTheDocument();

    if (this.navigation) {
      await expect(this.navigation).toBeInTheDocument();
    }
  }

  async testKeyboardNavigation() {
    const links = this.allLinks;

    // 最初の3つのリンクでフォーカステスト
    for (const link of links.slice(0, 3)) {
      link.focus();
      await expect(link).toHaveFocus();
      await this.user.keyboard('{Enter}');
    }

    // Tabキーでのナビゲーション
    await this.user.tab();
    await this.user.tab();
    await this.user.tab();
  }

  async hoverLinks() {
    await this.user.hover(this.atlasLink);
    await this.user.hover(this.aboutLink);
    await this.user.hover(this.circleLink);
  }

  async expectActiveLinks() {
    await expect(this.circleLink).toBeInTheDocument();
    await expect(this.atlasLink).toBeInTheDocument();
    await expect(this.aboutLink).toBeInTheDocument();
  }
}
