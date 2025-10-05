import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { getCourseById } from "@/services/coursesStore";
import { QuizCard } from "@/components/QuizCard";
import { getCourseProgress, isCourseLocked } from "@/services/progress";
import { Progress } from "@/components/ui/progress";
import { CourseBadge } from "@/components/Badge";
import { LessonVideo } from "@/components/LessonVideo";

export default function CourseDetail() {
  const { courseId } = useParams();
  const course = useMemo(() => getCourseById(courseId!), [courseId]);
  if (!course)
    return <div className="container mx-auto py-10">Course not found.</div>;
  const progress = getCourseProgress(course);
  const locked = isCourseLocked(course);

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            {course.title}
          </h1>
          <p className="mt-1 text-foreground/70">{course.description}</p>
          <div className="mt-2">
            <CourseBadge label={course.level} />
          </div>
        </div>
        <div className="min-w-[220px]">
          <Progress value={progress} />
          <div className="mt-1 text-xs text-foreground/60">
            {progress}% completed
          </div>
        </div>
      </div>

      {locked && (
        <div className="mt-6 rounded-md border bg-amber-50 p-4 text-amber-800">
          This course is locked. Complete all courses in the previous level for
          your education level to unlock.
        </div>
      )}

      <div className="mt-8 space-y-6">
        {course.lessons.map((lesson) => (
          <div
            key={lesson.id}
            className={`rounded-xl border p-5 ${locked ? "bg-secondary/40" : "bg-white/70"}`}
          >
            <h3 className="text-lg font-semibold">{lesson.title}</h3>
            <div className="mt-3">
              <LessonVideo
                videoId={lesson.youtubeVideoId}
                searchQuery={
                  lesson.youtubeSearchQuery ??
                  `${course.title} ${lesson.title} sustainability lesson`
                }
                title={lesson.title}
              />
            </div>
            <div className="mt-3">
              <QuizCard
                title={lesson.title}
                questions={lesson.quiz}
                pointsPerQuiz={course.pointsPerQuiz}
                courseId={course.id}
                lessonId={lesson.id}
                course={course as any}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
