import { nextui } from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */
export const content = [
  './src/**/*.{html,js,jsx,ts,tsx}',
  "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
];
export const theme = {
  extend: {},
};
export const darkMode = "class";
export const plugins = [nextui({
  themes: {
    light: {
      colors: {
        primary: {
          DEFAULT: '#1E1E1E',
        },
        sidebar: {
          DEFAULT: '#F9F9F9'
        },
        card: {
          DEFAULT: '#F2F5F8'
        }
      },
    },
    dark: {
      colors: {},
    },
  },
})];