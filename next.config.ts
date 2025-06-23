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
};

export default nextConfig;
