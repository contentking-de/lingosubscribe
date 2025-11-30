import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#f0641e',
          50: '#fef4ed',
          100: '#fde6d3',
          200: '#fbcba5',
          300: '#f8a66d',
          400: '#f47733',
          500: '#f0641e',
          600: '#e14a0e',
          700: '#ba370e',
          800: '#942d13',
          900: '#782812',
        },
        secondary: {
          DEFAULT: '#3cbed2',
          50: '#ecfdff',
          100: '#cff7fb',
          200: '#a5eef5',
          300: '#6ae0ec',
          400: '#3cbed2',
          500: '#20a3b8',
          600: '#1d8299',
          700: '#1e697d',
          800: '#215768',
          900: '#204959',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
export default config

