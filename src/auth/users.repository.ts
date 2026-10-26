import { pool } from "../db";

export interface User {
  id: number;
  email: string;
  passwordHash: string;
  role: "USER" | "ADMIN";
}

interface UserRow {
  id: number;
  email: string;
  password_hash: string;
  role: "USER" | "ADMIN";
}

const toUser = (r: UserRow): User => ({
  id: r.id,
  email: r.email,
  passwordHash: r.password_hash,
  role: r.role,
});

export const users = {
  async create(input: { email: string; passwordHash: string }): Promise<User> {
    const { rows } = await pool.query<UserRow>(
      `insert into users (email, password_hash)
       values ($1, $2)
       returning id, email, password_hash, role`,
      [input.email, input.passwordHash],
    );
    const row = rows[0];
    if (!row) throw new Error("insert returned no row");
    return toUser(row);
  },

  async findByEmail(email: string): Promise<User | undefined> {
    const { rows } = await pool.query<UserRow>(
      `select id, email, password_hash, role from users where email = $1`,
      [email],
    );
    return rows[0] ? toUser(rows[0]) : undefined;
  },
};