import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  // DaisyUI options (optional): choose a default theme
  daisyui: {
    themes: ['light', 'dark', 'corporate', 'emerald'],
  },
};

export default config;