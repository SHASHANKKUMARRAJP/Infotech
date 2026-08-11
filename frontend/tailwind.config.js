/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'zoom-slow': 'zoom 20s infinite alternate',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'bar-grow': 'barGrow 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'wiggle': 'wiggle 1s ease-in-out infinite',
      },
      keyframes: {
        zoom: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.1)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        barGrow: {
          '0%': { height: '0%', opacity: '0' },
          '100%': { opacity: '1' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        floatBlob: {
          '0%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(5%, 10%) scale(1.1)' },
          '66%': { transform: 'translate(-5%, 5%) scale(0.95)' },
          '100%': { transform: 'translate(0, 0) scale(1)' },
        }
      },
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5', // Primary
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        }
      }
    },
  },
  plugins: [],
}
