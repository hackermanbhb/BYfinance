/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'bg-primary': '#0F0F11',
                'bg-secondary': '#18181B',
                'primary': '#2ECC71',
                'primary-glow': 'rgba(46, 204, 113, 0.4)',
                'text-primary': '#FFFFFF',
                'text-secondary': '#A1A1AA',
                'text-muted': '#52525B',

                // Custom palette extension
                'card': 'rgba(24, 24, 27, 0.6)',
            },
            fontFamily: {
                outfit: ['Outfit', 'sans-serif'],
            },
            animation: {
                'shimmer': 'shimmer 2s linear infinite',
                'spin-slow': 'spin 3s linear infinite',
            },
            keyframes: {
                shimmer: {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(100%)' },
                }
            }
        },
    },
    plugins: [],
}
