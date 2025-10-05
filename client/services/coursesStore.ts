import { COURSES, type Course } from "@/data/curriculum";

const KEY = "ecolearn_courses_v2";

function load(): Course[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      localStorage.setItem(KEY, JSON.stringify(COURSES));
      return COURSES;
    }
    const parsed = JSON.parse(raw) as Course[];
    return parsed.length ? parsed : COURSES;
  } catch {
    return COURSES;
  }
}

function save(courses: Course[]) {
  localStorage.setItem(KEY, JSON.stringify(courses));
}

export function getCourses(): Course[] {
  return load();
}
export function getCourseById(id: string): Course | undefined {
  return load().find((c) => c.id === id);
}

export function addCourse(course: Course) {
  const courses = load();
  if (courses.find((c) => c.id === course.id))
    throw new Error("Course id already exists");
  courses.push(course);
  save(courses);
}

export function updateCourse(id: string, patch: Partial<Course>) {
  const courses = load();
  const idx = courses.findIndex((c) => c.id === id);
  if (idx === -1) throw new Error("Course not found");
  courses[idx] = { ...courses[idx], ...patch } as Course;
  save(courses);
}

export function deleteCourse(id: string) {
  const courses = load().filter((c) => c.id !== id);
  save(courses);
}
