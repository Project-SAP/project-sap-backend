/** @type {import('ts-jest/dist/types').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ["**/**/*.test.ts"],
    verbose: true,
    forceExit: true,
    coveragePathIgnorePatterns: [
        '/node_modules/'
    ],
    globalSetup: './tests/.jest/setupInMemoryDatabase.ts',
    globalTeardown: './tests/.jest/teardownInMemoryDatabase.ts',
    setupFiles: ['./tests/.jest/setupEnv.ts'],
    setupFilesAfterEnv: ['./tests/.jest/jest.setup.ts'],
    testTimeout: 10000,
};