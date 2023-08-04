import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import isUserDuplicate from "../utils/isUserDuplicate";
import userModel from "../models/userModel";
import { v4 as uuidv4 } from "uuid";
import { userType } from "../types/userTypes";
const userRegister = async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, role } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user: userType = new userModel({
        _id: uuidv4(),
        name,
        email,
        password: hashedPassword,
        role,
        createdAt: new Date(),
        updatedAt: new Date(),
    });
    if (await isUserDuplicate(email)) {
        res.status(409).json({ message: "User already exists" });
    } else {
        try {
            const newUser = new userModel(user);
            await newUser.save();
            res.status(201).json({ message: "User registered successfully" });
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    }
};

export { userRegister };
