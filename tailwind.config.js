/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#0A1628',
        army: '#1B3A6B',
        cyan: '#00D4FF',
        danger: '#FF3B3B',
        warning: '#FFB800',
        success: '#00C851',
        surface: '#0D1F3C',
        bg: '#050E1A',
        textLight: '#E8EDF5',
      },
    },
  },
  plugins: [],
}
