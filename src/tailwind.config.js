/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#121212', // Gris casi negro
        darkCard: '#1E1E1E', // Gris para las tarjetas
        accentPurple: '#8B5CF6', // Morado vibrante
      }
    },
  },
  plugins: [],
}