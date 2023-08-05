import { NextFunction, Request, Response } from "express";
import userModel from "../models/userModel";

const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await req.user;
        const findUser = await userModel.findOne({ _id: user._id });
        const isAdmin = findUser!.role === "admin";
        if (isAdmin) {
            next();
        }
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ message: err.message });
    }
};

const validateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const user = await req.user;
        if (id === user._id) {
            next();
        } else {
            res.status(401).json({ message: "Unauthorized" });
        }
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ message: err.message });
    }
};

export { isAdmin, validateUser };
