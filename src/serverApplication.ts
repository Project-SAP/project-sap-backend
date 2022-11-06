import { attachControllers } from '@decorators/express';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express } from 'express';
import { connect } from 'mongoose';
import passport from 'passport';
import { AuthController } from './controller/auth.controller';
import { createServer, Server as HTTPServer } from "http";
import { ClientToServerEvents, ServerToClientEvents, QueueRequestData, Message } from "./models/events.model";
import { Server as SocketServer } from 'socket.io';

/**
 * Keeps track of application lifecycle and maintains a testable server context.
 *
 * Not all fields or methods should be exposed as the application context. If a field is not marked as `private`, document the reason.
 */
export class ServerApplication {
    private readonly applicationServerContext: HTTPServer;

    private readonly port: string;

    constructor() {
        // Load environment variables
        dotenv.config({ path: `${__dirname}/../config/.env` });
        this.port = process.env.SERVER_PORT;

        const expressApp: Express = this.serverInit((app: Express) => {
            // Bind controllers to application
            attachControllers(app, [AuthController]);
        });

        this.applicationServerContext = createServer(expressApp);

        this.socketServerInit(this.applicationServerContext);

        this.applicationServerContext.listen(this.port, async () => {
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

    /**
     * Initializes socket server with specified routes and route handlers
     * @param httpServer HTTP server where socket server will be attached
     * @returns Socket Server
     */
     private socketServerInit(httpServer: HTTPServer): SocketServer {
        const FRONTEND_URL = process.env.FRONTEND_URL;

        const io = new SocketServer<ClientToServerEvents, ServerToClientEvents>(httpServer, {
            cors: { origin: FRONTEND_URL }
        });

        // Setup and configure socket routes and events
        io.on("connection", (socket) => {

            // tslint:disable-next-line:no-console
            console.log("Socket Connected");

            socket.on("joinQueue", (data: QueueRequestData) => {
                // tslint:disable-next-line:no-console
                console.log(`Socket ${data.name} Joined Queue`);
            });

            socket.on("leaveQueue", (data: QueueRequestData) => {
                // tslint:disable-next-line:no-console
                console.log(`Socket ${data.name} Left Queue`);
            });

            socket.on("message", (data: Message) => {
                // tslint:disable-next-line:no-console
                console.log(`Socket ${data.sender} said ${data.message}`);
            });

            socket.on("disconnect", () => {
                // tslint:disable-next-line:no-console
                console.log("Socket Disconnected");
            });
        });

        return io;
    }

    private initPassportSession(app: Express) {
        // Configure passport for authetnciation
        app.use(passport.initialize());
    }
}
