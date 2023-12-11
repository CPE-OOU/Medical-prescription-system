import type { Config } from 'tailwindcss';

//@ts-ignore
import gridAreaPlugin from '@savvywombat/tailwindcss-grid-areas';
const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    fontFamily: {
      'tt-commons': ['TTCommons', 'sans'],
    },

    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },

    extend: {
      gridTemplateAreas: {
        layout: [
          'sidebar header header',
          'sidebar main main',
          'sidebar main main',
        ],
      },
      gridTemplateColumns: {
        layout: '240px 1fr',
      },
      gridTemplateRows: {
        layout: `3.75rem 1fr`,
      },
      boxShadow: {
        separator: '0px -1px 0px 0px #D6DDEB inset',
      },

      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        yellow: '#FFB836',
        green: '#56CDAD',
        red: '#FF6550',
        blue: '#26A4FF',
        purple: '#7B61FF',
        neutral: {
          100: '#25324B',
          80: '#515B6F',
          60: '#7C8493',
          40: '#A8ADB7',
          20: '#E4E5E7',
          10: '#F9FAFC',
          0: '#F8F8FD',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'var(--primary-blue)',
          brand: 'var(--primary-green)',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'var(--secondary-yellow)',
          brand: 'var(--secondary-pink)',
          foreground: 'hsl(var(--secondary-foreground))',
        },

        tertiary: 'var(--colour-tertiary)',
        natural: {
          100: '#262626',
          90: '#292929',
          80: '#343434',
          60: '#757B82',
          40: '#9EA3A7',
          20: '#C8CACD',
          10: '#F3F3F7',
        },

        bg: {
          black: '#1E1E1E',
          dark: '#292929',
          white: '#FFFFFF',
          gray: '#F5F5F5',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [gridAreaPlugin],
};
export default config;
