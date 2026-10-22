/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep clinical teal
        primary: {
          50:  '#effaf8',
          100: '#d7f3ee',
          200: '#b0e6de',
          300: '#7fd2c8',
          400: '#4db8ad',
          500: '#2a9d93',
          600: '#1f7f79',
          700: '#1c6762',
          800: '#1b5350',
          900: '#1a4643',
        },
        // Dark teal-navy for the sidebar and login panel
        ink: {
          700: '#173a45',
          800: '#0f2a33',
          900: '#0a1d24',
        },
        hospital: {
          blue:   '#1a56db',
          green:  '#057a55',
          red:    '#e02424',
          yellow: '#c27803',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        rise: {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'none' },
        },
        pop: {
          '0%':   { opacity: '0', transform: 'scale(.96) translateY(6px)' },
          '100%': { opacity: '1', transform: 'none' },
        },
        float: {
          '0%,100%': { transform: 'translate(0,0)' },
          '50%':     { transform: 'translate(24px,-28px)' },
        },
        ecg: {
          '0%':   { strokeDashoffset: '1000', opacity: '1' },
          '65%':  { strokeDashoffset: '0',    opacity: '1' },
          '90%':  { strokeDashoffset: '0',    opacity: '0' },
          '100%': { strokeDashoffset: '1000', opacity: '0' },
        },
      },
      animation: {
        rise:  'rise .5s cubic-bezier(.2,.7,.2,1) both',
        pop:   'pop .22s ease-out both',
        float: 'float 14s ease-in-out infinite',
        ecg:   'ecg 4.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
