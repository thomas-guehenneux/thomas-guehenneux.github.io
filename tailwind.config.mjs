/** @type {import('tailwindcss').Config} */

import defaultTheme from 'tailwindcss/defaultTheme'
export default {
  darkMode: ['class'],
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  plugins: [require('@tailwindcss/typography')],
  presets: [require('./ui.preset.js')],
  theme: {
    extend: {
      fontFamily: {
        sans: ['MonumentGrotesk', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        'ml-yellow': 'rgb(var(--ml-yellow))',
      },
      typography: {
        DEFAULT: {
          css: {
            lineHeight: '1.75',
            fontSize: '1.25rem',
            // maxWidth: '65ch',
            'blockquote p:first-of-type::before': { content: 'none' },
            'blockquote p:first-of-type::after': { content: 'none' },
            'blockquote p:first-of-type': { margin: 0, 'line-height': 1.75 },
            color: 'var(--secondary)',
            blockquote: {
              'font-size': '1em',
              'font-style': 'italic',
              padding: '1.2em 30px 1.2em 75px',
              'border-left': '8px solid rgb(var(--ml-yellow))',
              'line-height': 1.6,
              position: 'relative',
              background: '#eceff3',
            },
            'blockquote::before': {
              color: '#ff0',
              fontSize: '4em',
              position: 'absolute',
              left: '10px',
              top: '-10px',
            },
            figcaption: { textAlign: 'center' },
          },
        },
      },
    },
  },
}
