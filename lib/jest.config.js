export default {
  coverageDirectory: '.coverage',
  moduleDirectories: ['<rootDir>/src', 'node_modules'],
  moduleFileExtensions: ['js', 'ts', 'tsx'],
  moduleNameMapper: {
    // Map aliases defined in tsconfig.json to the absolute path of the module
    '^:/(.*)$': '<rootDir>/src/$1',
  },
  resolver: '<rootDir>/jest/resolver.cjs',
  setupFilesAfterEnv: ['<rootDir>/jest/setup.js'],
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/src/**/*.spec.+(ts|tsx)'],
};
