import { Router } from 'express';

const testRouter = Router();

// call `curl localhost:8080/test` or simply put URL in broswer.
testRouter.get('/', (req, res) => {
    return res.json('This is a test GET payload');
});

// call `curl -X POST localhost:8080/test`
testRouter.post('/', (req, res) => {
    return res.json('This is a test POST payload');
});

// call `curl -X PUT localhost:8080/test`
testRouter.put('/', (req, res) => {
    return res.json('This is a test PUT payload');
});

// call `curl -X DELETE localhost:8080/test`
testRouter.delete('/', (req, res) => {
    return res.json('This is a test DELETE payload');
});

export default testRouter;