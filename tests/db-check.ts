import { pool } from "../src/db";

async function check() {
  try {
    const res = await pool.query("SELECT 1 AS ok");
    console.log("Connexion réussie :", res.rows[0]);
  } catch (err) {
    console.error("Échec de connexion ou config invalide :", err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

check();