// tailwind.config.cjs
export default {
  darkMode: 'class', // Enable dark mode using a CSS class
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1DA1F2',
        secondary: '#14171A',
        accent: '#657786',
        background: '#15202B',
        card: '#192734',
      },
    },
  },
  plugins: [],
};