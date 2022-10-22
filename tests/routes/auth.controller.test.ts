import { attachControllers } from '@decorators/express';
import { Express } from 'express';
import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';
import request from 'supertest';
import { AuthController } from '../../src/controller/auth.controller';
import User from '../../src/models/user.model';
import { serverInit } from '../../src/utils/server.utils';

describe('AuthorizationController', () => {
    const controllerPath = '/auth';

    const testContext: Express = serverInit((app) => {
        attachControllers(app, [AuthController]);
    });

    it('should configure', () => {
        expect(testContext).toBeTruthy();
    });

    describe('/login', () => {
        const loginPath = '/login';

        // Mock request data
        const testEmail = 'some.email@gmail.com';
        const testPassword = 'aa00';

        describe.each`
            email        | password        | expectedStatus
            ${null}      | ${null}         | ${StatusCodes.BAD_REQUEST}
            ${testEmail} | ${null}         | ${StatusCodes.BAD_REQUEST}
            ${null}      | ${testPassword} | ${StatusCodes.BAD_REQUEST}
            ${testEmail} | ${testPassword} | ${StatusCodes.OK}
        `(
            'when validating login request',
            ({ email, password, expectedStatus }) => {
                it(`should return a ${expectedStatus}${
                    email ? '' : ' without an email'
                }${password ? '' : ' without a password'}`, async () => {
                    const loginRequest: User = { email, password };

                    const response = await request(testContext)
                        .post(`${controllerPath}${loginPath}`)
                        .send(loginRequest);

                    expect(response.statusCode).toEqual(expectedStatus);
                });
            }
        );

        it('should return back an authroization token to the client', async () => {
            const loginRequest: User = {
                email: testEmail,
                password: testPassword,
            };

            const response = await request(testContext)
                .post(`${controllerPath}${loginPath}`)
                .send(loginRequest);

            expect(response.statusCode).toEqual(200);
        });
    });
});
