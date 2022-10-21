import { Controller, Post } from '@decorators/express';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';
import { User } from './../models/user.model';

/**
 * Controller for handling both authorization and authentication
 */
@Controller('/auth')
export class AuthController {
    /**
     * Log a user into application given an email and password
     */
    @Post('/login')
    public userLogin(request: Request, response: Response) {
        const login: User = request.body;
        let errorList: Error[];

        if (!login.email) {
            errorList.push(new Error('No email given'));
        }

        if (!login.password) {
            errorList.push(new Error('No password given'));
        }

        // TODO: Look for more potential error cases
        if (errorList.length > 0) {
            response.status(StatusCodes.BAD_REQUEST).send(errorList);
        }

        // Validate login

        // Generate token and return to user
    }
}
