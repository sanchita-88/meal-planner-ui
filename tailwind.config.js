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
      
      // --- FIX 1: Add all missing custom animation utilities ---
      animation: {
        'gradient-xy': 'gradient-xy 15s ease infinite', // Existing animation
        
        // NEW ANIMATIONS (References the @keyframes names in App.css)
        'scale-in': 'scale-in 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'logo-pop-in': 'logo-pop-in 0.6s ease-out 0.2s forwards',
        'pulse-button': 'subtle-pulse 2s infinite ease-in-out',
        'cloud-shift': 'soft-cloud-shift 20s linear infinite',
      },
      
      // --- FIX 2: Define the keyframes we are using (optional but safe) ---
      keyframes: {
        // Existing keyframe
        'gradient-xy': {
          '0%, 100%': { 'background-size': '400% 400%', 'background-position': '0% 50%' },
          '50%': { 'background-size': '400% 400%', 'background-position': '100% 50%' }
        },
        
        // NEW KEYFRAMES (Required reference for the animations above)
        'scale-in': { /* Keyframes are in App.css, but naming them here helps compilation */ },
        'logo-pop-in': { /* Keyframes are in App.css */ },
        'subtle-pulse': { /* Keyframes are in App.css */ },
        'soft-cloud-shift': { /* Keyframes are in App.css */ },
      }
    },
  },
  plugins: [],
}