module.exports = {
  purge: [],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        surface: { DEFAULT: "#000000", light: "#212328", dark: "#000000" },
        blue: { light: "#4678f9", DEFAULT: "#376DF9", dark: "#376DF9" },
      },
    },
  },

  important: true,
  variants: { extend: {} },
  plugins: [require("@tailwindcss/forms")],
};
