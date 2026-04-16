/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        primary: {
          DEFAULT: '#0061FF',
          hover: '#0040CC',
          active: '#002B99',
          light: '#E3F2FD',
        },
        // Trust Score Segment Colors
        butterfly: {
          DEFAULT: '#10B981',
          light: '#D1FAE5',
          dark: '#047857',
        },
        loyal: {
          DEFAULT: '#F59E0B',
          light: '#FEF3C7',
          dark: '#D97706',
        },
        'one-time': {
          DEFAULT: '#6366F1',
          light: '#E0E7FF',
          dark: '#4F46E5',
        },
        risky: {
          DEFAULT: '#EF4444',
          light: '#FEE2E2',
          dark: '#DC2626',
        },
        // Semantic Status Colors
        success: {
          DEFAULT: '#10B981',
          light: '#D1FAE5',
          dark: '#047857',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: '#FEF3C7',
          dark: '#D97706',
        },
        danger: {
          DEFAULT: '#EF4444',
          light: '#FEE2E2',
          dark: '#DC2626',
        },
        info: {
          DEFAULT: '#6366F1',
          light: '#E0E7FF',
          dark: '#4F46E5',
        },
        // Grayscale Colors
        text: {
          primary: '#111827',
          secondary: '#374151',
          tertiary: '#6B7280',
          disabled: '#9CA3AF',
        },
        bg: {
          primary: '#F9FAFB',
          secondary: '#FFFFFF',
          hover: '#F3F4F6',
        },
        border: {
          DEFAULT: '#E5E7EB',
          light: '#D1D5DB',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        xs: ['12px', { lineHeight: '16px' }],
        sm: ['14px', { lineHeight: '20px' }],
        base: ['16px', { lineHeight: '24px' }],
        lg: ['18px', { lineHeight: '28px' }],
        xl: ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
        '3xl': ['30px', { lineHeight: '36px' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        'lg': '12px',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [],
}