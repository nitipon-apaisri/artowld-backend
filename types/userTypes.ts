interface userType {
    _id: string;
    name: string;
    email: string;
    password: string;
    role: string;
    createdAt: string | Date;
    updatedAt: string | Date;
}

export { userType };
