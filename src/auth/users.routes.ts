import express from "express";
import bcrypt from "bcryptjs";
import { users } from "./users.repository";
import { z } from "zod";

const router = express.Router();


const registerSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8).max(72),
});

router.post("/register", async (req, res, next) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
  }
  const { email, password } = parsed.data;

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await users.create({ email, passwordHash });
    return res.status(201).json({ id: user.id, email: user.email });
  } catch (err) {
    if ((err as { code?: string }).code === "23505") {
      return res.status(409).json({ error: "Email already registered" });
    }
    next(err);
  }
});


export { router as authRouter };