/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Design Tokens: Balam Textiles & Math
        surface: {
          DEFAULT: '#fff8f0',
          bright: '#fff8f0',
          dim: '#e3d9c2',
          container: '#f8edd5',
          'container-low': '#fef3db',
          'container-lowest': '#ffffff',
          'container-high': '#f2e7d0',
          'container-highest': '#ece2ca',
          variant: '#ece2ca',
          tint: '#835500'
        },
        'on-surface': {
          DEFAULT: '#201b0d',
          variant: '#524534'
        },
        primary: {
          DEFAULT: '#835500',
          container: '#f5a623',
          fixed: '#ffddb4',
          'fixed-dim': '#ffb955',
          'on-container': '#644000',
          'on-fixed': '#291800',
          'on-fixed-variant': '#633f00'
        },
        secondary: {
          DEFAULT: '#625499',
          container: '#c0b1fd',
          fixed: '#e7deff',
          'fixed-dim': '#cbbeff',
          'on-container': '#4e4184',
          'on-fixed': '#1e0c52',
          'on-fixed-variant': '#4a3c7f'
        },
        tertiary: {
          DEFAULT: '#b90c55',
          container: '#ff98b0',
          fixed: '#ffd9df',
          'fixed-dim': '#ffb1c2',
          'on-container': '#910040',
          'on-fixed': '#3f0018',
          'on-fixed-variant': '#8f003f'
        },
        error: {
          DEFAULT: '#ba1a1a',
          container: '#ffdad6',
          'on-container': '#93000a'
        },
        outline: {
          DEFAULT: '#857462',
          variant: '#d7c3ae'
        },
        balam: {
          gold: '#F5A623',
          night: '#1E1548',
          teal: '#0D9488',
          magenta: '#B90C55',
          paper: '#FFF8F0',
          jade: '#2E8B57'
        }
      },
      fontFamily: {
        headline: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
        code: ['"Space Mono"', 'monospace']
      },
      boxShadow: {
        'hard-sm': '2px 2px 0px #201b0d',
        'hard': '4px 4px 0px #201b0d',
        'hard-lg': '6px 6px 0px #201b0d',
        'hard-magenta': '3px 3px 0px #b90c55'
      }
    },
  },
  plugins: [],
}
