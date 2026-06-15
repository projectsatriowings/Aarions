/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          gold: '#E8A317',
          darkGold: '#C8870F',
          brown: '#2D1F17',
          cream: '#FFF8EC',
          darkCream: '#F8EED8',
        }
      },
      fontFamily: {
        playfair: ['Inter', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'luxury-gradient': 'linear-gradient(135deg, #2D1F17 0%, #1A120D 100%)',
        'cream-gradient': 'linear-gradient(180deg, #FFF8EC 0%, #FFFDF9 100%)',
        'gold-gradient': 'linear-gradient(135deg, #E8A317 0%, #C8870F 100%)',
      }
    },
  },
  plugins: [],
}
