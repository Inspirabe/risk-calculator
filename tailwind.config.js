/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,ts}",
        "./node_modules/@ionic/angular/**/*.mjs"
    ],
    darkMode: 'class',
    theme: {
        extend: {
            // Optioneel: koppel Tailwind-kleuren aan Ionic CSS vars
            colors: {
                primary: "var(--ion-color-primary)",
                "primary-contrast": "var(--ion-color-primary-contrast)",
                secondary: "var(--ion-color-secondary)",
                muted: "var(--ion-color-medium)"
            },
        },
    },
    plugins: [],
}
