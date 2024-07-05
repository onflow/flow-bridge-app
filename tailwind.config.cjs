// tailwind.config.cjs
export default {
  darkMode: 'class', // Enable dark mode using a CSS class
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        xlg: '16px',
      },
      colors: {
        primary: {
          DEFAULT: '#00EF8B',
          highlight: '#00EF8B',
        },
        secondary: '#14171A',
        accent: '#657786',
        background: '#15202B',
        card: '#192734',
      },
    },
  },
  plugins: [],
};