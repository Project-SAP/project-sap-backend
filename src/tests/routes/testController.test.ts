import { Express, Request, Response } from 'express';
import { serverInit } from '../../main/utils/serverInit';
import request from 'supertest';
import { TestController } from './../../main/controller/testController';

/**
 * Example integration routing testing
 */
describe('TestController', () => {
    const controller = new TestController();

    const testContext: Express = serverInit((app) => {
        app.use(controller.getBasePath(), controller.getRouter());
    });

    it('should configure', () => {
        expect(testContext).toBeTruthy();
    });

    describe('GET route', () => {
        it('should return a 200', async () => {
            const response = await request(testContext).get(controller.getBasePath());
            expect(response.statusCode).toEqual(200);
            expect(response.body).toEqual('This is a test GET payload');
        });
    });

    describe('POST route', () => {
        it('should return a 200', async () => {
            const response = await request(testContext).post(controller.getBasePath());
            expect(response.statusCode).toEqual(200);
            expect(response.body).toEqual('This is a test POST payload');

        });
    });

    describe('PUT route', () => {
        it('should return a 200', async () => {
            const response = await request(testContext).put(controller.getBasePath());
            expect(response.statusCode).toEqual(200);
            expect(response.body).toEqual('This is a test PUT payload');
        });
    });

    describe('DELETE route', () => {
        it('should return a 200', async () => {
            const response = await request(testContext).delete(controller.getBasePath());
            expect(response.statusCode).toEqual(200);
            expect(response.body).toEqual('This is a test DELETE payload');
        });
    });
});
