import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import type { Question } from "@/data/curriculum";
import {
  completeLessonWithPoints,
  isLessonCompleted,
} from "@/services/progress";

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function prepareAttempt(questions: Question[], take: number) {
  const picked = shuffle(questions).slice(0, take);
  return picked.map((q) => {
    const idxs = q.options.map((_, i) => i);
    const map = shuffle(idxs);
    const opts = map.map((i) => q.options[i]);
    const newAnswer = map.indexOf(q.answer);
    return { ...q, options: opts, answer: newAnswer };
  });
}

export function QuizCard({
  title,
  questions,
  pointsPerQuiz,
  courseId,
  lessonId,
  course,
}: {
  title: string;
  questions: Question[];
  pointsPerQuiz: number;
  courseId: string;
  lessonId: string;
  course: {
    id: string;
    title: string;
    pointsPerQuiz: number;
    badge: { id: string; label: string };
  };
}) {
  const QUESTIONS_PER_ATTEMPT = Math.min(5, questions.length);
  const [started, setStarted] = useState(false);
  const [prepared, setPrepared] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const alreadyCompleted = isLessonCompleted(courseId, lessonId);

  function startAttempt() {
    const prep = prepareAttempt(questions, QUESTIONS_PER_ATTEMPT);
    setPrepared(prep);
    setAnswers(Array(prep.length).fill(-1));
    setSubmitted(false);
    setStarted(true);
  }

  const score = useMemo(() => {
    let s = 0;
    for (let i = 0; i < prepared.length; i++)
      if (answers[i] === prepared[i].answer) s++;
    return s;
  }, [answers, prepared]);

  const allAnswered = answers.length > 0 && answers.every((a) => a !== -1);
  const isPerfect =
    submitted && score === prepared.length && prepared.length > 0;

  function submit() {
    if (!allAnswered) return;
    setSubmitted(true);
    if (score === prepared.length) {
      completeLessonWithPoints(
        {
          id: courseId,
          title: course.title,
          pointsPerQuiz,
          badge: course.badge,
          audience: [],
          description: "",
          level: "Beginner",
          lessons: [],
        } as any,
        lessonId,
      );
    }
  }

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h4 className="text-base font-semibold">Quiz: {title}</h4>
        <span className="text-sm text-foreground/70">
          {pointsPerQuiz} pts if 100%
        </span>
      </div>
      {alreadyCompleted && (
        <p className="mt-2 rounded-md bg-green-50 px-3 py-2 text-xs text-green-700">
          Already completed — points won’t be granted again.
        </p>
      )}

      {!started && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-foreground/70">
            Start the quiz. Questions and options will be randomized each
            attempt.
          </p>
          <Button onClick={startAttempt}>Start Quiz</Button>
        </div>
      )}

      {started && (
        <>
          <div className="mt-4 space-y-4">
            {prepared.map((q, idx) => (
              <div key={q.id} className="rounded-lg border bg-secondary/40 p-3">
                <p className="font-medium">
                  {idx + 1}. {q.q}
                </p>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {q.options.map((opt, i) => (
                    <label
                      key={i}
                      className={`flex cursor-pointer items-center gap-2 rounded-md border bg-white px-3 py-2 text-sm hover:border-primary ${submitted ? (answers[idx] === i ? (i === q.answer ? "border-green-500" : "border-red-500") : i === q.answer ? "border-green-500" : "") : ""}`}
                    >
                      <input
                        type="radio"
                        name={`q-${q.id}`}
                        className="accent-primary"
                        disabled={submitted}
                        checked={answers[idx] === i}
                        onChange={() =>
                          setAnswers((a) => {
                            const n = [...a];
                            n[idx] = i;
                            return n;
                          })
                        }
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm text-foreground/70">
              Score: {submitted ? `${score}/${prepared.length}` : "––/––"}
            </div>
            {!submitted ? (
              <Button onClick={submit} disabled={!allAnswered}>
                Submit Quiz
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={startAttempt}>
                  Retry (new questions)
                </Button>
                <Button disabled>
                  {isPerfect
                    ? alreadyCompleted
                      ? "Perfect! (no points)"
                      : "Perfect! Points awarded"
                    : "Submitted"}
                </Button>
              </div>
            )}
          </div>

          {submitted && !isPerfect && (
            <p className="mt-3 text-sm text-amber-700">
              Points are awarded only for a perfect score. Try again!
            </p>
          )}
          {submitted && isPerfect && !alreadyCompleted && (
            <p className="mt-3 text-sm text-green-700">
              Congrats! You earned {pointsPerQuiz} points.
            </p>
          )}
        </>
      )}
    </div>
  );
}
