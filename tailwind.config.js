import colors from "tailwindcss/colors";

/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		colors: {
			transparent: "transparent",
			current: "currentColor",
			black: colors.black,
			white: colors.white,
			gray: {
				1: "hsl(var(--slate-1) / <alpha-value>)",
				2: "hsl(var(--slate-2) / <alpha-value>)",
				3: "hsl(var(--slate-3) / <alpha-value>)",
				4: "hsl(var(--slate-4) / <alpha-value>)",
				5: "hsl(var(--slate-5) / <alpha-value>)",
				6: "hsl(var(--slate-6) / <alpha-value>)",
				7: "hsl(var(--slate-7) / <alpha-value>)",
				8: "hsl(var(--slate-8) / <alpha-value>)",
				9: "hsl(var(--slate-9) / <alpha-value>)",
				10: "hsl(var(--slate-10) / <alpha-value>)",
				11: "hsl(var(--slate-11) / <alpha-value>)",
				12: "hsl(var(--slate-12) / <alpha-value>)",
			},
			overlay: {
				1: "var(--blackA-1)",
				2: "var(--blackA-2)",
				3: "var(--blackA-3)",
				4: "var(--blackA-4)",
				5: "var(--blackA-5)",
				6: "var(--blackA-6)",
				7: "var(--blackA-7)",
				8: "var(--blackA-8)",
				9: "var(--blackA-9)",
				10: "var(--blackA-10)",
				11: "var(--blackA-11)",
				12: "var(--blackA-12)",
			},
		},
		extend: {},
	},
	plugins: [
		require("@tailwindcss/forms"),
		require("@tailwindcss/container-queries"),
		require("tailwindcss-animate"),
	],
};
