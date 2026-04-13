export default {
  content: ['./index.html', './src/**/*.{svelte,js,ts}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        thinkies: {
          // Purple + Coral palette
          "primary": "#533483",           // Purple (brand)
          "primary-content": "#ffffff",
          "secondary": "#4a5568",         // Neutral gray
          "secondary-content": "#ffffff",
          "accent": "#FD5353",            // Coral (immutable)
          "accent-content": "#ffffff",
          "neutral": "#1a1a2e",           // Deep navy - footer (matches banner)
          "neutral-content": "#f7fafc",
          "base-100": "#ffffff",          // White
          "base-200": "#f8f6ff",          // Very light lavender
          "base-300": "#ede9f8",          // Light lavender
          "base-content": "#1a1a2e",      // Dark text (matches brand dark)
          "info": "#533483",
          "success": "#533483",
          "warning": "#f59e0b",           // Amber
          "error": "#dc2626",             // Red

          // Borders and spacing
          "--rounded-box": "1rem",
          "--rounded-btn": "0.5rem",
          "--rounded-badge": "1.5rem",
          "--animation-btn": "0.25s",
          "--animation-input": "0.2s",
          "--btn-focus-scale": "0.98",
          "--tab-radius": "0.5rem",
        },
      },
    ],
  },
}
