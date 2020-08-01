module.exports = {
  preset: "@vue/cli-plugin-unit-jest",
  testMatch: [
    "**/tests/unit/**/*.spec.[jt]s?(x)",
    "**/__tests__/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[jt]s?(x)",
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    "**/*.{vue,}",
    "!**/node_modules/**",
    "!<rootDir>/dist/**",
    "!<rootDir>/src/plugins/**",
    "!<rootDir>/tests/unit/**",
  ],
  coverageReporters: ["lcov", "text-summary"],
};
