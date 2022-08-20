import request from "supertest";
import { Express } from "express-serve-static-core";
import app from "@server";
import { IErrorResponseDto } from "@utils/responses";

let server: Express;

beforeAll(() => {
  server = app;
});

describe("Test environment", () => {
  test("NODE_ENV should return test", () => {
    expect(process.env.NODE_ENV).toEqual("test");
  });
});

describe("Test non-existent endpoints", () => {
  test("should return 404", async () => {
    const res = await request(server).get("/some-random-uri");
    const response: IErrorResponseDto = JSON.parse(res.text);
    expect(response.hasError).toBe(true);
    expect(response.errors.code).toEqual(404);
  });
});
