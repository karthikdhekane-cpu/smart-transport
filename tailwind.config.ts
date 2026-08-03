import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00C853',
          dark: '#009624',
          light: '#5efc82',
        },
        gold: {
          DEFAULT: '#FFD700',
          dark: '#FFA000',
          light: '#FFEE58',
        },
        glass: 'rgba(255,255,255,0.05)',
        'glass-border': 'rgba(255,255,255,0.1)',
      },
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', 'system-ui', 'sans-serif'],
        display: ['SF Pro Display', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient':
          'linear-gradient(135deg, #0a0a0a 0%, #0d1f0d 50%, #0a0a0a 100%)',
        'card-gradient':
          'linear-gradient(135deg, rgba(0,200,83,0.1) 0%, rgba(0,0,0,0) 100%)',
        'neon-gradient':
          'linear-gradient(90deg, #00C853, #FFD700, #00C853)',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0,0,0,0.4)',
        neon: '0 0 20px rgba(0,200,83,0.4), 0 0 40px rgba(0,200,83,0.2)',
        'neon-gold': '0 0 20px rgba(255,215,0,0.4)',
        card: '0 20px 60px rgba(0,0,0,0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        float: 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        glow: 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          from: { boxShadow: '0 0 10px rgba(0,200,83,0.3)' },
          to: { boxShadow: '0 0 30px rgba(0,200,83,0.8)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};

export default config;
