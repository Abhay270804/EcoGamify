import { useMemo, useState } from "react";
import { LevelSelector, type EducationLevel } from "@/components/LevelSelector";
import { getCourses } from "@/services/coursesStore";
import { CourseCard } from "@/components/CourseCard";

export default function Courses() {
  const [level, setLevel] = useState<EducationLevel>(
    (localStorage.getItem("ecolearn_level") as EducationLevel) || "elementary",
  );
  const all = useMemo(() => getCourses(), []);
  const list = useMemo(
    () => all.filter((c) => c.audience.includes(level)),
    [all, level],
  );

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Courses</h1>
      <p className="mt-2 text-foreground/70">
        Personalized for your education level.
      </p>
      <div className="mt-5">
        <LevelSelector value={level} onChange={setLevel} />
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {list.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
