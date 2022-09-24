import express from "express";
import cors from "cors";
import testRouter from "./test.routes";

function startApplication() {
    const app = express();
    app.use(cors());
    app.use(express.json());

    // Routes
    app.use("/test", testRouter);

    return app;
}

export default startApplication;