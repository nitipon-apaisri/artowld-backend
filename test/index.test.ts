import { describe, expect, test } from "@jest/globals";
import request from "supertest";
import app from "../app";
import { beforeAll, afterAll } from "@jest/globals";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { simpleUser } from "../database/simpleData";

let token: string;
beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), { dbName: "testDB" });
    await request(app).post("/api/v1/users/signup").send(simpleUser).set("Accept", "application/json").set("Content-Type", "application/json");
    const res = await request(app).post("/api/v1/users/signin").send(simpleUser).set("Accept", "application/json").set("Content-Type", "application/json");
    token = res.body.token;
});
afterAll(async () => {
    await mongoose.connection.close();
});
describe("Hello World", () => {
    test("should return Hello World", async () => {
        const response = await request(app).get("/");
        expect(response.status).toBe(200);
        expect(response.text).toEqual("Hello World!");
    });
});

// describe("User", () => {
//     test("should return users", async () => {
//         const response = await request(app).get("/api/v1/users").set("Authorization", `Bearer ${token}`);
//         expect(response.status).toBe(200);
//     });
// });
