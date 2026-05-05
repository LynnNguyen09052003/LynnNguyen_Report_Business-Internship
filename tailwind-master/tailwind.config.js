/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,js}", "./index.html"],
    theme: {
        extend: {
            fontFamily: {
                rubik: ['Rubik', 'sans-serif'],
                roboto: ['Roboto', 'sans-serif'],
            },
            screens: {
                md: "800px",
            },
        },
    },
    plugins: [],
}