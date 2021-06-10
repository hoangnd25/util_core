const tsJestUtils = require('ts-jest/utils');
const tsConfigFile = require('./tsconfig.json');

const tsConfig = {
  ...tsConfigFile.compilerOptions,
  jsx: 'react',
};
const TEST_REGEX = "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|js?|tsx?|ts?)$";


module.exports = {
  transform: {
    '^.+\\.tsx?$': 'babel-jest',
  },
  moduleNameMapper: tsJestUtils.pathsToModuleNameMapper(
    tsConfigFile.compilerOptions.paths, { prefix: '<rootDir>/' },
  ),
  globals: {
    'babel-jest': { tsConfig },
  },

  collectCoverageFrom: [
    "<rootDir>/src/**/*.{ts,tsx,js,jsx}",
    "!**/node_modules/**",
    "!<rootDir>/**/mocks/**",
    "!<rootDir>/src/pages/_document.tsx",
    "!<rootDir>/src/pages/_error.tsx"
  ],
  setupFilesAfterEnv: ["<rootDir>/jest-setup.js", "jest-localstorage-mock"],
  testRegex: TEST_REGEX,
  testEnvironment: 'jest-environment-jsdom-fourteen',
  testPathIgnorePatterns: ["<rootDir>/build/", "<rootDir>/.next/", "<rootDir>/node_modules/", "<rootDir>/src/locale/"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  coverageReporters: ["json", "lcov", "text", "clover", "text-summary"],
};
