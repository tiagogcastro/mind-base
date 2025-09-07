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
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      animation: {
        'pulse-bright': 'pulse-bright 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'pulse-bright': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },

      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
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

        purple: {
          '500': '#a855f7',
          '600': '#9333ea',
        },
        blue: {
          '500': '#3b82f6',
          '600': '#2563eb',
        },
        pink: {
          '500': '#ec4899',
          '600': '#db2777',
        },
        cyan: {
          '500': '#06b6d4',
          '600': '#0891b2',
        },
        orange: {
          '500': '#f97316',
          '600': '#ea580c',
        },
        red: {
          '500': '#ef4444',
          '600': '#dc2626',
        },
      },
    },
  },
  plugins: [],
}
export default config
