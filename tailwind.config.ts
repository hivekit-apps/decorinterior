import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        charcoal: '#1a1a1a',
        cream: '#faf7f2',
        bronze: '#b8893d',
        bronzeDark: '#8d6625',
        softgray: '#6b6b6b',
      },
      fontFamily: {
        display: ['Playfair Display', 'Fraunces', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      maxWidth: {
        prose: '68ch',
      },
    },
  },
  plugins: [],
};

export default config;
