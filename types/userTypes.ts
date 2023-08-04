interface userType {
    id: string;
    name: {
        first: string;
        last: string;
    };
    email: string;
    password: string;
    role: string;
    createdAt: string | Date;
    updatedAt: string | Date;
}
