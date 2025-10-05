import type { Course } from "@/data/curriculum";
import { getCourses } from "@/services/coursesStore";
import { getCurrentUser } from "@/services/auth";
import { addPoints } from "@/services/points";

export type ProgressState = {
  lessons: Record<string, boolean>; // key: courseId:lessonId
  badges: Record<string, boolean>; // key: badgeId
};

const KEY = (uid: string) => `ecolearn_progress_${uid || "guest"}`;

function load(): ProgressState {
  const uid = getCurrentUser()?.id || "guest";
  try {
    return JSON.parse(
      localStorage.getItem(KEY(uid)) || '{"lessons":{},"badges":{}}',
    ) as ProgressState;
  } catch {
    return { lessons: {}, badges: {} };
  }
}
function save(state: ProgressState) {
  const uid = getCurrentUser()?.id || "guest";
  localStorage.setItem(KEY(uid), JSON.stringify(state));
}

export function isLessonCompleted(courseId: string, lessonId: string) {
  return !!load().lessons[`${courseId}:${lessonId}`];
}

export function markLessonCompleted(course: Course, lessonId: string) {
  const state = load();
  const key = `${course.id}:${lessonId}`;
  if (state.lessons[key]) return false; // already completed
  state.lessons[key] = true;
  save(state);
  // If all lessons completed -> award course badge
  if (getCourseProgress(course) === 100) {
    state.badges[course.badge.id] = true;
    save(state);
  }
  return true;
}

export function getCourseProgress(course: Course) {
  const state = load();
  const total = course.lessons.length;
  const done = course.lessons.filter(
    (l) => state.lessons[`${course.id}:${l.id}`],
  ).length;
  return Math.round((done / total) * 100);
}

import { getActiveEducationLevel } from "@/services/settings";

export function isCourseLocked(course: Course) {
  if (course.level === "Beginner") return false;
  const activeLevel = getActiveEducationLevel();
  const prevLevel =
    course.level === "Intermediate"
      ? "Beginner"
      : "Advanced" === course.level
        ? "Intermediate"
        : "Beginner";
  const prevCourses = getCourses().filter(
    (c) => c.level === prevLevel && c.audience.includes(activeLevel),
  );
  if (prevCourses.length === 0) return false; // nothing to gate against
  // Require all previous-level courses for this education level to be completed
  return !prevCourses.every((c) => getCourseProgress(c) === 100);
}

export function getBadges() {
  return load().badges;
}

export function completeLessonWithPoints(course: Course, lessonId: string) {
  // Only award points on first perfect completion
  const newlyCompleted = markLessonCompleted(course, lessonId);
  if (newlyCompleted) {
    addPoints(course.pointsPerQuiz, `Perfect: ${course.title} / ${lessonId}`);
  }
  return newlyCompleted;
}
