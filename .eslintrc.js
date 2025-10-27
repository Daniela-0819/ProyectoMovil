module.exports = {
  root: true,
  extends: [
    '@react-native-community',
    'plugin:react/recommended',
    'plugin:react-native/all',
    'prettier'
  ],
  plugins: ['react', 'react-native', 'prettier'],
  env: {
    node: true,
    'react-native/react-native': true,
  },
  rules: {
    'prettier/prettier': 'error',

    'react-native/no-inline-styles': 'warn',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
  },
  settings: { react: { version: 'detect' } },
};