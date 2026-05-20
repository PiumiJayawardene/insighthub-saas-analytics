/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'base': {
          50: 'rgb(var(--text-primary))',
          100: 'rgb(var(--text-primary))',
          200: 'rgb(var(--text-secondary))',
          300: 'rgb(var(--text-secondary))',
          400: 'rgb(var(--text-secondary))',
          500: 'rgb(var(--border-light))',
          600: 'rgb(var(--border-light))',
          700: 'rgb(var(--card-bg))',
          800: 'rgb(var(--bg-secondary))',
          900: 'rgb(var(--bg-primary))',
        }
      },
      animation: {
        'shimmer': 'shimmer 2s infinite linear',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
    },
  },
  plugins: [],
}