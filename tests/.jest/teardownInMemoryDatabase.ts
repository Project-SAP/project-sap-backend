import { MongoMemoryServer } from 'mongodb-memory-server';
import { testConfig } from './setupEnv';

export default async function globalTeardown() {
    if (testConfig.inMemoryServer) {
        // Config to decided if an mongodb-memory-server instance should be used
        const instance: MongoMemoryServer = (global as any).__MONGOINSTANCE;
        await instance.stop();
    }
}
