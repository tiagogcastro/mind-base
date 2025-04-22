import { type Config } from "tailwindcss"

const config: Config = {
  mode: 'jit',
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          '900': '#151516',
          '800': '#1C1D1E',
          '700': '#232425',
          '600': '#353636',
          '500': '#383939',
          '400': '#515252',
          '300': '#6A6B6B',
          '200': '#9C9C9C',
          '100': '#c3c1b9',
          '50': '#faf7ec',
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
      },
    },
  },
  plugins: [],
}
export default config
