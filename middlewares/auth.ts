import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import userModel from "../models/userModel";
const { JWT_SECRET } = process.env;

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;
    if (authorization) {
        const token = authorization.replace("Bearer ", "");
        const verify = jwt.verify(token, JWT_SECRET as string);
        const findUser = await userModel.findById(JSON.parse(JSON.stringify(verify))._id);
        if (findUser?.email === JSON.parse(JSON.stringify(verify)).email) {
            try {
                req.user = verify;
            } catch (error) {
                console.log(error);
                res.status(500).json({ message: "Internal server error" });
            }
        } else {
            res.status(401).json({ message: "Unauthorized" });
        }
    } else {
        res.status(401).json({ message: "Unauthorized" });
    }
    next();
};
