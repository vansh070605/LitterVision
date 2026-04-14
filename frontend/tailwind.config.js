/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "surface-variant": "#444", "primary-container": "#e91722", "secondary-fixed": "#e5e2e1", "tertiary-fixed": "#c9e7f7", "secondary-container": "#e2dfde", "on-primary-container": "#ffffff", "on-tertiary-container": "#fffeff", "inverse-on-surface": "#131313", "error-container": "#ffdad6", "tertiary-fixed-dim": "#adcbda", "surface-dim": "#111", "primary-fixed-dim": "#ffb4ac", "surface-container-low": "#1a1a1a", "on-secondary-fixed-variant": "#474746", "on-surface": "#e5e2e1", "on-primary-fixed": "#410002", "surface-container-high": "#2a2a2a", "surface-container-highest": "#333", "on-background": "#e5e2e1", "outline-variant": "#444", tertiary: "#44616f", "surface-container": "#222", primary: "#e91722", "on-secondary-fixed": "#1b1c1c", "inverse-surface": "#e5e2e1", "inverse-primary": "#ffb4ac", "secondary-fixed-dim": "#c8c6c5", "on-tertiary-fixed-variant": "#e5e2e1", "on-error": "#ffffff", "on-error-container": "#93000a", "on-secondary": "#ffffff", "on-primary-fixed-variant": "#93000d", "on-tertiary": "#ffffff", secondary: "#5f5e5e", "on-primary": "#ffffff", surface: "#131313", "primary-fixed": "#ffdad6", background: "#131313", "on-secondary-container": "#e5e2e1", "surface-bright": "#222", outline: "#555", "surface-tint": "#e91722", "tertiary-container": "#5d7a88", error: "#ff5252", "on-tertiary-fixed": "#001f2a", "surface-container-lowest": "#000", "on-surface-variant": "#aaa"
      },
      fontFamily: {
        headline: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
        label: ["Inter", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"]
      }
    },
  },
  plugins: [],
}
