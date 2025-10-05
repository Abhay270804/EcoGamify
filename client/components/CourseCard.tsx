import { Link } from "react-router-dom";
import { Course } from "@/data/curriculum";
import { CourseBadge } from "@/components/Badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getCourseProgress, isCourseLocked } from "@/services/progress";

export function CourseCard({ course }: { course: Course }) {
  const locked = isCourseLocked(course);
  const progress = getCourseProgress(course);
  return (
    <div className="group relative rounded-xl border bg-white/70 p-5 shadow-sm transition hover:shadow-md">
      {locked && (
        <div className="absolute inset-0 z-10 grid place-items-center rounded-xl bg-white/60 backdrop-blur-sm">
          <div className="rounded-md border bg-white px-3 py-1.5 text-sm">
            🔒 Complete previous level to unlock
          </div>
        </div>
      )}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">
            {course.title}
          </h3>
          <p className="mt-1 text-sm text-foreground/70">
            {course.description}
          </p>
        </div>
        <CourseBadge label={course.level} />
      </div>
      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-foreground/70">
          {course.lessons.length} lessons • Quiz after each lesson
        </span>
        <span className="font-medium text-primary">
          +{course.pointsPerQuiz} pts/quiz
        </span>
      </div>
      <div className="mt-4">
        <Progress value={progress} />
        <div className="mt-1 text-xs text-foreground/60">
          {progress}% completed
        </div>
      </div>
      <div className="mt-5 flex gap-2">
        <Button asChild disabled={locked}>
          <Link to={`/course/${course.id}`}>Start</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link to={`/course/${course.id}`}>Syllabus</Link>
        </Button>
      </div>
    </div>
  );
}
