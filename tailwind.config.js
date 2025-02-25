/** @type {import('tailwindcss').Config} */
module.exports = {
    // NOTE: Update this to include the paths to all of your component files.
    content: [
        "./app/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}",
    ],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            fontFamily: {
                lexend: ["Lexend_400Regular"],
                lexendLight: ["Lexend_300Light"],
                lexendMedium: ["Lexend_500Medium"],
                lexendSemiBold: ["Lexend_600SemiBold"],
                lexendBold: ["Lexend_700Bold"],
            },
        },
        colors: {
            primary: "#0075B2",
            secondary: "#5FA7C6",
            accent: "#E5F7FF",
            gray: {
                900: "#2B2B2B",
                800: "#606060",
                700: "#8F8F8F",
                600: "#D9D9D9",
            },
            bgBorder: {
                1: "#F8F8F8",
                2: "#EEEEEE",
            },
            system: {
                red: "#FD7474",
                "red-1": "#FFE0E0",
                yellow: "#E5F7FF",
                "yellow-1": "#FFF3E0",
                green: "#5FA7C6",
                "green-1": "#D1F2E4",
            },
            white: "#FFFFFF",
        },
    },
    plugins: [],
};
