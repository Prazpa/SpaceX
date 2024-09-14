/** @type {import('tailwindcss').Config} */
export default {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, 
  theme: {
    extend: {
      backgroundImage: {
        'bgspace': "url('/src/assets/space.png')",
      }
    }
  },
  variants: {
    extend: {},
  },
  plugins: []
}

