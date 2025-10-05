import { useMemo, useState } from "react";
import { isAdmin, login, getCurrentUser } from "@/services/auth";
import {
  getCourses,
  addCourse,
  updateCourse,
  deleteCourse,
} from "@/services/coursesStore";
import type { Course } from "@/data/curriculum";
import { Button } from "@/components/ui/button";

const blankCourse: Course = {
  id: "",
  title: "",
  description: "",
  level: "Beginner",
  audience: ["elementary"],
  pointsPerQuiz: 50,
  badge: { id: "", label: "" },
  lessons: [],
};

export default function AdminPage() {
  const admin = isAdmin();
  const [email, setEmail] = useState("admin@ecolearn.app");
  const [password, setPassword] = useState("admin123");
  const [err, setErr] = useState("");

  const [editing, setEditing] = useState<Course | null>(null);
  const [listVersion, setListVersion] = useState(0);
  const courses = useMemo(() => getCourses(), [listVersion]);

  if (!admin) {
    return (
      <div className="container mx-auto max-w-md py-10">
        <h1 className="text-2xl font-bold">Admin Login</h1>
        <p className="mt-1 text-sm text-foreground/70">
          Use your admin credentials to manage courses.
        </p>
        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            const r = login(email, password);
            if (!r.ok) setErr(r.message || "Error");
            else location.reload();
          }}
        >
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              className="mt-1 w-full rounded-md border px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              className="mt-1 w-full rounded-md border px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {!!err && <p className="text-sm text-red-600">{err}</p>}
          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Course Management
          </h1>
          <p className="mt-1 text-foreground/70">
            Signed in as {getCurrentUser()?.email}
          </p>
        </div>
        <Button onClick={() => setEditing({ ...blankCourse })}>
          Add Course
        </Button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((c) => (
          <div key={c.id} className="rounded-xl border bg-white/70 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold">{c.title}</h3>
                <p className="text-sm text-foreground/70">{c.description}</p>
                <div className="mt-1 text-xs text-foreground/60">
                  Level: {c.level} • Audience: {c.audience.join(", ")} •{" "}
                  {c.pointsPerQuiz} pts
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  className="rounded-md border px-3 py-1.5 text-sm"
                  onClick={() => setEditing({ ...c })}
                >
                  Edit
                </button>
                <button
                  className="rounded-md border px-3 py-1.5 text-sm text-red-700"
                  onClick={() => {
                    if (confirm("Delete course?")) {
                      deleteCourse(c.id);
                      setListVersion((v) => v + 1);
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <CourseEditor
          value={editing}
          onCancel={() => setEditing(null)}
          onSave={(course) => {
            try {
              if (courses.some((x) => x.id === course.id && x !== editing))
                throw new Error("ID already exists");
              const exists = courses.find((x) => x.id === course.id);
              if (exists) updateCourse(course.id, course);
              else addCourse(course);
              setEditing(null);
              setListVersion((v) => v + 1);
            } catch (e: any) {
              alert(e.message || String(e));
            }
          }}
        />
      )}
    </div>
  );
}

function CourseEditor({
  value,
  onCancel,
  onSave,
}: {
  value: Course;
  onCancel: () => void;
  onSave: (c: Course) => void;
}) {
  const [course, setCourse] = useState<Course>(value);
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-3xl rounded-xl border bg-white p-6">
        <h3 className="text-lg font-semibold">
          {value.id ? "Edit Course" : "Add Course"}
        </h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Field label="ID (slug)">
            <input
              className="w-full rounded-md border px-3 py-2"
              value={course.id}
              onChange={(e) =>
                setCourse({ ...course, id: e.target.value.trim() })
              }
            />
          </Field>
          <Field label="Title">
            <input
              className="w-full rounded-md border px-3 py-2"
              value={course.title}
              onChange={(e) => setCourse({ ...course, title: e.target.value })}
            />
          </Field>
          <Field label="Description" className="md:col-span-2">
            <input
              className="w-full rounded-md border px-3 py-2"
              value={course.description}
              onChange={(e) =>
                setCourse({ ...course, description: e.target.value })
              }
            />
          </Field>
          <Field label="Level">
            <select
              className="w-full rounded-md border px-3 py-2"
              value={course.level}
              onChange={(e) =>
                setCourse({ ...course, level: e.target.value as any })
              }
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </Field>
          <Field label="Points/Quiz">
            <input
              type="number"
              className="w-full rounded-md border px-3 py-2"
              value={course.pointsPerQuiz}
              onChange={(e) =>
                setCourse({ ...course, pointsPerQuiz: Number(e.target.value) })
              }
            />
          </Field>
          <Field label="Audience" className="md:col-span-2">
            <div className="flex flex-wrap gap-2">
              {["elementary", "middle", "high", "college"].map((a) => (
                <label
                  key={a}
                  className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm ${course.audience.includes(a as any) ? "bg-primary text-primary-foreground border-primary" : ""}`}
                >
                  <input
                    type="checkbox"
                    checked={course.audience.includes(a as any)}
                    onChange={(e) => {
                      const set = new Set(course.audience);
                      if (e.target.checked) set.add(a as any);
                      else set.delete(a as any);
                      setCourse({
                        ...course,
                        audience: Array.from(set) as any,
                      });
                    }}
                  />{" "}
                  {a}
                </label>
              ))}
            </div>
          </Field>
          <Field label="Badge ID">
            <input
              className="w-full rounded-md border px-3 py-2"
              value={course.badge.id}
              onChange={(e) =>
                setCourse({
                  ...course,
                  badge: { ...course.badge, id: e.target.value },
                })
              }
            />
          </Field>
          <Field label="Badge Label">
            <input
              className="w-full rounded-md border px-3 py-2"
              value={course.badge.label}
              onChange={(e) =>
                setCourse({
                  ...course,
                  badge: { ...course.badge, label: e.target.value },
                })
              }
            />
          </Field>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Lessons ({course.lessons.length})</h4>
            <button
              className="rounded-md border px-3 py-1.5 text-sm"
              onClick={() =>
                setCourse({
                  ...course,
                  lessons: [
                    ...course.lessons,
                    {
                      id: `lesson-${course.lessons.length + 1}`,
                      title: "New Lesson",
                      quiz: [],
                    },
                  ],
                })
              }
            >
              Add Lesson
            </button>
          </div>
          <div className="mt-3 space-y-3">
            {course.lessons.map((l, idx) => (
              <div key={l.id} className="rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <input
                    className="w-full rounded-md border px-3 py-2"
                    value={l.title}
                    onChange={(e) => {
                      const ls = [...course.lessons];
                      ls[idx] = { ...ls[idx], title: e.target.value };
                      setCourse({ ...course, lessons: ls });
                    }}
                  />
                  <button
                    className="rounded-md border px-3 py-1.5 text-sm"
                    onClick={() => {
                      const ls = [...course.lessons];
                      ls.splice(idx, 1);
                      setCourse({ ...course, lessons: ls });
                    }}
                  >
                    Remove
                  </button>
                </div>
                <div className="mt-2 text-xs text-foreground/60">
                  Questions: {l.quiz.length} (editable later)
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button className="rounded-md border px-4 py-2" onClick={onCancel}>
            Cancel
          </button>
          <Button onClick={() => onSave(course)}>Save</Button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: any;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="text-sm font-medium">{label}</div>
      <div className="mt-1">{children}</div>
    </div>
  );
}
