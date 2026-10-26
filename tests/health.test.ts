import { test, expect } from "vitest";
import request from "supertest";
import { app } from "../src/app";

test("GET /health", async () => {
  const res = await request(app).get("/health");
  expect(res.body).toEqual({ status: "ok" });
});