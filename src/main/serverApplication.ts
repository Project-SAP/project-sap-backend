import { Express } from 'express';
import dotenv from 'dotenv';
import { serverInit } from './utils/serverInit';
import testRouter from './routes/test.routes';

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

        this.context = serverInit((app) => {
            // Routes
            app.use('/test', testRouter);
        });

        this.context.listen(this.port, async () => {
            // TODO: Replace with mongoDB connection
            // tslint:disable-next-line:no-console
            console.log(`started server at http://localhost:${this.port}`);
        });
    }
}