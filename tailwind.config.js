/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors : {
        "c1" : "#E3FDFD",
        'c2' : "#CBF1F5",
        "c3" : "#A6E3E9",
        "c4" : "#71C9CE"
      }
    },
   
  },
  plugins: [],
}