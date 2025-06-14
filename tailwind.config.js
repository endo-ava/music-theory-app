/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-undef */
/** @type { import('tailwindcss').Config } */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // カラーパレットの統一
      colors: {
        // 五度圏の背景色
        'circle-bg': {
          from: '#1a1a1a',
          to: '#2a2a2a',
        },
        // キーエリアの色（CSS変数として定義）
        'key-area': {
          minor: 'rgba(255, 255, 255, 0.1)',
          major: 'rgba(255, 255, 255, 0.15)',
          signature: 'rgba(255, 255, 255, 0.2)',
          hover: 'rgba(255, 255, 255, 0.25)',
          selected: 'rgba(255, 255, 255, 0.3)',
        },
        // 境界線の色
        'border': 'rgba(255, 255, 255, 0.1)',
        // テキストの色
        'text-primary': 'white',
        'text-secondary': 'rgba(255, 255, 255, 0.8)',
        'text-muted': 'rgba(255, 255, 255, 0.6)',
      },
      // サイズの統一
      spacing: {
        'circle-radius': '200px',
        'circle-inner-radius': '120px',
        'circle-middle-radius': '170px',
        'circle-center-radius': '80px',
      },
      // フォントサイズの統一
      fontSize: {
        'key-minor': '0.8rem',
        'key-major': '1rem',
        'key-signature': '0.5rem',
      },
      // フォントウェイトの統一
      fontWeight: {
        'key-minor': '50',
        'key-major': '80',
        'key-signature': '50',
      },
      // アニメーション設定
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.5s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      // 背景グラデーション
      backgroundImage: {
        'circle-gradient': 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
      },
      // シャドウ
      boxShadow: {
        'circle': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'key-info': '0 4px 6px rgba(0, 0, 0, 0.1)',
      },
      // バックドロップフィルター
      backdropBlur: {
        'key-info': '8px',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
