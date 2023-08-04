import { describe, expect, test } from "@jest/globals";
import request from "supertest";
import app from "../app";
import { beforeAll, afterAll } from "@jest/globals";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { simpleSignin, simpleUser } from "../database/simpleData";
import jwt from "jsonwebtoken";
let token: string;
beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), { dbName: "testDB" });
    await request(app).post("/api/v1/user/signup").send(simpleUser).set("Accept", "application/json").set("Content-Type", "application/json");
    const res = await request(app).post("/api/v1/user/signin").send(simpleSignin).set("Accept", "application/json").set("Content-Type", "application/json");
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

describe("User", () => {
    test("should return users", async () => {
        const response = await request(app).get("/api/v1/users").set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(200);
    });
    test("should return 200 after update user", async () => {
        const userId = JSON.stringify(jwt.verify(token, process.env.JWT_SECRET as string));
        const update = { name: { first: "Miyamoto", last: "Musashi" } };
        const response = await request(app)
            .patch(`/api/v1/user/${userId}`)
            .send(update)
            .set("Authorization", `Bearer ${token}`)
            .set("Accept", "application/json")
            .set("Content-Type", "application/json");
        expect(response.status).toBe(200);
    });
    test("should return 200 after delete user", async () => {
        const userId = JSON.stringify(jwt.verify(token, process.env.JWT_SECRET as string));
        const response = await request(app).delete(`/api/v1/user/${userId}`).set("Authorization", `Bearer ${token}`).set("Accept", "application/json").set("Content-Type", "application/json");
        expect(response.status).toBe(200);
    });
});
