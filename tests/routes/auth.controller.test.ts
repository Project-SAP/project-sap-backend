import { attachControllers } from '@decorators/express';
import { Express } from 'express';
import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';
import request from 'supertest';
import { AuthController } from '../../src/controller/auth.controller';
import { serverInit } from '../../src/utils/server.utils';
import { UserInMemoryData } from './../inMemoryData/user.testDb';

describe('AuthorizationController', () => {
    const controllerPath = '/auth';

    const userInMemoryData = new UserInMemoryData();

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
                    // Load mock user into in memory database
                    await userInMemoryData.newPersistant({
                        email: testEmail,
                        password: testPassword,
                        active: true,
                        creationDate: new Date(),
                    });

                    const loginRequest = { email, password };

                    const response = await request(testContext)
                        .post(`${controllerPath}${loginPath}`)
                        .send(loginRequest);

                    expect(response.statusCode).toEqual(expectedStatus);
                });
            }
        );

        it('should return back an authroization token with user data to the client', async () => {
            // Load mock user into in memory database
            await userInMemoryData.newPersistant({
                email: testEmail,
                password: testPassword,
                userName: 'testUser',
                active: true,
                creationDate: new Date(),
            });

            const loginRequest = {
                email: testEmail,
                password: testPassword,
            };

            const response = await request(testContext)
                .post(`${controllerPath}${loginPath}`)
                .send(loginRequest);

            expect(response.statusCode).toEqual(StatusCodes.OK);
            expect(response.body.token).toBeTruthy();
            expect(response.body.email).toBeTruthy();
            expect(response.body.userName).toBeTruthy();
        });

        it('should return a 404 if user does not exists in the database', async () => {
            const loginRequest = {
                email: testEmail,
                password: testPassword,
            };

            const response = await request(testContext)
                .post(`${controllerPath}${loginPath}`)
                .send(loginRequest);

            expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
        });

        it('should return a 400 if the passwords to not match', async () => {
            // Load mock user into in memory database
            await userInMemoryData.newPersistant({
                email: testEmail,
                password: testPassword,
                active: true,
                creationDate: new Date(),
            });

            const loginRequest = {
                email: testEmail,
                password: 'mismatchingPassword',
            };

            const response = await request(testContext)
                .post(`${controllerPath}${loginPath}`)
                .send(loginRequest);

            expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        });
    });
});
