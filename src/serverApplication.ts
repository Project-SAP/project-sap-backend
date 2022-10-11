import express, { Express } from 'express';
import dotenv from 'dotenv';
import { attachControllers } from '@decorators/express';
import { TestController } from './controller/testController';
import cors from 'cors';

/**
 * Keeps track of application lifecycle and maintains a testable server context
 */
export class ServerApplication {
    readonly context: Express;

    readonly port: string;

    constructor() {
        // Load environment variables
        dotenv.config();
        this.port = process.env.SERVER_PORT;

        this.context = this.serverInit((app: Express) => {
            // Bind controllers to application
            attachControllers(app, [TestController]);
        });

        this.context.listen(this.port, async () => {
            // TODO: Replace with mongoDB connection configuration
            // tslint:disable-next-line:no-console
            console.log(`started server at http://localhost:${this.port}`);
        });
    }

    serverInit(configure: (express: Express) => void): Express {
        const app: Express = express();
        app.use(cors());
        app.use(express.json());

        // User defined configuration
        configure(app);

        return app;
    }
}
