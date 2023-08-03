import { Request, Response } from "express";

const logger = (req: Request, res: Response, next: Function) => {
    console.log(`${req.method} ${req.path}`);
    next();
};

export default logger;
