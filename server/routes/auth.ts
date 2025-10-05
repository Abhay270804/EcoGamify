import type { RequestHandler } from "express";
import { pool } from "../db";
import crypto from "crypto";

function hash(pw: string) {
  return crypto.createHash("sha256").update(pw).digest("hex");
}

export const register: RequestHandler = async (req, res) => {
  const { name, email, password, educationLevel } = req.body as {
    name: string; email: string; password: string; educationLevel: string;
  };
  if (!name || !email || !password) return res.status(400).json({ error: "Missing fields" });
  try {
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, education_level) VALUES ($1,$2,$3,$4) RETURNING id, name, email, role, education_level`,
      [name, email.toLowerCase(), hash(password), educationLevel || 'elementary']
    );
    res.json({ user: result.rows[0] });
  } catch (e: any) {
    if (String(e?.message || '').includes('duplicate')) return res.status(409).json({ error: 'Email already registered' });
    res.status(500).json({ error: 'Server error' });
  }
};

export const login: RequestHandler = async (req, res) => {
  const { email, password } = req.body as { email: string; password: string };
  const q = await pool.query(`SELECT id, name, email, role, education_level, password_hash FROM users WHERE email=$1`, [email.toLowerCase()]);
  const user = q.rows[0];
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (user.password_hash !== hash(password)) return res.status(401).json({ error: 'Invalid credentials' });
  res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role, education_level: user.education_level } });
};
