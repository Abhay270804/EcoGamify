import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

export const pool = new Pool({
  connectionString,
  ssl: connectionString?.includes("neon.tech") ? { rejectUnauthorized: false } : undefined,
});

export async function initSchema() {
  // Users
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text NOT NULL,
      email text UNIQUE NOT NULL,
      password_hash text NOT NULL,
      role text NOT NULL DEFAULT 'user',
      education_level text NOT NULL DEFAULT 'elementary',
      created_at timestamptz NOT NULL DEFAULT now()
    );
  `);
  // Courses as JSON for fast bootstrap
  await pool.query(`
    CREATE TABLE IF NOT EXISTS courses (
      id text PRIMARY KEY,
      title text NOT NULL,
      description text NOT NULL,
      level text NOT NULL,
      audience text[] NOT NULL,
      points_per_quiz integer NOT NULL,
      badge_id text NOT NULL,
      badge_label text NOT NULL,
      lessons jsonb NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    );
  `);
  // Progress and points
  await pool.query(`
    CREATE TABLE IF NOT EXISTS lesson_progress (
      user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      course_id text NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
      lesson_id text NOT NULL,
      completed_at timestamptz NOT NULL DEFAULT now(),
      PRIMARY KEY (user_id, course_id, lesson_id)
    );
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS user_points (
      user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      points integer NOT NULL DEFAULT 0
    );
  `);
}
