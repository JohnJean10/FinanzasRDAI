import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#3b82f6", // Blue 500
                secondary: "#64748b", // Slate 500
                success: "#10b981", // Emerald 500
                danger: "#ef4444", // Red 500
                warning: "#f59e0b", // Amber 500
                background: "var(--background)",
                foreground: "var(--foreground)",
                // Bento Grid Design System
                'bento-light': '#ffffff',
                'bento-dark': '#1E2030',
                'accent-neon': '#22c55e', // Green 500 for action buttons
            },
            borderRadius: {
                'bento': '32px',
                '2xl': '16px',
                '3xl': '24px',
            },
            boxShadow: {
                'bento': '0 20px 60px -10px rgba(100, 116, 139, 0.15)',
                'bento-hover': '0 25px 80px -10px rgba(100, 116, 139, 0.2)',
                'bento-dark': '0 20px 60px -10px rgba(0, 0, 0, 0.4)',
            },
        },
    },
    plugins: [],
};
export default config;
