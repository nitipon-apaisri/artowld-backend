import { describe, expect, test } from "@jest/globals";
import request from "supertest";
import app from "../app";
import { beforeAll, afterAll } from "@jest/globals";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { simpleSignin, simpleUser } from "../database/simpleData";
import jwt from "jsonwebtoken";
let token: string;
let resetPasswordLink = "";
const path = "/api/v1/user";
const update = { email: "miyamoto.musashi@mail.com" };
let userId: string;
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
        const response = await request(app).get("/api/v1/users");
        expect(response.status).toBe(200);
    });

    test("should return a user", async () => {
        userId = JSON.stringify(jwt.verify(token, process.env.JWT_SECRET as string));
        const response = await request(app).get(`${path}/${JSON.parse(userId)._id}`);
        expect(response.status).toBe(200);
        expect(response.body.name).toBe(simpleUser.name);
    });

    test("should return 200 after update user name", async () => {
        const update = { name: "Miyamoto Musashi" };
        const response = await request(app)
            .patch(`${path}/${JSON.parse(userId)._id}/userName`)
            .send(update)
            .set("Authorization", `Bearer ${token}`)
            .set("Accept", "application/json")
            .set("Content-Type", "application/json");
        const user = await request(app)
            .get(`${path}/${JSON.parse(userId)._id}`)
            .set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(user.body.name !== simpleUser.name).toBe(true);
    });

    test("should return 200 after email", async () => {
        simpleSignin.email = update.email;
        const response = await request(app)
            .patch(`${path}/${JSON.parse(userId)._id}/email`)
            .send(update)
            .set("Authorization", `Bearer ${token}`)
            .set("Accept", "application/json")
            .set("Content-Type", "application/json");
        const res = await request(app).post("/api/v1/user/signin").send(simpleSignin).set("Accept", "application/json").set("Content-Type", "application/json");
        token = res.body.token;
        const user = await request(app)
            .get(`${path}/${JSON.parse(userId)._id}`)
            .set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(user.body.email !== simpleUser.email).toBe(true);
    });

    test("should return 200 after changed password", async () => {
        await request(app)
            .patch(`/api/v1/user/${JSON.parse(userId)._id}/changePassword`)
            .send({ password: "123" })
            .set("Authorization", `Bearer ${token}`);
        const res = await request(app).post("/api/v1/user/signin").send(simpleSignin).set("Accept", "application/json").set("Content-Type", "application/json");
        expect(res.status).toBe(403);
    });

    test("should return reset password link", async () => {
        const res = await request(app).post("/api/v1/get-reset-password-link").send(update).set("Accept", "application/json").set("Content-Type", "application/json");
        resetPasswordLink = new URL(`${res.body.link}`).pathname;
        expect(res.status).toBe(200);
        expect(JSON.parse(res.text)).toHaveProperty("link");
    });

    test("should return 200 after reset password", async () => {
        await request(app).post(resetPasswordLink).send({ password: "111" }).set("Accept", "application/json").set("Content-Type", "application/json");
        const signInRes = await request(app).post("/api/v1/user/signin").send(simpleSignin).set("Accept", "application/json").set("Content-Type", "application/json");
        expect(signInRes.status).toBe(403);
    });

    test("should return 401 if user is invalid", async () => {
        const response = await request(app)
            .patch(`${path}/123/userName`)
            .send(update)
            .set("Authorization", `Bearer ${token}`)
            .set("Accept", "application/json")
            .set("Content-Type", "application/json");
        expect(response.status).toBe(401);
    });

    test("should return 200 after delete user", async () => {
        const response = await request(app)
            .delete(`${path}/${JSON.parse(userId)._id}`)
            .set("Authorization", `Bearer ${token}`)
            .set("Accept", "application/json")
            .set("Content-Type", "application/json");
        expect(response.status).toBe(200);
    });
});
