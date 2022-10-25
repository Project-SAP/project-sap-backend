import mongoose from 'mongoose';

/**
 * Standup in memory database connection before all tests run
 */
beforeAll(async () => {
    const uri = process.env.MONGODB_URI as string;
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.disconnect();
});

afterEach(async () => {
    // Drop all data between tests
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
        await collection.deleteMany({});
    }
});
