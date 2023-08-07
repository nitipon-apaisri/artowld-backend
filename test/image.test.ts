import { describe, expect, test } from "@jest/globals";
import request from "supertest";
import app from "../app";
import { beforeAll, afterAll } from "@jest/globals";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { simpleSignin, simpleUser } from "../database/simpleData";
import fs from "fs";

const path = "/api/v1/image";
let token: string;
let link: string;

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

describe("Image", () => {
    test("should return 200 after upload a image", async () => {
        const image = fs.readFileSync("./assets/img/IMG_5684.PNG");
        const response = await request(app)
            .post(`${path}`)
            .set("Authorization", `Bearer ${token}`)
            .attach("image", image, "test.jpg")
            .set("Accept", "application/json")
            .set("Content-Type", "multipart/form-data");
        link = response.body.link.replace(`http://localhost:${process.env.PORT || 1997}`, "");
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("link");
    });
    test("should return 200 after retrieve a image", async () => {
        const response = await request(app).get(`${link}`).set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(200);
    });
});
