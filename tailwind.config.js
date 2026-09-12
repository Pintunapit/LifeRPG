/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        rpg: {
          dark: '#0a0d14',
          surface: '#0f1420',
          card: '#151b2a',
          border: '#242e44',
          'border-light': '#384666',
          muted: '#8e9bb3',
          gold: '#fbbf24',
          'gold-dark': '#d97706',
          cyan: '#06b6d4',
          'cyan-dark': '#0891b2',
          purple: '#a855f7',
          'purple-dark': '#7e22ce',
          crimson: '#ef4444',
          emerald: '#10b981',
        }
      },
      boxShadow: {
        'glow-gold': '0 0 25px rgba(251, 191, 36, 0.25)',
        'glow-cyan': '0 0 25px rgba(6, 182, 212, 0.25)',
        'glow-purple': '0 0 25px rgba(168, 85, 247, 0.25)',
        'glow-crimson': '0 0 25px rgba(239, 68, 68, 0.25)',
        'glow-emerald': '0 0 25px rgba(16, 185, 129, 0.25)',
      },
      backgroundImage: {
        'radial-gradient': 'radial-gradient(var(--tw-gradient-stops))',
        'rpg-gradient': 'linear-gradient(135deg, #0f1420 0%, #151b2a 100%)',
      },
      keyframes: {
        'float-up': {
          '0%': { opacity: '1', transform: 'translateY(0) scale(0.95)' },
          '100%': { opacity: '0', transform: 'translateY(-40px) scale(1.1)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 10px rgba(251, 191, 36, 0.5))' },
          '50%': { opacity: '0.8', filter: 'drop-shadow(0 0 20px rgba(251, 191, 36, 0.8))' },
        },
        'shimmer': {
          '100%': { transform: 'translateX(100%)' },
        }
      },
      animation: {
        'float-up': 'float-up 1.2s ease-out forwards',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s infinite',
      }
    },
  },
  plugins: [],
}
