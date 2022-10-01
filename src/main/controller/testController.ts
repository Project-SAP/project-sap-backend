import { Router, Request, Response } from 'express';
import DataModel from '../models/dataModel';

/**
 * Example router containing all the endpoints at a given URL.
 * TODO: Remove once proper endpoints are established.
 */
export class TestController {
    private router = Router();

    private basePath = '/test';

    constructor() {
        // call `curl localhost:8080/test` or simply put URL in broswer.
        this.router.get('/', (req: Request, res: Response) => {
            return res.json({
                message: 'This is a test GET payload',
            } as DataModel);
        });

        // call `curl -X POST localhost:8080/test`
        this.router.post('/', (req: Request, res: Response) => {
            return res.json({
                message: 'This is a test POST payload',
            } as DataModel);
        });

        // call `curl -X PUT localhost:8080/test`
        this.router.put('/', (req: Request, res: Response) => {
            return res.json({
                message: 'This is a test PUT payload',
            } as DataModel);
        });

        // call `curl -X DELETE localhost:8080/test`
        this.router.delete('/', (req: Request, res: Response) => {
            return res.json({
                message: 'This is a test DELETE payload',
            } as DataModel);
        });
    }

    getBasePath(): string {
        return this.basePath;
    }

    getRouter(): Router {
        return this.router;
    }
}
