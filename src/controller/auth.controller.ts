import { Controller, Post } from '@decorators/express';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';
import jwt, { Secret } from 'jsonwebtoken';
import passport from 'passport';
import { Strategy } from 'passport-local';
import { buildApiErrorResponse } from '../utils/errors/apiResponse.error';
import { UserService } from './../service/user.service';

/**
 * Controller for handling both authorization and authentication
 */
@Controller('/auth')
export class AuthController {
    /**
     *  Setup strategy for authentication of other endpoints once user has been signed in and given an auth token
     */
    constructor() {
        const strategyConfig = {
            usernameField: 'email',
            passwordField: 'password',
        };
        passport.use(
            'local',
            new Strategy(strategyConfig, this.validateLoginRequest)
        );
    }

    private userService = new UserService();

    /**
     * Log a user into application given an email and password
     */
    @Post('/login')
    public async userLogin(
        request: Request,
        response: Response,
        next: any
    ): Promise<Response | void> {
        passport.authenticate(
            'local',
            { session: false },
            (authError, user, info) => {
                if (authError || !user) {
                    return buildApiErrorResponse(
                        response,
                        StatusCodes.UNAUTHORIZED,
                        new Error('Login failed')
                    );
                }

                request.login(user, { session: false }, (loginError) => {
                    if (loginError) {
                        return buildApiErrorResponse(
                            response,
                            StatusCodes.UNAUTHORIZED,
                            new Error('Login failed')
                        );
                    }
                    // Login request is valid. Generate token and return to user
                    return response.json({
                        email: user.email,
                        userName: user.userName,
                        token: this.generateToken({ email: user.email }),
                    });
                });
            }
        )(request, response, next);
    }

    /**
     * Generate a JWToken given a body of JSON data. Uses the secret for hashing.
     * @param body
     * @returns
     */
    private generateToken(body: any): Secret {
        return jwt.sign(body, process.env.AUTH_SECRET, {
            expiresIn: process.env.AUTH_TOKEN_TIMEOUT,
        });
    }

    /**
     *
     * @param username email in this case
     * @param password
     * @param done
     * @returns
     */
    private validateLoginRequest(
        username: string,
        password: string,
        done: any
    ) {
        // Await on user for validation
        const userService = new UserService();
        return userService
            .findByEmail(username)
            .then((foundUser) => {
                // Validate response from database
                if (!foundUser) {
                    return done(new Error('Invalid credentials'));
                }

                // Validate login
                if (!bcrypt.compareSync(password, foundUser.password)) {
                    return done(new Error('Invalid credentials'));
                }

                return done(null, foundUser, {
                    message: 'Logged in successfully',
                });
            })
            .catch((error) => done(error));
    }
}
