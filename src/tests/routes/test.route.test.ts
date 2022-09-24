import testRouter from '../../main/routes/test.routes';
import { serverInit } from '../../main/utils/serverInit';
import request from 'supertest';

/**
 * Example integration routing testing
 */
describe('test', () => {
    const testRoutePath = '/test';

    const testContext = serverInit((app) => {
        app.use(testRoutePath, testRouter);
    });

    it('should configure', () => {
        expect(testContext).toBeTruthy();
    });

    describe('GET route', () => {
        it('should return a 200', async () => {
            const response = await request(testContext).get(testRoutePath);
            expect(response.statusCode).toEqual(200);
            expect(response.body).toEqual('This is a test GET payload');
        });
    });

    describe('POST route', () => {
        it('should return a 200', async () => {
            const response = await request(testContext).post(testRoutePath);
            expect(response.statusCode).toEqual(200);
            expect(response.body).toEqual('This is a test POST payload');

        });
    });

    describe('PUT route', () => {
        it('should return a 200', async () => {
            const response = await request(testContext).put(testRoutePath);
            expect(response.statusCode).toEqual(200);
            expect(response.body).toEqual('This is a test PUT payload');
        });
    });

    describe('DELETE route', () => {
        it('should return a 200', async () => {
            const response = await request(testContext).delete(testRoutePath);
            expect(response.statusCode).toEqual(200);
            expect(response.body).toEqual('This is a test DELETE payload');
        });
    });
});
