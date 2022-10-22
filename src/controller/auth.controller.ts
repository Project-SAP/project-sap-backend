import { Controller, Post } from '@decorators/express';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';
import jwt, { Secret } from 'jsonwebtoken';
import passport from 'passport';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { UserRepository } from './../models/schemas/user.schema';
import { User, UserModel } from './../models/user.model';

/**
 * Controller for handling both authorization and authentication
 */
@Controller('/auth')
export class AuthController {
    constructor() {
        const strategyConfig = {
            secretOrKey: process.env.AUTH_SECRET,
            issuer: 'catSafe.admin.com',
            audience: 'catSafe.com',
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        };
        // console.log(strategyConfig);
        passport.use('login', new Strategy(strategyConfig, this.authenticate));
    }

    /**
     * Log a user into application given an email and password
     */
    @Post('/login')
    public async userLogin(request: Request, response: Response, next: any) {
        const loginRequest: User = request.body;

        // Validate request
        if (!loginRequest.email) {
            return this.buildApiErrorResponse(
                response,
                StatusCodes.BAD_REQUEST,
                new Error('No email given')
            );
        }

        if (!loginRequest.password) {
            return this.buildApiErrorResponse(
                response,
                StatusCodes.BAD_REQUEST,
                new Error('No password given')
            );
        }

        const returnedVal = await UserRepository.findOne({
            email: loginRequest.email,
        })
            .then((user: User) => {
                // Was user found?
                if (!user) {
                    return this.buildApiErrorResponse(
                        response,
                        StatusCodes.NOT_FOUND,
                        new Error('User not found')
                    );
                } else {
                    // Validate login
                    if (!this.isValidPassword(user, loginRequest.password)) {
                        return this.buildApiErrorResponse(
                            response,
                            StatusCodes.BAD_REQUEST,
                            new Error('Incorrect password')
                        );
                    }
                }
            })
            .catch((error: Error) => {
                return this.buildApiErrorResponse(
                    response,
                    StatusCodes.INTERNAL_SERVER_ERROR,
                    error
                );
            });

        // Login request is valid. Generate token and return to user
        return response.json({
            token: this.generateToken({ email: loginRequest.email }),
        });
    }

    private authenticate(jwtPaylod: any, done: VerifiedCallback) {
        UserRepository.findOne(
            { email: jwtPaylod.email },
            (error: Error, user: UserModel) => {
                let returnedError: Error;
                let returnedUser: any = false;

                if (error) {
                    returnedError = error;
                }

                if (user) {
                    returnedUser = user;
                }

                return done(returnedError, returnedUser);
            }
        );
    }

    /**
     * Validate a given password with it the related database password
     * @param password login request password that needs validated
     */
    private isValidPassword(user: User, password: string) {
        const compare = bcrypt.compareSync(password, user.password);

        return compare;
    }

    /**
     * Generate a JWToken given a body of JSON data. Uses the secret for hashing.
     * @param body
     * @returns
     */
    private generateToken(body: any): Secret {
        return jwt.sign(body, process.env.AUTH_SECRET);
    }

    private buildApiErrorResponse(
        response: Response,
        statuscode: StatusCodes,
        error: Error
    ) {
        response
            .status(statuscode)
            .json({ error: { name: error.name, message: error.message } })
            .end();
    }
}
