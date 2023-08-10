import "dotenv/config";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
export const connect = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}`);
        // const mongoServer = await MongoMemoryServer.create();
        // await mongoose.connect(mongoServer.getUri(), { dbName: "sample-db" });
        console.log("Database connected!");
    } catch (error) {
        console.log(error);
    }
};
