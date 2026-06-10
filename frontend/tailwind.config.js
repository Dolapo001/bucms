/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './styles/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f4f7fa',
          100: '#e4edf5',
          200: '#cddbeb',
          300: '#a8bfdc',
          400: '#7c9cc8',
          500: '#5a7bb2',
          600: '#456197',
          700: '#344b75', // Elegant primary navy
          800: '#1e3054', // Dark primary navy
          900: '#0b192c', // Midnight primary navy
          950: '#050c18', // Deep midnight primary navy
        },
        gold: {
          50: '#fefdf6',
          100: '#faf6db',
          200: '#f3eab6',
          300: '#edd884',
          400: '#e1be49',
          500: '#cca338', // Chapel gold
          600: '#b0872c',
          700: '#916922',
          800: '#76541f',
          900: '#64461e',
          950: '#3b270f',
        },
        surface: {
          50: '#fdfdfd',
          100: '#f8fafc',
          200: '#f1f5f9',
          300: '#e2e8f0',
          400: '#cbd5e1',
          500: '#94a3b8',
          600: '#64748b',
          700: '#475569',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Playfair Display', 'serif'], // Elegant spiritual header font
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(15, 30, 54, 0.04)',
        'glass-gold': '0 8px 32px 0 rgba(204, 163, 56, 0.08)',
        'premium': '0 12px 30px -4px rgba(15, 30, 54, 0.03), 0 4px 12px -2px rgba(15, 30, 54, 0.01)',
        'card': '0 4px 20px -2px rgba(15, 30, 54, 0.04), 0 2px 6px -1px rgba(15, 30, 54, 0.02)',
        'card-hover': '0 20px 40px -4px rgba(15, 30, 54, 0.08), 0 8px 16px -2px rgba(15, 30, 54, 0.04)',
        'gold-glow': '0 0 15px rgba(204, 163, 56, 0.2)',
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
      },
    },
  },
  plugins: [],
};
