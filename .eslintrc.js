module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: ['airbnb', 'prettier', 'prettier/react', 'plugin:import/typescript', 'plugin:jest/recommended'],
  // Setting @src as alias for ./src folder, so no ../../../../../ is needed anymore
  // has to be done in next.config.js and tsconfig.json and .babelrc.js as well
  settings: {
    'import/resolver': {
      alias: {
        map: [['@src', './src']],
        extensions: ['.ts', '.js', '.jsx', '.tsx'],
      },
    },
  },
  globals: {
    React: 'writable',
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
  plugins: ['react', '@typescript-eslint', 'prettier', 'jest'],
  rules: {
    'no-console': 'warn',
    'no-param-reassign': 'off',
    'no-underscore-dangle': 'off',
    'no-unused-vars': 'off', // https://github.com/typescript-eslint/typescript-eslint/issues/363
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: 'lodash',
            message: "Please include lodash functions individually using import abc from 'lodash/abc';",
          },
        ],
      },
    ],
    'max-classes-per-file': 'off',
    'class-methods-use-this': 'off',
    'object-curly-spacing': 1,
    'prefer-promise-reject-errors': 'off',
    'react/prefer-stateless-function': 'off',
    'react/prop-types': 'off',
    'react/no-danger': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/static-property-placement': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-filename-extension': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    'jsx-a11y/html-has-lang': 'off',
    'import/no-extraneous-dependencies': 1,
    'import/extensions': 'off',
  },
};
