/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Architectural navy — headers, primary surfaces, buttons.
        navy: {
          DEFAULT: '#0A192F',
          50: '#F4F7FB',
          100: '#E3EAF3',
          200: '#C7D5E5',
          600: '#1E4472',
          700: '#163658',
          800: '#0E2440',
          900: '#0A192F',
          950: '#061020',
        },
        // Champagne gold — labels, fine rules, icons, selected states.
        champagne: {
          // DEFAULT/soft are decorative (rules, icons, text on navy).
          // `deep` is the on-white variant: 5.0:1 against white, so small
          // uppercase labels stay legible and pass AA.
          DEFAULT: '#C5A059',
          soft: '#DCC79A',
          deep: '#8A6A28',
        },
        ivory: '#F9F7F3',
        mist: '#F4F7FB',
        ink: {
          // Contrast against white: 12.6:1, 6.5:1 and 4.6:1 respectively, so
          // body, secondary and meta text all clear WCAG AA.
          DEFAULT: '#333333',
          soft: '#565E6D',
          faint: '#6E7684',
        },
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        // Fluid editorial type scale.
        'display-xl': ['clamp(2.35rem, 5.2vw, 4.5rem)', { lineHeight: '1.04', letterSpacing: '-0.025em' }],
        'display-lg': ['clamp(2rem, 3.8vw, 3.15rem)', { lineHeight: '1.08', letterSpacing: '-0.022em' }],
        'display-md': ['clamp(1.65rem, 2.8vw, 2.4rem)', { lineHeight: '1.14', letterSpacing: '-0.018em' }],
        'display-sm': ['clamp(1.35rem, 1.8vw, 1.6rem)', { lineHeight: '1.25', letterSpacing: '-0.012em' }],
        'body-lg': ['1.0625rem', { lineHeight: '1.7' }],
        label: ['0.75rem', { lineHeight: '1.1', letterSpacing: '0.22em' }],
        'label-sm': ['0.6875rem', { lineHeight: '1.1', letterSpacing: '0.2em' }],
      },
      borderRadius: {
        // Rounded precision: 4px for UI, 12-18px for imagery.
        ui: '4px',
        image: '14px',
        panel: '18px',
        pill: '999px',
      },
      maxWidth: {
        shell: '1320px',
        prose: '42rem',
      },
      boxShadow: {
        card: '0 18px 40px -28px rgba(10, 25, 47, 0.45)',
        lift: '0 30px 60px -30px rgba(10, 25, 47, 0.35)',
        header: '0 1px 0 0 rgba(10, 25, 47, 0.07), 0 14px 30px -24px rgba(10, 25, 47, 0.4)',
        panel: '0 40px 80px -40px rgba(10, 25, 47, 0.45)',
      },
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translate3d(0, 18px, 0)' },
          '100%': { opacity: '1', transform: 'translate3d(0, 0, 0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'image-in': {
          '0%': { opacity: '0', transform: 'scale(1.04)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'panel-in': {
          '0%': { opacity: '0', transform: 'translate3d(0, -8px, 0)' },
          '100%': { opacity: '1', transform: 'translate3d(0, 0, 0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fade-in 0.6s ease-out both',
        'image-in': 'image-in 1.2s cubic-bezier(0.22, 1, 0.36, 1) both',
        'panel-in': 'panel-in 0.28s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
    },
  },
  plugins: [],
};
