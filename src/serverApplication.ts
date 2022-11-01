import { attachControllers } from '@decorators/express';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express } from 'express';
import { connect } from 'mongoose';
import passport from 'passport';
import { AuthController } from './controller/auth.controller';

/**
 * Keeps track of application lifecycle and maintains a testable server context.
 *
 * Not all fields or methods should be exposed as the application context. If a field is not marked as `private`, document the reason.
 */
export class ServerApplication {
    private readonly expressContext: Express;

    private readonly port: string;

    constructor() {
        // Load environment variables
        dotenv.config({ path: `${__dirname}/../config/.env` });
        this.port = process.env.SERVER_PORT;

        this.expressContext = this.serverInit((app: Express) => {
            // Bind controllers to application
            attachControllers(app, [AuthController]);
        });

        this.expressContext.listen(this.port, async () => {
            // TODO: Replace with mongoDB connection configuration
            // tslint:disable-next-line:no-console
            console.log(`started server at http://localhost:${this.port}`);
        });
    }

    /**
     * Not private since tests will be required to confiugre their own instance of a @type {serverApplication}
     * @param configure optional callback containing additional expressJs configuration
     * @returns expressJs context
     */
    serverInit(configure: (express: Express) => void): Express {
        const app: Express = express();
        app.use(cors());
        app.use(express.json());

        // User defined configuration
        configure(app);

        // Connect to the database
        connect(process.env.MONGODB_URI);

        this.initPassportSession(app);

        return app;
    }

    private initPassportSession(app: Express) {
        // Configure passport for authetnciation
        app.use(passport.initialize());
    }
}
