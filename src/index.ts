import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";

///
/// Blank project template from: https://developer.okta.com/blog/2018/11/15/node-express-typescript
/// Might need to use a package such as CORS to address any cross-origin request issues.
///
dotenv.config();
const app: Express = express();
const port = process.env.SERVER_PORT;

app.use(cors());

// call `curl localhost:8080/test` or simply put URL in broswer.
app.get("/test", (req: Request, res: Response) => {
    return res.send("This is a test GET payload");
});

// call `curl -X POST localhost:8080/test`
app.post("/test", (req: Request, res: Response) => {
    return res.send("This is a test POST payload");
});

// call `curl -X PUT localhost:8080/test`
app.put("/test", (req: Request, res: Response) => {
    return res.send("This is a test PUT payload");
});

// call `curl -X DELETE localhost:8080/test`
app.delete("/test", (req: Request, res: Response) => {
    return res.send("This is a test DELETE payload");
});

// Start server
app.listen(port, () => {
    // TODO: Remove
    // tslint:disable-next-line:no-console
    console.log(`started server at http://localhost:${ port }`);
});
