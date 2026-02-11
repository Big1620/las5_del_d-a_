/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'node',
  preset: 'ts-jest',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testMatch: ['**/__tests__/**/*.test.ts', '**/__tests__/**/*.test.tsx'],
  collectCoverageFrom: ['lib/**/*.ts', 'app/api/**/*.ts'],
  coveragePathIgnorePatterns: ['/node_modules/', '\\.d\\.ts$'],
};

module.exports = config;
