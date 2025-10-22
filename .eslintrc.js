module.exports = {
  root: true,
  env: {
    es2021: true,
    'react-native/react-native': true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react-native/all',
    'prettier'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['react', '@typescript-eslint', 'react-native'],
  settings: {
    react: {
      version: 'detect'
    }
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react-native/no-inline-styles': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off'
  },
  overrides: [
    {
      files: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
      env: {
        jest: true
      }
    }
  ]
};
