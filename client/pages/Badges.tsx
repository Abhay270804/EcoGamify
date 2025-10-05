import { COURSES } from "@/data/curriculum";
import { getBadges } from "@/services/progress";
import { LevelBadgeIcon } from "@/components/BadgeIcon";

export default function BadgesPage() {
  const owned = getBadges();
  const all = COURSES.map((c) => ({
    id: c.badge.id,
    label: c.badge.label,
    level: c.level,
  }));
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Badges</h1>
      <p className="mt-1 text-foreground/70">
        Earn badges by completing all lessons of a course with perfect quiz
        scores.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {all.map((b) => {
          const has = !!owned[b.id];
          return (
            <div
              key={b.id}
              className={`rounded-xl border p-5 ${has ? "bg-white/80" : "bg-secondary/40"}`}
            >
              <div className="flex items-center gap-3">
                <LevelBadgeIcon level={b.level as any} />
                <div>
                  <div className="font-semibold">{b.label}</div>
                  <div className="text-xs text-foreground/60">
                    {has ? "Unlocked" : "Locked"}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
