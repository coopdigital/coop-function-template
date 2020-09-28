module.exports = {
  roots: ['<rootDir>'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverageFrom: [
    '**/*.{ts,tsx}',
    '!**/node_modules/**',
    '!**/vendor/**',
    '!testing/**',
  ],
  coverageDirectory: 'testing/coverage',
  coverageReporters: ['cobertura', 'lcov', 'text'],
  reporters: ['default', 'jest-junit'],
  testEnvironment: 'node',
  testTimeout: 30000,
};
