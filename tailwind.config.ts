import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './features/**/*.{js,ts,jsx,tsx,mdx}',
    './styles/**/*.{js,ts,jsx,tsx,mdx,css}',
  ],
  theme: {
    extend: {
      colors: {
        // Placement Connect color system
        background: '#f7f3ee',
        primary: '#121a2e',
        accent: '#3652ff',
        success: '#1f7a55',
        warning: '#c07a2c',
        border: '#e3dfd9',
        'surface-light': '#ffffff',
      },
      fontFamily: {
        display: ['Fraunces', 'Times New Roman', 'serif'],
        serif: ['Fraunces', 'Times New Roman', 'serif'],
        sans: ['Sora', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        'body-base': ['16px', { lineHeight: '1.6' }],
        'body-lg': ['18px', { lineHeight: '1.7' }],
        'heading-sm': ['24px', { lineHeight: '1.3' }],
        'heading-md': ['32px', { lineHeight: '1.25' }],
        'heading-lg': ['48px', { lineHeight: '1.2' }],
        'heading-xl': ['64px', { lineHeight: '1.1' }],
      },
      spacing: {
        '8': '8px',
        '16': '16px',
        '24': '24px',
        '40': '40px',
        '64': '64px',
      },
      maxWidth: {
        'text': '720px',
      },
      transitionDuration: {
        'standard': '150ms',
      },
      transitionTimingFunction: {
        'standard': 'ease-in-out',
      },
    },
  },
  plugins: [],
}

export default config
