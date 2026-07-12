/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#F6F4EE',
        ink: '#12162A',
        indigo: {
          DEFAULT: '#161B3D',
          dark: '#0E1130',
        },
        gold: {
          DEFAULT: '#E8A33D',
          soft: '#F4C065',
        },
        green: {
          DEFAULT: '#1E9E6C',
        },
        rust: {
          DEFAULT: '#D9553A',
        },
        line: 'rgba(18,22,42,0.12)',
        muted: 'rgba(18,22,42,0.62)',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        brand: '18px',
      },
      boxShadow: {
        card: '0 14px 30px rgba(18,22,42,0.08)',
        cta: '0 6px 18px rgba(22,27,61,0.25)',
      },
    },
  },
  plugins: [],
}
