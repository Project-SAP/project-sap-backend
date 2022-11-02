import { Middleware } from '@decorators/express';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import passport from 'passport';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { UserService } from './../../service/user.service';
import { buildApiErrorResponse } from './../../utils/errors/apiResponse.error';

export class AuthMiddleware implements Middleware {
    constructor() {
        const strategyConfig = {
            secretOrKey: process.env.AUTH_SECRET,
            issuer: 'catSafe.admin.com',
            audience: 'catSafe.com',
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        };
        passport.use(
            'jwt',
            new Strategy(strategyConfig, AuthMiddleware.authenticate)
        );
    }

    public use(request: Request, response: Response, next: any): void {
        const passRes = passport.authenticate('jwt', (error, user, info) => {
            if (error || !user) {
                return buildApiErrorResponse(
                    response,
                    StatusCodes.UNAUTHORIZED,
                    new Error('Unauthorized')
                );
            }
        });
        // tslint:disable-next-line:no-console
        console.log('Authenticated!');
        next();
    }

    /**
     *
     * @param jwtPaylod
     * @param done
     */
    static async authenticate(jwtPaylod: any, done: VerifiedCallback) {
        // Get a local instance of the user service
        const userService = new UserService();
        await userService.findByEmail(jwtPaylod.email).then((foundUser) => {
            let returnedError: Error;
            let returnedUser: any = false;

            if (foundUser) {
                returnedUser = foundUser;
            } else {
                returnedError = ApiError.build()
                    .setStatusCode(StatusCodes.BAD_REQUEST)
                    .setMessage('Failed to authenticate');
            }

            return done(returnedError, returnedUser);
        });
    }
}
