import { Express } from 'express';
import { serverInit } from '../../src/utils/server.utils';
import { attachControllers } from '@decorators/express';
import { AuthController } from '../../src/controller/auth.controller';

describe('AuthorizationController', () => {
    const controllerPath = '/auth';

    const testContext: Express = serverInit((app) => {
        attachControllers(app, [AuthController]);
    });

    it('should configure', () => {
        expect(testContext).toBeTruthy();
    });
});
