/** @type {import('tailwindcss').Config} */
module.exports = {
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
	plugins: [require("@tailwindcss/typography"),require("daisyui")],
	daisyui: {
		themes: true, // true: all themes | false: only light + dark | array: specific themes like this ["light", "dark", "cupcake"]
		darkTheme: "dark", // name of one of the included themes for dark mode
		logs: false, // Shows info about daisyUI version and used config in the console when building your CSS
	  }
}
