module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'airbnb', 'prettier', 'prettier/react', 'plugin:import/typescript', 'plugin:jest/recommended'
  ],
  globals: {
    React: "writable",
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'react',
    '@typescript-eslint',
    'only-warn',
    'prettier',
    'jest'
  ],
  rules: {
    'no-console': 'warn',
    'no-param-reassign': 'off',
    'no-underscore-dangle': 'off',
    'no-unused-vars': 'off', // https://github.com/typescript-eslint/typescript-eslint/issues/363
    'max-classes-per-file': 'off',
    'import/no-extraneous-dependencies': 'off',
    'class-methods-use-this': 'off',
    'prefer-promise-reject-errors': 'off',
    'react/prop-types': 'off',
    'react/no-danger': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/static-property-placement': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-filename-extension': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    'jsx-a11y/html-has-lang': 'off'
  },
};
