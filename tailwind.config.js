/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        profit: '#10B981',
        loss: '#EF4444',
      },
      borderRadius: {
        card: '12px',
      }
    },
  },
  plugins: [],
}
