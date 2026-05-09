/** @type {import('tailwindcss').Config} */
export default {
  content: ["*.{html,js}"],
  theme: {
    container: {
      padding: {
        DEFAULT: '15px',
      }
    },
    screens: {
      sm:  '648px',
      md:  '768px',
      lg:  '960px',
      xl:  '1200px',
    },
    fontFamily: {
      primary:   'DM Serif Display',
      secondary: 'Jost',
    },
    backgroundImage: {
      hero: "url(/assets/hero/bg.jpg)",
      grid: "url(/assets/grid.png)",
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2c1a0e',   // deep espresso brown (darker, richer)
          hover:   '#3d2511',
        },
        secondary: '#6b4c35',   // mid warm brown
        accent: {
          DEFAULT:   '#7d431d',   // logo brown — main accent
          secondary: '#fdf3e3',   // warm cream background
          hover:     '#5e3115',   // darker brown on hover
          gold:      '#f9cc89',   // logo gold — highlights & badges
          muted:     '#c49a6c',   // softer mid-tone for borders/dividers
        },
      }
    },
  },
  plugins: [],
}