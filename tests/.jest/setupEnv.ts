/// Environment variable override for tests
process.env.NODE_ENV = 'test';

process.env.SERVER_PORT = '4444';

process.env.AUTH_SECRET = 'TESTSECRET';

process.env.AUTH_SESSION_NAME = 'JEST-SESSION';

process.env.AUTH_TOKEN_TIMEOUT = '10m';

/// Test specific environment variables
export const testConfig = {
    inMemoryServer: true,
    IP: '127.0.0.1',
    port: process.env.SERVER_PORT,
    dbName: 'INMEMDB'
};
