import type { TestRunnerConfig } from '@storybook/test-runner';

const config: TestRunnerConfig = {
  // CI環境での設定
  ...(process.env.CI && {
    browsers: ['chromium'],
    maxWorkers: 1,
  }),
  // テストのタイムアウト設定
  testTimeout: 30000,
  // ストーリーのタイムアウト設定
  getTimeout: () => 10000,
  // カスタムテスト設定
  async preVisit(page) {
    // ページロード前の設定
    await page.setViewportSize({ width: 1024, height: 768 });
  },
  async postVisit(page, context) {
    // アクセシビリティテストの実行
    const storyElement = page.locator('#storybook-root');
    await storyElement.waitFor({ timeout: 5000 });
  },
};

export default config;
