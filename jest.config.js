const path = require('path');

module.exports = {
  coverageDirectory: '.coverage',
  moduleDirectories: [path.resolve(__dirname, 'src'), 'node_modules'],
  moduleFileExtensions: ['js', 'ts', 'tsx'],
  setupFilesAfterEnv: [path.resolve(__dirname, 'jest.setup.js')],
  testEnvironment: 'jsdom',
  testMatch: [path.resolve(__dirname, 'src/**/*.spec.+(ts|tsx)')],
  transformIgnorePatterns: ['node_modules/(?!(nanoid)/)'],
};
