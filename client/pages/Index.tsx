import { useMemo, useState } from "react";
import { LevelSelector, type EducationLevel } from "@/components/LevelSelector";
import { getCourses } from "@/services/coursesStore";
import { CourseCard } from "@/components/CourseCard";
import { LeaderboardPreview } from "@/components/LeaderboardPreview";
import { RewardsPreview } from "@/components/RewardsPreview";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Index() {
  const [level, setLevel] = useState<EducationLevel>(
    (localStorage.getItem("ecolearn_level") as EducationLevel) ||
      JSON.parse(localStorage.getItem("ecolearn_users") || "{}")?.[
        localStorage.getItem("ecolearn_current_user") || ""
      ]?.educationLevel ||
      "elementary",
  );
  const coursesAll = useMemo(() => getCourses(), []);
  const courses = useMemo(
    () => coursesAll.filter((c) => c.audience.includes(level)),
    [coursesAll, level],
  );

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-100 via-white to-sky-100" />
        <div className="container mx-auto py-16 md:py-24">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-primary shadow-sm">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2Fcdeaae3f0e5c4f16a396edb9efd87c69%2F14569a937ac94ba3a7daa9bf4794521b"
                  alt="EcoGamify emblem"
                  className="h-6 w-6 rounded-md object-cover"
                />
                <Link
                  to="/simulation"
                  className="flex cursor-pointer pointer-events-auto font-semibold"
                >
                  EcoGamify Planet Lab
                </Link>
              </div>
              <h1 className="mt-4 text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05]">
                Learn the planet. Play the future. Earn rewards.
              </h1>
              <p className="mt-4 text-lg text-foreground/70">
                EcoGamify blends personalized lessons, immersive simulations,
                and gamified rewards to build real-world sustainability skills.
              </p>
              <div className="mt-6">
                <p className="mb-2 text-sm font-medium">
                  Choose your education level
                </p>
                <LevelSelector value={level} onChange={setLevel} />
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-foreground/70">
                <span className="flex items-center gap-2">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-primary" />{" "}
                  Beginner
                </span>
                <span className="flex items-center gap-2">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" />{" "}
                  Intermediate
                </span>
                <span className="flex items-center gap-2">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-lime-500" />{" "}
                  Advanced
                </span>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link
                    to="/simulation"
                    className="pointer-events-auto cursor-pointer"
                  >
                    Launch EcoSphere Simulation
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link
                    to="/courses"
                    className="pointer-events-auto cursor-pointer"
                  >
                    Explore Courses
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -left-12 -top-10 hidden h-32 w-32 rotate-12 rounded-full bg-emerald-300/30 blur-3xl md:block" />
              <div className="grid grid-cols-2 gap-3">
                <img
                  src="https://images.unsplash.com/photo-1523978591478-c753949ff840?q=80&w=800&auto=format&fit=crop"
                  alt="Recycling"
                  className="h-36 w-full rounded-xl object-cover shadow-md md:h-48"
                />
                <img
                  src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=800&auto=format&fit=crop"
                  alt="Forest"
                  className="h-36 w-full rounded-xl object-cover shadow-md md:h-64"
                />
                <img
                  src="https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=800&auto=format&fit=crop"
                  alt="Solar panels"
                  className="h-36 w-full rounded-xl object-cover shadow-md md:h-40"
                />
                <img
                  src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800&auto=format&fit=crop"
                  alt="Ocean"
                  className="h-36 w-full rounded-xl object-cover shadow-md md:h-44"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simulation spotlight */}
      <section className="border-t bg-gradient-to-r from-emerald-900 via-emerald-700 to-sky-700 text-white">
        <div className="container mx-auto py-14">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tight">
                EcoSphere Simulation
              </h2>
              <p className="text-sm uppercase tracking-[0.3em] text-white/70">
                Daily Challenges • Dynamic Weather • Climate Scenarios
              </p>
              <p className="text-lg text-white/90">
                Balance forests, wetlands, clean energy, and communities.
                Respond to heatwaves, storms, and droughts while completing
                daily eco challenges for bonus points.
              </p>
              <ul className="grid gap-2 text-sm text-white/80">
                <li>✔️ Live weather systems influence ecosystem health</li>
                <li>
                  ✔️ Earn bonus points by finishing rotating daily challenges
                </li>
                <li>
                  ✔️ Track biodiversity, pollution, and clean energy metrics
                </li>
              </ul>
              <div className="pt-2">
                <Button
                  asChild
                  variant="secondary"
                  className="bg-white text-emerald-900 hover:bg-emerald-100"
                >
                  <Link
                    to="/simulation"
                    className="pointer-events-auto cursor-pointer"
                  >
                    Play the Simulation
                  </Link>
                </Button>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <img
                src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800&auto=format&fit=crop"
                alt="Healthy mangroves"
                className="h-48 w-full rounded-2xl object-cover shadow-lg"
              />
              <img
                src="https://images.unsplash.com/photo-1542601098-8fc114e148e2?q=80&w=800&auto=format&fit=crop"
                alt="Solar farm"
                className="h-48 w-full rounded-2xl object-cover shadow-lg"
              />
              <img
                src="https://images.unsplash.com/photo-1489515217757-5fd1be406fef?q=80&w=800&auto=format&fit=crop"
                alt="Urban sustainability"
                className="h-48 w-full rounded-2xl object-cover shadow-lg md:col-span-2"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Courses */}
      <section className="border-t bg-gradient-to-b from-white to-secondary/40">
        <div className="container mx-auto py-12">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Personalized Courses
              </h2>
              <p className="mt-1 text-foreground/70">
                Beginner, Intermediate, and Advanced modules with quizzes after
                each lesson.
              </p>
            </div>
            <a className="text-primary hover:underline" href="/courses">
              View all
            </a>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {courses.slice(0, 3).map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        </div>
      </section>

      {/* Progress & Community */}
      <section className="border-t">
        <div className="container mx-auto grid gap-6 py-12 lg:grid-cols-2">
          <LeaderboardPreview />
          <RewardsPreview />
        </div>
      </section>

      {/* Visual gallery */}
      <section className="border-t bg-white">
        <div className="container mx-auto py-14">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              Inspired by the planet we protect
            </h2>
            <p className="mt-2 text-foreground/70">
              Explore real-world sustainability wins—from thriving forests to
              resilient cities and clean energy landscapes.
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <img
              src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=900&auto=format&fit=crop"
              alt="Reforestation"
              className="h-56 w-full rounded-2xl object-cover shadow-md"
            />
            <img
              src="https://images.unsplash.com/photo-1509395176047-4a66953fd231?q=80&w=900&auto=format&fit=crop"
              alt="Community garden"
              className="h-56 w-full rounded-2xl object-cover shadow-md"
            />
            <img
              src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=900&auto=format&fit=crop"
              alt="Wind turbines"
              className="h-56 w-full rounded-2xl object-cover shadow-md"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
