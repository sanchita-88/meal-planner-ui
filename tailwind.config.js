/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-gold': '#FACC15', // Gold
        'primary-teal': '#14B8A6', // Teal
        'accent-dark': '#0F172A', // Slate-900 for text
        'bg-light': '#F8FAFC', // Slate-50 for background
      },
      animation: {
        'gradient-xy': 'gradient-xy 15s ease infinite',
      },
      keyframes: {
        'gradient-xy': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': '0% 50%'
          },
          '50%': {
            'background-size': '400% 400%',
            'background-position': '100% 50%'
          },
        }
      }
    },
  },
  plugins: [],
}