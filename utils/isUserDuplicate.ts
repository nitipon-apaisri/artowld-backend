import userModel from "../models/userModel";

const isUserDuplicate = async (email: string) => {
    const findUser = await userModel.findOne({ email: email });
    if (findUser) {
        return true;
    }
};

export default isUserDuplicate;
