export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#18212f",
        panel: "#f7f9fb",
        civic: "#0f766e",
        signal: "#b45309",
        alert: "#b91c1c",
      },
      boxShadow: {
        soft: "0 10px 30px rgba(24, 33, 47, 0.08)",
      },
    },
  },
  plugins: [],
};
