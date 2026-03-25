import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy:   '#051e33',
        ocean:  '#0d3b5e',
        blue:   '#0e528c',
        accent: '#3374b7',
        gold:   '#d4a853',
        cream:  '#f8f8f8',
        charcoal: '#1a1a1a',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(160deg, rgba(5,30,51,0.90) 0%, rgba(13,59,94,0.75) 60%, rgba(5,30,51,0.92) 100%)',
      },
    },
  },
  plugins: [],
};
export default config;
