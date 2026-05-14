import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}", "./hooks/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2D6A4F",
        "primary-light": "#D8F3DC",
        accent: "#F4A261",
        background: "#FEFCF8",
        card: "#FFFFFF",
        "text-primary": "#1B4332",
        "text-secondary": "#6B7280",
        success: "#52B788",
        danger: "#E63946"
      },
      borderRadius: {
        card: "16px",
        button: "8px"
      },
      maxWidth: {
        content: "1280px"
      },
      fontFamily: {
        story: ["Georgia", "serif"]
      },
      boxShadow: {
        soft: "0 16px 45px rgba(27, 67, 50, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
