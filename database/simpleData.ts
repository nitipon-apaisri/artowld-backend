import { productType } from "../types/productTypes";
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

const sampleProducts: productType = {
    _id: "1",
    name: "Product 1",
    price: 100,
    description: "Product 1 description",
    image: "",
    tags: ["tag1", "tag2"],
    owner: "1",
    licenseType: "license type",
    createdAt: new Date(),
    updatedAt: new Date(),
};
export { simpleUser, simpleSignin, sampleProducts };
