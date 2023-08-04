import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
const { JWT_SECRET } = process.env;

export const auth = (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;
    if (!authorization) {
        throw new Error("You must be logged in");
    }
    const token = authorization.replace("Bearer ", "");
    try {
        const verify = jwt.verify(token, JWT_SECRET as string);
        req.user = verify;
    } catch (error) {
        throw new Error("Not authorized");
    }
    next();
};
