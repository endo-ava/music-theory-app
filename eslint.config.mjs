// eslint.config.js
import js from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import tseslint from 'typescript-eslint';
import unusedImports from 'eslint-plugin-unused-imports';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      '@next/next': nextPlugin,
      'unused-imports': unusedImports,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      
      // 元のルールはオフにする
      '@typescript-eslint/no-unused-vars': 'off', 
      
      // 新しいプラグインのルールを設定
      'unused-imports/no-unused-imports': 'error', // 未使用のimportをエラーに
      'unused-imports/no-unused-vars': [ // 未使用の変数もチェック
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
  // ...（以下省略）
);