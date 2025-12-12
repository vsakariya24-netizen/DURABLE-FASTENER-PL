/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // आपकी ब्रांडिंग के हिसाब से कस्टम कलर्स
        brand: {
          yellow: '#FFD700', // Gold/Yellow for luxury/hardware
          dark: '#0F1115',   // Deep Black/Charcoal for premium feel
          blue: '#1e3a8a',   // Corporate Blue
          gray: '#F3F4F6',   // Light gray for backgrounds
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Professional font
      },
      animation: {
        // आपके कोड में यूज़ हुए एनिमेशन
        blob: "blob 7s infinite",
        marquee: "marquee 25s linear infinite",
      },
      keyframes: {
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
    },
  },
  plugins: [],
}