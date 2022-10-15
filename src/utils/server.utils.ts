import express, { Express } from 'express';
import cors from 'cors';

/**
 * Delegate function to configure required application context, as well as additional user defined configuration.
 * @param configure Callback to configure routes. Useful for testing specific routes.
 * @returns application context of type `core.Express`
 */
export function serverInit(configure: (express: Express) => void): Express {
    const app: Express = express();
    app.use(cors());
    app.use(express.json());

    // User defined configuration
    configure(app);

    return app;
}
