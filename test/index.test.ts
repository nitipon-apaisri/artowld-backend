import { describe, expect, test } from "@jest/globals";
import request from "supertest";
import app from "../app";
import { beforeAll, afterAll } from "@jest/globals";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { simpleSignin, simpleUser } from "../database/simpleData";

let token: string;
beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), { dbName: "testDB" });
    await request(app).post("/api/v1/user/signup").send(simpleUser).set("Accept", "application/json").set("Content-Type", "application/json");
    const res = await request(app).post("/api/v1/user/signin").send(simpleSignin).set("Accept", "application/json").set("Content-Type", "application/json");
    console.log(res.body);
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
        const response = await request(app).patch("/api/v1/users/1").send().set("Authorization", `Bearer ${token}`).set("Accept", "application/json").set("Content-Type", "application/json");
        expect(response.status).toBe(200);
    });
    test("should return 200 after delete user", async () => {
        const response = await request(app).delete("/api/v1/user/1").send().set("Authorization", `Bearer ${token}`).set("Accept", "application/json").set("Content-Type", "application/json");
        expect(response.status).toBe(200);
    });
});
