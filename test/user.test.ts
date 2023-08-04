import { describe, expect, test } from "@jest/globals";
import request from "supertest";
import app from "../app";
import { beforeAll, afterAll } from "@jest/globals";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { simpleSignin, simpleUser } from "../database/simpleData";
import jwt from "jsonwebtoken";
let token: string;
const path = "/api/v1/user";
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

describe("User", () => {
    test("should return users", async () => {
        const response = await request(app).get("/api/v1/users").set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(200);
    });

    test("should return a user", async () => {
        const userId = JSON.stringify(jwt.verify(token, process.env.JWT_SECRET as string));
        const response = await request(app)
            .get(`${path}/${JSON.parse(userId)._id}`)
            .set("Authorization", `Bearer ${token}`);
        const user = await request(app)
            .get(`${path}/${JSON.parse(userId)._id}`)
            .set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(user.body.name.first).toBe(simpleUser.name.first);
    });

    test("should return 200 after update user", async () => {
        const userId = JSON.stringify(jwt.verify(token, process.env.JWT_SECRET as string));
        const update = { name: { first: "Miyamoto", last: "Musashi" } };
        const response = await request(app)
            .patch(`${path}/${JSON.parse(userId)._id}`)
            .send(update)
            .set("Authorization", `Bearer ${token}`)
            .set("Accept", "application/json")
            .set("Content-Type", "application/json");
        const user = await request(app)
            .get(`${path}/${JSON.parse(userId)._id}`)
            .set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(user.body.name.first !== simpleUser.name.first).toBe(true);
    });

    test("should return 200 after email", async () => {
        const userId = JSON.stringify(jwt.verify(token, process.env.JWT_SECRET as string));
        const update = { email: "miyamoto.musashi@mail.com" };
        const response = await request(app)
            .patch(`${path}/${JSON.parse(userId)._id}/email`)
            .send(update)
            .set("Authorization", `Bearer ${token}`)
            .set("Accept", "application/json")
            .set("Content-Type", "application/json");
        const user = await request(app)
            .get(`${path}/${JSON.parse(userId)._id}`)
            .set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(user.body.email !== simpleUser.email).toBe(true);
    });

    test("should return 200 after delete user", async () => {
        const userId = JSON.stringify(jwt.verify(token, process.env.JWT_SECRET as string));
        const response = await request(app)
            .delete(`${path}/${JSON.parse(userId)._id}`)
            .set("Authorization", `Bearer ${token}`)
            .set("Accept", "application/json")
            .set("Content-Type", "application/json");
        expect(response.status).toBe(200);
    });
});
