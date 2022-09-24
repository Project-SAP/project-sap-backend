import { Router } from 'express';

const testRouter = Router();

// call `curl localhost:8080/test` or simply put URL in broswer.
testRouter.get("/test", (req, res) => {
    return res.send("This is a test GET payload");
});

// call `curl -X POST localhost:8080/test`
testRouter.post("/test", (req, res) => {
    return res.send("This is a test POST payload");
});

// call `curl -X PUT localhost:8080/test`
testRouter.put("/test", (req, res) => {
    return res.send("This is a test PUT payload");
});

// call `curl -X DELETE localhost:8080/test`
testRouter.delete("/test", (req, res) => {
    return res.send("This is a test DELETE payload");
});

export default testRouter;