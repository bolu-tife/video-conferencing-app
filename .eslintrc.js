module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],

  extends: ['plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'],
  rules: {
    "@typescript-eslint/ban-ts-ignore": "off"
  }
};