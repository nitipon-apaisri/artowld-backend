import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { userType } from "../types/userTypes";
import isUserDuplicate from "../utils/isUserDuplicate";
import userModel from "../models/userModel";

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await userModel.find();
        res.status(200).json(users);
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ message: err.message });
    }
};

const getUser = async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const user = await userModel.findById(userId);
    try {
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ message: err.message });
    }
    next();
};

const registerUser = async (req: Request, res: Response, next: NextFunction) => {
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
            const err = error as Error;
            res.status(500).json({ message: err.message });
        }
        next();
    }
};

const signIn = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const findUser = await userModel.findOne({ email: email });
    if (!findUser) {
        res.status(404).json({ message: "User not found" });
    } else {
        try {
            const isPasswordMatch = await bcrypt.compare(password, findUser.password);
            const token = { _id: findUser?._id, email: findUser?.email };
            if (!isPasswordMatch) {
                res.status(403).json({ message: "Something went wrong" });
            } else {
                res.status(200).json({ message: "Login success", token: jwt.sign(token, process.env.JWT_SECRET as string) });
            }
        } catch (error) {
            const err = error as Error;
            res.status(500).json({ message: err.message });
        }
        next();
    }
};

const updateUserName = async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const { name } = req.body;
    const user = {
        name: name,
    };
    try {
        await userModel.findByIdAndUpdate({ _id: userId }, user, { new: true });
        res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ message: err.message });
    }
    next();
};

const updateUserEmail = async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const { email } = req.body;
    const user = { email: email };
    try {
        await userModel.findByIdAndUpdate({ _id: userId }, user, { new: true });
        res.status(200).json({ message: "User email updated successfully" });
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ message: err.message });
    }
    next();
};

const updateUserPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { password } = req.body;
        const { userId } = req.params;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        await userModel.findByIdAndUpdate({ _id: userId }, { password: hashedPassword }, { new: true });
        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        const err = error as Error;

        res.status(500).json({ message: err.message });
    }
};

const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, token } = req.params;
        const { password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string);
        if (decodedToken) {
            await userModel.findById({ _id: userId }, { password: hashedPassword }, { new: true });
            res.status(200).json({ message: "Password reset successfully" });
        } else {
            res.status(403).json({ message: "Something went wrong" });
        }
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ message: err.message });
    }
};

const createResetPasswordLink = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;
        const userId = await userModel.findOne({ email: email });
        const token = jwt.sign({ id: userId?._id }, process.env.JWT_SECRET as string, { expiresIn: "15m" });
        res.status(200).json({ link: `http://localhost:${process.env.PORT || 1997}/api/v1/user/${userId?._id}/reset-password/${token}` }); //Also send the link to the user's email
    } catch (error) {
        throw new Error(error as string);
    }
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    try {
        await userModel.findByIdAndRemove({ _id: userId });
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ message: err.message });
    }
    next();
};

export { getUsers, getUser, registerUser, signIn, updateUserName, updateUserEmail, updateUserPassword, createResetPasswordLink, resetPassword, deleteUser };
