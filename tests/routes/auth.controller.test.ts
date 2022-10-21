import { Express } from 'express';
import { serverInit } from '../../src/utils/server.utils';
import { attachControllers } from '@decorators/express';
import { AuthController } from '../../src/controller/auth.controller';
import { LoginModel } from './../../src/models/login.model';
import request from 'supertest';

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
            ${null}      | ${null}         | ${500}
            ${testEmail} | ${null}         | ${500}
            ${null}      | ${testPassword} | ${500}
            ${testEmail} | ${testPassword} | ${200}
        `(
            'when validating login request',
            ({ email, password, expectedStatus }) => {
                it(`should return a ${expectedStatus}${
                    email ? '' : ' without an email'
                }${password ? '' : ' without a password'}`, async () => {
                    const loginRequest: LoginModel = { email, password };

                    const response = await request(testContext)
                        .post(`${controllerPath}${loginPath}`)
                        .send(loginRequest);

                    expect(response.statusCode).toEqual(expectedStatus);
                });
            }
        );

        it('should return back an authroization token to the client', async () => {
            const loginRequest: LoginModel = {
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
