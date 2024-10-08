/* eslint-disable @typescript-eslint/no-var-requires */
const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        mainBg: '#fff',
        textBaseColor: '#ccc',

        //? WEB COLORS
        webColor100: '#CAF0F8',
        webColor200: '#ADE8F4',
        webColor300: '#90E0EF',
        webColor400: '#48CAE4',
        webColor500: '#00B4D8',
        webColor600: '#0096C7',
        webColor700: '#0077B6',
        webColor800: '#023E8A',
        webColor900: '#03045E',

        //? TEXT
        lightText: '#EEEEEE',
        darkText: '#111111',
        primaryText: '#0077B6',
        primaryTextUnHover: '#00B4D8',
        alertRed: '#ff0f0f',
        successGreen: '#4bb543',
        inforBlue: '#0096c7',

        //? INTERACTING
        unhoverBg: '#48CAE4',
        hoveringBg: '#00B4D8',

        //? Score color
        weakColor: '#cc3300',
        normalColor: '#ac9a14',
        fineColor: '#023E8A',
        goodColor: '#339900'
      }
    },
    screens: {
      mobileSmall: '320px',
      mobileLarge: '425px',
      tabletSmall: '640px',
      tablet: '768px',
      tabletLarge: '962px',
      desktop: '1024px',
      desktopLarge: '1440px'
    }
  },
  plugins: [
    plugin(function ({ addComponents, theme }) {
      addComponents({
        '.container': {
          maxWidth: theme('columns.7xl'),
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: theme('spacing.4'),
          paddingRight: theme('spacing.4')
        }
      })
    })
  ]
}
