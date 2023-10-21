/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    // screens: {
    //   sm: '480px',
    //   md: '768px',
    //   lg: '976px',
    //   xl: '1440px',
    // },
    // colors: {
    //   'blue': '#1fb6ff',
    //   'purple': '#7e5bef',
    //   'pink': '#ff49db',
    //   'orange': '#ff7849',
    //   'green': '#13ce66',
    //   'yellow': '#ffc82c',
    //   'gray-dark': '#273444',
    //   'gray': '#8492a6',
    //   'gray-light': '#d3dce6',
    // },
    // fontFamily: {
    //   sans: ['Graphik', 'sans-serif'],
    //   serif: ['Merriweather', 'serif'],
    // },
    extend: {
      colors: {
        'menu-yellow': 'rgb(215, 171, 97)',
        'stripe-red': 'rgb(200, 35, 55)',
        'stripe-orange': 'rgb(224, 98, 54)',
        'stripe-yellow': 'rgb(215, 171, 97)',
        'stripe-blue': 'rgb(47, 76, 121)',
      },
      backgroundImage: {
        'starfield-stripes': 
        'linear-gradient(rgb(200, 35, 55) 0%, rgb(200, 35, 55) 25%, rgb(224, 98, 54) 25%, rgb(224, 98, 54) 50%, rgb(215, 171, 97) 50%, rgb(215, 171, 97) 75%, rgb(47, 76, 121) 75%, rgb(47, 76, 121) 100%)',
      },
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          '"Noto Sans"',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
        orbitron: ["Orbitron", "sans-serif"],
      },
      transformOrigin: {
        'stripe-wipe': '100% 50%'
      },
      transitionTimingFunction: {
        'stripe-ease': 'ease'
      },
      transitionDelay: {
        'ribbon': 'calc(50ms * var(--ribbon-index))'
      },
      transitionProperty: {
        'trans': 'transform'
      },
      gridTemplateRows: {
        'comment': '3rem minmax(0, 1fr) minmax(0, 1fr)'
      }
    },
  },
  plugins: [],
}
