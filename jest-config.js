const TEST_REGEX = "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|js?|tsx?|ts?)$";

module.exports = {
  collectCoverageFrom: [
    "<rootDir>/src/((((((**/)**/)**/)**/)**/)**/)*.{ts,tsx}",
    "!**/node_modules/**",
  ],
  setupFiles: ["<rootDir>/jest-setup.js"],
  testRegex: TEST_REGEX,
  transform: {
    "^.+\\.tsx?$": "babel-jest",
  },
  testPathIgnorePatterns: ["<rootDir>/build/", "<rootDir>/node_modules/"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  collectCoverage: true,
  coverageReporters: ["json", "lcov", "text", "clover", "text-summary"],
};
