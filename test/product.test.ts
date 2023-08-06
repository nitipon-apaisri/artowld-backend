import { describe, expect, test } from "@jest/globals";
import request from "supertest";
import app from "../app";
import { beforeAll, afterAll } from "@jest/globals";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { simpleSignin, simpleUser, sampleProducts } from "../database/simpleData";

const path = "/api/v1/product";
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

describe("Product", () => {
    test("should return 200 after upload a product", async () => {
        const response = await request(app).post(`${path}`).send(sampleProducts).set("Authorization", `Bearer ${token}`).set("Accept", "application/json").set("Content-Type", "application/json");
        expect(response.status).toBe(200);
    });
});
