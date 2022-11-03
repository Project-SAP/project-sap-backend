import { Controller, Post } from '@decorators/express';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { STATUS_CODES } from 'http';
import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';
import jwt, { Secret } from 'jsonwebtoken';
import { Db } from 'mongodb';
import passport from 'passport';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { buildApiErrorResponse } from '../utils/errors/apiResponse.error';
import { User } from './../models/user.model';
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
            secretOrKey: process.env.AUTH_SECRET,
            issuer: 'catSafe.admin.com',
            audience: 'catSafe.com',
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        };
        passport.use('login', new Strategy(strategyConfig, this.authenticate));
    }

    private userService = new UserService();

    @Post('/signup')
    public async userSignup(request: Request, response: Response, next: any) {
        const signupRequest: User = request.body;

        // Validate signup req
        if (!signupRequest.email) {
            return buildApiErrorResponse(
                response,
                StatusCodes.BAD_REQUEST,
                new Error('No email given')
            );
        }

        if (!signupRequest.password) {
            return buildApiErrorResponse(
                response,
                StatusCodes.BAD_REQUEST,
                new Error('No password')
            );
        }

        // Await on user for validation
        const user: User = await this.userService
            .findByEmail(signupRequest.email)
            .then((foundUser) => foundUser);

        if (user) {
            return buildApiErrorResponse(
                response,
                StatusCodes.BAD_REQUEST,
                new Error('Email already associated with another user')
            );
        }

        if (user) {
            // Validate login
            if (!this.isValidPassword(user, signupRequest.password)) {
                return buildApiErrorResponse(
                    response,
                    StatusCodes.BAD_REQUEST,
                    new Error('Invalid credentials')
                );
            }
        }

        this.userService.newUser(signupRequest.email, signupRequest.password);
    }

    /**
     * Log a user into application given an email and password
     */
    @Post('/login')
    public async userLogin(request: Request, response: Response, next: any) {
        const loginRequest: User = request.body;

        // Validate request
        if (!loginRequest.email) {
            return buildApiErrorResponse(
                response,
                StatusCodes.BAD_REQUEST,
                new Error('No email given')
            );
        }

        if (!loginRequest.password) {
            return buildApiErrorResponse(
                response,
                StatusCodes.BAD_REQUEST,
                new Error('No password given')
            );
        }

        // Await on user for validation
        const user: User = await this.userService
            .findByEmail(loginRequest.email)
            .then((foundUser) => foundUser);

        // Validate response from database
        if (!user) {
            return buildApiErrorResponse(
                response,
                StatusCodes.NOT_FOUND,
                new Error('Invalid credentials')
            );
        }

        if (user) {
            // Validate login
            if (!this.isValidPassword(user, loginRequest.password)) {
                return buildApiErrorResponse(
                    response,
                    StatusCodes.BAD_REQUEST,
                    new Error('Invalid credentials')
                );
            }
        }

        // Login request is valid. Generate token and return to user
        return response.json({
            token: this.generateToken({ email: user.email }),
        });
    }

    private async authenticate(jwtPaylod: any, done: VerifiedCallback) {
        await this.userService
            .findByEmail(jwtPaylod.email)
            .then((foundUser) => {
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

    /**
     * Validate a given password with it the related database password
     * @param password login request password that needs validated
     */
    private isValidPassword(user: User, password: string): boolean {
        const compare = bcrypt.compareSync(password, user.password);

        return compare;
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
}
