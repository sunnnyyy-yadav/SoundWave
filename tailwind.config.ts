import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Geist', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'monospace'],
      },
      colors: {
        'dark-bg': '#0A0A0A',
        'dark-secondary': '#0F0F0F',
        'dark-tertiary': '#1A1A1A',
        'accent-yellow': '#FFED4E',
        'accent-purple': '#9D4EDD',
        'accent-cyan': '#00D9FF',
        'accent-lime': '#39FF14',
      },
      backdropFilter: {
        'glass': 'backdrop-filter: blur(10px)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glow': '0 0 40px rgba(236, 72, 153, 0.2)',
      },
    },
  },
  plugins: [],
}
export default config
