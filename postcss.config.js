// postcss.config.js
// Import plugins here if they are part of your tailwind config
// Note: If DaisyUI/Typography cause issues, we might temporarily remove them again
// For now, let's assume they work when directly inlined.
import typography from "@tailwindcss/typography"; // Add this import
import daisyui from "daisyui"; // Add this import

export default {
  plugins: {
    '@tailwindcss/postcss': {
      config: { // <--- PASTE THE ENTIRE TAILWIND CONFIG OBJECT HERE
        content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
        theme: {
            extend: {
                colors: {
                    primary: '#2E2E59', // Deep Navy Indigo
                    secondary: '#9DA3C1', // Muted Steel Lavender
                    dark: '#3F4242', // Charcoal Gray
                    lightbg: '#F2F4F8', // Section background
                    accent: '#FF9472', // Warm coral
                    'accent-alt': '#E6C36F', // Soft gold
                },
                boxShadow: {
                    accent: '0 2px 8px 0 #FF947233', // subtle accent shadow
                },
                fontFamily: {
                    heading: ['"Space Grotesk"', 'sans-serif'],
                    body: ['Inter', 'sans-serif'],
                },
            },
        },
        plugins: [typography, daisyui], // <<< Ensure these are the imported variables
        daisyui: {
            themes: true,
            darkTheme: "dark",
            logs: false,
        }
      }, // <--- END OF PASTED TAILWIND CONFIG OBJECT
    },
    autoprefixer: {},
  },
};