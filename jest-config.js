const TEST_REGEX = "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|js?|tsx?|ts?)$";

module.exports = {
  collectCoverageFrom: [
    "<rootDir>/src/**/*.{ts,tsx,js,jsx}",
    "!**/node_modules/**",
    "!<rootDir>/src/pages/examples/**",
    "!<rootDir>/**/mocks/**",
    "!<rootDir>/src/pages/_document.tsx",
    "!<rootDir>/src/pages/_error.tsx"
  ],
  setupFiles: ["<rootDir>/jest-setup.js"],
  testRegex: TEST_REGEX,
  transform: {
    "^.+\\.tsx?$": "babel-jest",
  },
  testEnvironment: 'jest-environment-jsdom-fourteen',
  testPathIgnorePatterns: ["<rootDir>/build/", "<rootDir>/.next/", "<rootDir>/node_modules/", "<rootDir>/src/pages/examples/"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  coverageReporters: ["json", "lcov", "text", "clover", "text-summary"],
  setupFilesAfterEnv: ["<rootDir>/jest-setup.js"],
};
