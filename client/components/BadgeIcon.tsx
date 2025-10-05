export function LevelBadgeIcon({
  level,
}: {
  level: "Beginner" | "Intermediate" | "Advanced" | "Master";
}) {
  const map: Record<string, string> = {
    Beginner: "🐣",
    Intermediate: "🦉",
    Advanced: "🎓",
    Master: "🏛️",
  };
  return (
    <span aria-label={level} title={level} className="text-lg">
      {map[level] || "🎖️"}
    </span>
  );
}
