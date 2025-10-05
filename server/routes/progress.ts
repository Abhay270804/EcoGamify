import type { RequestHandler } from "express";
import { pool } from "../db";

export const getProgress: RequestHandler = async (req, res) => {
  const { userId } = req.query as any;
  if (!userId) return res.status(400).json({ error: "userId required" });
  const r = await pool.query(
    `SELECT course_id, lesson_id FROM lesson_progress WHERE user_id=$1`,
    [userId],
  );
  const pts = await pool.query(
    `SELECT points FROM user_points WHERE user_id=$1`,
    [userId],
  );
  res.json({ lessons: r.rows, points: pts.rows[0]?.points || 0 });
};

export const completeLesson: RequestHandler = async (req, res) => {
  const { userId, courseId, lessonId, pointsPerQuiz } = req.body as any;
  if (!userId || !courseId || !lessonId)
    return res.status(400).json({ error: "Missing fields" });
  try {
    await pool.query("BEGIN");
    const ins = await pool.query(
      `INSERT INTO lesson_progress (user_id, course_id, lesson_id)
       VALUES ($1,$2,$3)
       ON CONFLICT DO NOTHING
       RETURNING 1`,
      [userId, courseId, lessonId],
    );
    const newlyCompleted = ins.rowCount > 0;
    if (newlyCompleted && (pointsPerQuiz || 0) > 0) {
      await pool.query(
        `INSERT INTO user_points (user_id, points)
         VALUES ($1,$2)
         ON CONFLICT (user_id) DO UPDATE SET points=user_points.points+EXCLUDED.points`,
        [userId, pointsPerQuiz],
      );
    }
    await pool.query("COMMIT");
    res.json({ ok: true, awarded: newlyCompleted });
  } catch (e) {
    await pool.query("ROLLBACK");
    res.status(500).json({ error: "Server error" });
  }
};
