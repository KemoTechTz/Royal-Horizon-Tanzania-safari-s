/** @type {import('tailwindcss').Config} */
export default {
  content: ["./*.html", "./js/**/*.js"],
  theme: {
    extend: {
      colors: {
        royalGreen: "#12372A",
        royalGold: "#C9A14A",
        warmSand: "#F4E7D1",
        charcoal: "#111111",
        ivory: "#FFFDF7",
        iceBlue: "#DCEFF5",
        sunset: "#C46A2B",
        savannah: "#8A5A32"
      },
      fontFamily: {
        heading: ["Fraunces", "Cormorant Garamond", "serif"],
        body: ["Manrope", "Inter", "sans-serif"]
      },
      boxShadow: {
        premium: "0 24px 70px rgba(17, 17, 17, 0.14)",
        soft: "0 14px 40px rgba(18, 55, 42, 0.12)"
      }
    }
  },
  plugins: [require("daisyui"), require("@tailwindcss/typography")],
  daisyui: {
    themes: [
      {
        royalhorizon: {
          primary: "#12372A",
          secondary: "#C9A14A",
          accent: "#C46A2B",
          neutral: "#111111",
          "base-100": "#FFFDF7",
          "base-200": "#F4E7D1",
          info: "#DCEFF5",
          success: "#2F6B4F",
          warning: "#C9A14A",
          error: "#B64832"
        }
      }
    ],
    darkTheme: false
  }
};
