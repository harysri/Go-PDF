/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Canvas + surfaces
        cream: "#f1efe2",
        sand: "#dbdac8",
        paper: "#ffffff",
        cloud: "#e6e6e6",

        // Text
        ink: "#1d1d1d",
        body: "#575757",
        muted: "#9f9f9f",
        stone: "#8c8b84",
        mist: "#bfbfbf",

        // Accent
        accent: "#d3fb43",
        "accent-hover": "#c3ef2f",
        mint: "#d3fb43",
        error: "#a33a2b",
      },
      fontFamily: {
        sans: ["Inter Tight", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontSize: {
        display: ["96px", { lineHeight: "0.92", letterSpacing: "-3px" }],
        "heading-1": ["84px", { lineHeight: "0.9", letterSpacing: "-2.52px" }],
        "heading-2": ["64px", { lineHeight: "0.98", letterSpacing: "-2px" }],
        "heading-3": ["40px", { lineHeight: "1.05", letterSpacing: "-1.2px" }],
        "heading-4": ["32px", { lineHeight: "1.1", letterSpacing: "-0.75px" }],
        "body-lg": ["20px", { lineHeight: "30px", letterSpacing: "-0.25px" }],
        caption: ["14px", { lineHeight: "20px" }],
      },
      letterSpacing: {
        display: "-2.52px",
        heading: "-1.2px",
      },
      borderRadius: {
        pill: "100px",
        "3xl": "50px",
        "2xl": "24px",
        xl: "12px",
        lg: "10px",
        md: "8px",
      },
      borderColor: {
        DEFAULT: "#dbdac8",
      },
    },
  },
  plugins: [],
};
