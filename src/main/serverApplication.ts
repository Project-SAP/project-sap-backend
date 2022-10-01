import { Express } from 'express';
import dotenv from 'dotenv';
import { serverInit } from './utils/serverInit';
import { TestController } from './controller/testController';

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

        this.context = serverInit((app: Express) => {
            const testController = new TestController();

            app.use(testController.getBasePath(), testController.getRouter());
        });

        this.context.listen(this.port, async () => {
            // TODO: Replace with mongoDB connection configuration
            // tslint:disable-next-line:no-console
            console.log(`started server at http://localhost:${this.port}`);
        });
    }
}
