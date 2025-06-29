/** @type {import('tailwindcss').Config} */
import typography from "@tailwindcss/typography";
import daisyui from "daisyui";

export default {
    content: [
        './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
        './public/**/*.html', // Make sure this line is present
    ],
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
    plugins: [typography, daisyui],
    daisyui: {
        themes: true,
        darkTheme: "dark",
        logs: false,
    }
};