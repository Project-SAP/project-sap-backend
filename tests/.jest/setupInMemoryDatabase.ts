import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { testConfig } from './setupEnv';

let inMemoryServerInstance: MongoMemoryServer;

export default async function globalSetup() {
    if (testConfig.inMemoryServer) {
        // Config to decided if an mongodb-memory-server instance should be used
        // it's needed in global space, because we don't want to create a new instance every test-suite
        inMemoryServerInstance = await MongoMemoryServer.create();
        const uri = inMemoryServerInstance.getUri();
        (global as any).__MONGOINSTANCE = inMemoryServerInstance;
        process.env.MONGODB_URI = uri.slice(0, uri.lastIndexOf('/'));
    } else {
        process.env.MONGODB_URI = `mongodb://${testConfig.IP}:${testConfig.port}`;
    }

    // The following is to make sure the database is clean before an test starts
    await mongoose.connect(`${process.env.MONGODB_URI}`);
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
}
