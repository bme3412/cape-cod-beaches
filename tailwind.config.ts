import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ocean: '#0077b6',
        sand: '#e9c46a',
        seafoam: '#52b788',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        mono: ['"DM Mono"', '"Courier New"', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-coastal':
          'linear-gradient(135deg, #0077b6 0%, #52b788 50%, #e9c46a 100%)',
      },
    },
  },
  plugins: [],
}

export default config
