// eslint.config.js
import globals from 'globals';
import js from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  // 1. ESLintの基本的な推奨ルール
  js.configs.recommended,

  // 2. TypeScriptの推奨ルール
  ...tseslint.configs.recommended,

  // 3. Next.js公式の推奨ルール
  {
    files: ['**/*.{js,jsx,ts,tsx}'], // 対象ファイルを指定
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules, // Next.js公式の推奨ルールを適用
      ...nextPlugin.configs['core-web-vitals'].rules, // Core Web Vitals関連のルールも適用
      // 必要に応じて、追加でカスタムルールや上書きを設定
      // 例: 'no-console': 'warn',
      // 例: '@next/next/no-img-element': 'error', // <img>タグの使用を禁止し<Image>コンポーネントを強制
    },
  },

  // 4. グローバル変数（ブラウザ環境など）
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        project: ['./tsconfig.json'],
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },

  // 5. 開発環境でのみ有効にしたいルールなど、特定のユースケースに対応する設定
  {
    files: ['**/__tests__/**/*.{js,ts,jsx,tsx}', '**/*.test.{js,ts,jsx,tsx}'],
    rules: {
      // テストファイルでは特定のLinterルールを無効にするなど
      // 'no-unused-expressions': 'off',
    },
  },
);