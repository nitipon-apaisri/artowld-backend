import { userType } from "../types/userTypes";

const simpleUser: userType = {
    _id: "1",
    name: { first: "John", last: "Doe" },
    email: "john.doe@mail.com",
    password: "123456",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
};
const simpleSignin = {
    email: "john.doe@mail.com",
    password: "123456",
};
export { simpleUser, simpleSignin };
