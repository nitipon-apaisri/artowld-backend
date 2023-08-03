import { describe, expect, test } from "@jest/globals";
import request from "supertest";
import app from "../app";
describe("Hello World", () => {
    test("should return Hello World", async () => {
        const response = await request(app).get("/");
        expect(response.status).toBe(200);
        expect(response.text).toEqual("Hello World!");
    });
});
