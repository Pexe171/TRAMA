module.exports = {
  preset: 'jest-expo',
  clearMocks: true,
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testMatch: ['<rootDir>/src/**/*.test.ts?(x)'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/build/'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|@react-navigation|expo(nent)?|@expo|@unimodules|unimodules|sentry-expo|@sentry|native-base)'
  ],
  moduleNameMapper: {
    '^app/(.*)$': '<rootDir>/src/app/$1',
    '^features/(.*)$': '<rootDir>/src/features/$1',
    '^core/(.*)$': '<rootDir>/src/core/$1',
    '^services/(.*)$': '<rootDir>/src/services/$1'
  },
  modulePaths: ['<rootDir>/src'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
};
