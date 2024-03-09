// tailwind.config.js


module.exports = {
  content: ['./public/**/*.html', './src/**/*.{vue,js,ts,jsx,tsx}','./node_modules/flowbite/**/*.js'],
  theme: {
    extend: {
      colors: {
        'app-purple':'#663399',
        'app-blue':'#0066cc',
      }
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}
