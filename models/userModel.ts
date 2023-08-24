import mongoose from "mongoose";
import { userType } from "../types/userTypes";
const { Schema } = mongoose;
const user: object = {
    _id: String,
    name: String,
    email: String,
    password: String,
    role: String,
};
const userSchema = new Schema(user, { timestamps: true });
const userModel = mongoose.model<userType>("users", userSchema);
export default userModel;
