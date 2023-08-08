import { describe, expect, test } from "@jest/globals";
import request from "supertest";
import app from "../app";
import { beforeAll, afterAll } from "@jest/globals";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { simpleSignin, simpleUser, sampleProducts } from "../database/simpleData";
import jwt from "jsonwebtoken";

let token: string;
let productId: string;
let userId: string;

beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), { dbName: "testDB" });
    await request(app).post("/api/v1/user/signup").send(simpleUser).set("Accept", "application/json").set("Content-Type", "application/json");
    const res = await request(app).post("/api/v1/user/signin").send(simpleSignin).set("Accept", "application/json").set("Content-Type", "application/json");
    token = res.body.token;
    const verify = jwt.verify(token, process.env.JWT_SECRET as string);
    userId = JSON.parse(JSON.stringify(verify))._id;
});
afterAll(async () => {
    await mongoose.connection.close();
});

describe("Product", () => {
    test("should return 200 after upload a product", async () => {
        const response = await request(app)
            .post(`/api/v1/user/${userId}/product`)
            .send(sampleProducts)
            .set("Authorization", `Bearer ${token}`)
            .set("Accept", "application/json")
            .set("Content-Type", "application/json");
        expect(response.status).toBe(200);
    });
    test("should return 200 after get all products", async () => {
        const response = await request(app).get(`/api/v1/products`).set("Authorization", `Bearer ${token}`).set("Accept", "application/json").set("Content-Type", "application/json");
        productId = response.body.products[0]._id;
        expect(response.status).toBe(200);
    });
    test("should return 200 after get a product", async () => {
        const response = await request(app).get(`/api/v1/product/${productId}`).set("Authorization", `Bearer ${token}`).set("Accept", "application/json").set("Content-Type", "application/json");
        expect(response.status).toBe(200);
    });
    test("should return 200 after update a product", async () => {
        const response = await request(app)
            .patch(`/api/v1/user/${userId}/product/${productId}`)
            .send({ price: 1000 })
            .set("Authorization", `Bearer ${token}`)
            .set("Accept", "application/json")
            .set("Content-Type", "application/json");
        expect(response.status).toBe(200);
    });
});
