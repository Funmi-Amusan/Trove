/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#059A83',
        'primary-light': '#E0F5E1',
        success: '#10AE17',
        negative: '#BF221C',
        'background-canvas': '#FBFBFB',
        'card-surface': '#FFFFFF',
        'page-background': '#F5F1EE',
        'background-default': '#F2F6F6',
        'text-default': '#13342F',
        'text-neutral': '#687D7A',
        'text-disabled': '#92A29F',
        border: '#DBDFDF',
        'accent-blue': '#00B6DF',
        purple: '#7B79C9',
        cream: '#F2C891',
        'dark-blue': '#00323D',
      },
    },
  },
  plugins: [],
}
