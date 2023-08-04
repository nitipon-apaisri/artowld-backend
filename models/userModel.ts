import mongoose from "mongoose";
import { userType } from "../types/userTypes";
const { Schema } = mongoose;
const user = {
    _id: String,
    name: {
        first: String,
        last: String,
    },
    email: String,
    password: String,
    role: String,
};
const userSchema = new Schema(user);
const userModel = mongoose.model<userType>("users", userSchema);
export default userModel;
