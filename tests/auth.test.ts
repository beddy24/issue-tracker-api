import { pool } from  "../src/db";
import request from "supertest";
import { app } from "../src/app";

import { beforeEach, afterAll, test, expect } from "vitest";


beforeEach(async () => {
  await pool.query("truncate users, issues restart identity cascade");
});
afterAll(() => pool.end());


test("POST /auth - 201 success without returning password", async () => {
  const uniqueEmail = `user_${Date.now()}@example.com`;
  const payload = {
    email: uniqueEmail,
    password: "Password123!",
  };

  const res = await request(app).post("/auth/register").send(payload);

  expect(res.status).toBe(201);
  expect(res.body).toHaveProperty("id");
  expect(res.body.email).toBe(uniqueEmail);
  expect(res.body).not.toHaveProperty("password");
});

test("POST /auth - 400 on invalid input", async () => {
  const res = await request(app).post("/auth/register").send({});

  expect(res.status).toBe(400);
});

test("POST /auth - 409 on duplicate user", async () => {
  const email = `duplicate_${Date.now()}@example.com`;
  const payload = {
    email,
    password: "Password123!",
  };

  // Premier enregistrement
  const firstRes = await request(app).post("/auth/register").send(payload);
  expect(firstRes.status).toBe(201);

  // Tentative de duplication
  const duplicateRes = await request(app).post("/auth/register").send(payload);
  expect(duplicateRes.status).toBe(409);
});