import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /**
   * Webpackの設定を拡張して、ビルドプロセスをカスタマイズする。
   * @param config - 現在のWebpack設定オブジェクト
   * @param options.webpack - Next.jsが使用しているWebpackインスタンス
   * @returns {object} - 変更後のWebpack設定オブジェクト
   */
  webpack: (config, { webpack }) => {
    // .mdファイルをビルドから除外
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /\.md$/,
      })
    );

    return config;
  },
  env: {
    // ビルド時の現在時刻をUTC基準の英語フォーマットで埋め込む (e.g., "November 29, 2025")
    NEXT_PUBLIC_LAST_UPDATED: new Date().toLocaleDateString('en-US', {
      timeZone: 'UTC',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
  },
};

export default nextConfig;
