import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import isUserDuplicate from "../utils/isUserDuplicate";
import userModel from "../models/userModel";
import { v4 as uuidv4 } from "uuid";
import { userType } from "../types/userTypes";
import jwt from "jsonwebtoken";
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

const userSignin = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const findUser = await userModel.findOne({ email: email });
    if (!findUser) {
        res.status(404).json({ message: "User not found" });
    } else {
        const isPasswordMatch = await bcrypt.compare(password, findUser.password);
        const token = { _id: findUser?._id, email: findUser?.email };
        if (!isPasswordMatch) {
            res.status(403).json({ message: "Invalid credentials" });
        } else {
            res.status(200).json({ message: "Login success", token: jwt.sign(token, process.env.JWT_SECRET as string) });
        }
    }
};

const userNameUpdate = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { name } = req.body;
    const user = {
        name: name,
    };
    try {
        await userModel.findByIdAndUpdate({ _id: id }, user, { new: true });
        res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
export { userRegister, userSignin, userNameUpdate };
