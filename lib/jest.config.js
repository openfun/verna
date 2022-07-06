module.exports = {
  coverageDirectory: '.coverage',
  moduleDirectories: ['<rootDir>/src', 'node_modules'],
  moduleFileExtensions: ['js', 'ts', 'tsx'],
  resolver: '<rootDir>/jest/resolver.js',
  setupFilesAfterEnv: ['<rootDir>/jest/setup.js'],
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/src/**/*.spec.+(ts|tsx)'],
};
