/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        yellow: {
          400: '#FFD700', // Altın sarısı
        },
        red: {
          900: '#8B0000', // Kadife Bordo
        },
        green: {
          900: '#006400', // Koyu Yeşil
        },
        gray: {
          900: '#1C1C1C', // Derin koyu arka plan rengi
        },
      },
    },
  },
  plugins: [],
}