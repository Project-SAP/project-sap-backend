/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ["**/**/*.test.ts"],
    verbose: true,
    forceExit: true,
    coveragePathIgnorePatterns: [
        "/node_modules/"
    ]
    // clearMocks: true
};