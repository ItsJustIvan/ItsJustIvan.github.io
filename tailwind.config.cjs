/** @type {import('tailwindcss').Config} */
import typography from "@tailwindcss/typography";
import daisyui from "daisyui";

export default {
    content: [
        './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
        './public/**/*.html',
    ],
    theme: {
        extend: {
            colors: {
                primary: '#280D70',
                secondary: '#9DA3C1',
                dark: '#3F4242',
                lightbg: '#F2F4F8',
                accent: '#8800FF',
                'accent-alt': '#E6C36F',
            },
            boxShadow: {
                accent: '0 2px 8px 0 #FF947233',
            },
            fontFamily: {
                heading: ['"Space Grotesk"', 'sans-serif'],
                body: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [typography, daisyui],
    daisyui: {
        themes: [
            {
                ItsJustIvansTheme: { // Theme name changed here!
                    "primary": "#280D70",
                    "primary-content": "#F2F4F8",

                    "secondary": "#9DA3C1",
                    "secondary-content": "#3F4242",

                    "accent": "#8800FF",
                    "accent-content": "#F2F4F8",

                    "neutral": "#3F4242",
                    "neutral-content": "#F2F4F8",

                    "base-100": "#F2F4F8",
                    "base-200": "#E6EBF3",
                    "base-300": "#D9E0EC",
                    "base-content": "#3F4242",
                },
            },
            // Add other default DaisyUI themes here if you want them available:
            // "light",
            // "dark",
        ],
        darkTheme: "dark",
        logs: false,
    }
};