/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['IBM Plex Sans Arabic', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#0A0A0A',    // Near black
          light: '#1A1A1A',      // Lighter black
          dark: '#000000',       // Pure black
        },
        accent: {
          DEFAULT: '#C5FF6B',    // Bright lime
          light: '#D8FFB9',      // Light lime
          dark: '#A8E650',       // Dark lime
        },
        surface: {
          DEFAULT: '#FFFFFF',
          secondary: '#F3F4F6',
          dark: '#0A0A0A',
          'dark-secondary': '#1A1A1A',
        },
        text: {
          DEFAULT: '#FFFFFF',
          secondary: '#A3A3A3',
          light: '#D4D4D4',
          inverse: '#000000',
        },
        status: {
          success: '#22c55e',    // Vibrant green
          warning: '#eab308',    // Vibrant yellow
          error: '#ef4444',      // Vibrant red
          info: '#3b82f6',       // Vibrant blue
        },
        card: {
          blue: '#3b82f6',
          purple: '#8b5cf6',
          pink: '#ec4899',
          orange: '#f97316',
          green: '#22c55e',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.5s ease-in-out',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      boxShadow: {
        'glow': '0 0 20px rgba(197, 255, 107, 0.3)',
        'glow-lg': '0 0 30px rgba(197, 255, 107, 0.4)',
      },
    },
  },
  plugins: [],
};