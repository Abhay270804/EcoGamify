import type { RequestHandler } from "express";
import { pool } from "../db";

export const listCourses: RequestHandler = async (_req, res) => {
  const r = await pool.query(`SELECT id, title, description, level, audience, points_per_quiz, badge_id, badge_label, lessons FROM courses ORDER BY created_at DESC`);
  res.json({ courses: r.rows });
};

export const getCourse: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const r = await pool.query(`SELECT id, title, description, level, audience, points_per_quiz, badge_id, badge_label, lessons FROM courses WHERE id=$1`, [id]);
  const c = r.rows[0];
  if (!c) return res.status(404).json({ error: 'Not found' });
  res.json({ course: c });
};

export const upsertCourse: RequestHandler = async (req, res) => {
  const { id, title, description, level, audience, pointsPerQuiz, badge, lessons } = req.body as any;
  if (!id || !title) return res.status(400).json({ error: 'Missing fields' });
  const r = await pool.query(`
    INSERT INTO courses (id, title, description, level, audience, points_per_quiz, badge_id, badge_label, lessons)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, description=EXCLUDED.description, level=EXCLUDED.level, audience=EXCLUDED.audience, points_per_quiz=EXCLUDED.points_per_quiz, badge_id=EXCLUDED.badge_id, badge_label=EXCLUDED.badge_label, lessons=EXCLUDED.lessons
    RETURNING *
  `, [id, title, description, level, audience, pointsPerQuiz, badge?.id, badge?.label, JSON.stringify(lessons || [])]);
  res.json({ course: r.rows[0] });
};

export const deleteCourse: RequestHandler = async (req, res) => {
  const { id } = req.params;
  await pool.query(`DELETE FROM courses WHERE id=$1`, [id]);
  res.json({ ok: true });
};
