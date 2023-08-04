import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import isUserDuplicate from "../utils/isUserDuplicate";
import userModel from "../models/userModel";
import { v4 as uuidv4 } from "uuid";
import { userType } from "../types/userTypes";
import jwt from "jsonwebtoken";

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await userModel.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

const getUser = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const user = await userModel.findById(id);
        res.status(200).json(user);
    } catch (error) {
        throw new Error(error as string);
    }
};

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
            res.status(200).json({ message: "User registered successfully" });
        } catch (error) {
            throw new Error(error as string);
        }
    }
};

const userSignin = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const findUser = await userModel.findOne({ email: email });
    if (!findUser) {
        res.status(404).json({ message: "User not found" });
    } else {
        try {
            const isPasswordMatch = await bcrypt.compare(password, findUser.password);
            const token = { _id: findUser?._id, email: findUser?.email };
            if (!isPasswordMatch) {
                res.status(403).json({ message: "Invalid credentials" });
            } else {
                res.status(200).json({ message: "Login success", token: jwt.sign(token, process.env.JWT_SECRET as string) });
            }
        } catch (error) {
            throw new Error(error as string);
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
        throw new Error(error as string);
    }
};

const userDelete = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        await userModel.findByIdAndRemove({ _id: id });
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        throw new Error(error as string);
    }
};

export { getUsers, getUser, userRegister, userSignin, userNameUpdate, userDelete };
